import { expect, test } from '@playwright/test'
import {
  CRASH_SKIP_LIST,
  executeProblem,
  getDsaProblems,
} from '../src/engine/problems/problemTestUtils'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'

type DsaProblemRunCase = {
  id: string
  name: string
  route: string
  expectedStepCount: number
  expectedOutput: string[]
  shouldSkip: boolean
}

const dsaProblems = getDsaProblems()
const dsaProblemRuns: DsaProblemRunCase[] = dsaProblems.map((problem) => {
  const shouldSkip = CRASH_SKIP_LIST.has(problem.id)
  const result = shouldSkip ? null : executeProblem(problem.code)

  return {
    id: problem.id,
    name: problem.name,
    route: `/dsa/${problem.id}`,
    expectedStepCount: result?.stepCount ?? 0,
    expectedOutput: result?.consoleOutput ?? [],
    shouldSkip,
  }
})

if (dsaProblemRuns.length === 0) {
  throw new Error('No DSA problems discovered for analyze-flow testing')
}

test.describe('DSA Analyze flow', () => {
  let appReachable = false

  test.beforeAll(async () => {
    try {
      const response = await fetch(baseURL, { method: 'GET' })
      appReachable = response.status > 0 && response.status < 500
    } catch {
      appReachable = false
    }
  })

  test.beforeEach(() => {
    test.skip(
      !appReachable,
      `App server not reachable at ${baseURL}. Start the app and set PLAYWRIGHT_BASE_URL if needed.`,
    )
  })

  for (const testCase of dsaProblemRuns) {
    if (testCase.shouldSkip) {
      test.skip(`${testCase.name} (${testCase.id}) analyze flow (skipped: crashes interpreter)`, () => {})
      continue
    }

    test(`${testCase.name} (${testCase.id}) analyze flow and completes`, async ({ page }) => {
      expect(testCase.expectedStepCount).toBeGreaterThan(0)
      await page.goto(testCase.route)
      await page.waitForLoadState('networkidle')

      const analyzeButton = page.getByRole('button', { name: 'Analyze' })
      await expect(analyzeButton).toBeVisible()
      await analyzeButton.click()

      const stepCounter = page.getByText(/^Step \d+\/\d+$/)
      await expect(stepCounter).toBeVisible()
      await expect(stepCounter).toHaveText(`Step 1/${testCase.expectedStepCount}`)

      const runToEndButton = page.getByTitle('Run to End')
      await runToEndButton.click()

      await expect(stepCounter).toHaveText(
        `Step ${testCase.expectedStepCount}/${testCase.expectedStepCount}`,
      )
      await expect(runToEndButton).toBeDisabled()

      if (testCase.expectedOutput.length > 0) {
        const firstExpectedLine = testCase.expectedOutput[0]
        const lastExpectedLine = testCase.expectedOutput[testCase.expectedOutput.length - 1]

        if (firstExpectedLine) {
          await expect(page.getByText(firstExpectedLine).first()).toBeVisible()
        }
        if (lastExpectedLine && lastExpectedLine !== firstExpectedLine) {
          await expect(page.getByText(lastExpectedLine).first()).toBeVisible()
        }
      }
    })
  }
})

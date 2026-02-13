import { describe, it, expect } from 'vitest'
import { parseCode } from '../parser'
import { executeProblem, getProblemsForCategory, CRASH_SKIP_LIST } from './problemTestUtils'

const categories = ['async-js', 'promise-polyfills'] as const
const problems = categories.flatMap(cat => getProblemsForCategory(cat))

const seen = new Set<string>()
const uniqueProblems = problems.filter(p => {
  if (seen.has(p.id)) return false
  seen.add(p.id)
  return true
})

describe('Async & Promise Problems', () => {
  it('has problems to test', () => {
    expect(uniqueProblems.length).toBeGreaterThan(0)
  })

  for (const problem of uniqueProblems) {
    const shouldSkip = CRASH_SKIP_LIST.has(problem.id)

    describe(problem.name, () => {
      it('parses without errors', () => {
        const { success, error } = parseCode(problem.code)
        expect(success, error?.message).toBe(true)
      })

      if (shouldSkip) {
        it.skip('executes (skipped: crashes interpreter)', () => {})
        it.skip('completes with expected step count (skipped: crashes interpreter)', () => {})
        it.skip('produces expected console output (skipped: crashes interpreter)', () => {})
      } else {
        it('executes without errors', () => {
          const result = executeProblem(problem.code)
          expect(result.error).toBeNull()
        })

        it('completes with expected step count', () => {
          const result = executeProblem(problem.code)
          expect(result.stepCount).toBeGreaterThan(0)
          expect(result.stepCount).toBeLessThan(10000)
          expect(result.stepCount).toMatchSnapshot()
        })

        it('console output matches snapshot', () => {
          const result = executeProblem(problem.code)
          expect(result.consoleOutput.join('\n')).toMatchSnapshot()
        })
      }
    })
  }
})

import { describe, it, expect } from 'vitest'
import { parseCode } from '../parser'
import { executeProblem, getProblemsForCategory, CRASH_SKIP_LIST } from './problemTestUtils'

const categories = ['bit-manipulation', 'arrays-hashing'] as const
const problems = categories.flatMap(cat => getProblemsForCategory(cat))

const seen = new Set<string>()
const uniqueProblems = problems.filter(p => {
  if (seen.has(p.id)) return false
  seen.add(p.id)
  return true
})

describe('DSA Problems (Bit Manipulation & Arrays/Hashing)', () => {
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
      } else {
        it('executes without errors', () => {
          const result = executeProblem(problem.code)
          expect(result.error).toBeNull()
        })

        it('completes within step limit', () => {
          const result = executeProblem(problem.code)
          expect(result.stepCount).toBeGreaterThan(0)
          expect(result.stepCount).toBeLessThan(10000)
        })

        it('console output matches snapshot', () => {
          const result = executeProblem(problem.code)
          expect(result.consoleOutput.join('\n')).toMatchSnapshot()
        })
      }
    })
  }
})

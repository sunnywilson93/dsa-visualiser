import { codeExamples } from '@/data/examples'
import { parseCode } from '../parser'
import { Interpreter } from '../interpreter'

/**
 * Problems that crash the interpreter (infinite recursion, etc.)
 * These get parse-only tests instead of execution tests.
 */
export const CRASH_SKIP_LIST = new Set([
  'find-node-in-tree', // Maximum call stack size exceeded
])

export interface ExecutionResult {
  steps: ReturnType<Interpreter['execute']>
  consoleOutput: string[]
  stepCount: number
  error: null
}

export interface ExecutionError {
  steps: null
  consoleOutput: string[]
  stepCount: 0
  error: string
}

export type ProblemResult = ExecutionResult | ExecutionError

/**
 * Parse and execute a problem's code through the interpreter.
 * Returns steps, console output, step count, and any error.
 */
export function executeProblem(code: string): ProblemResult {
  const { ast, success, error } = parseCode(code)
  if (!success || !ast) {
    return {
      steps: null,
      consoleOutput: [],
      stepCount: 0,
      error: error?.message ?? 'Parse error',
    }
  }

  try {
    const interpreter = new Interpreter()
    const steps = interpreter.execute(ast)
    return {
      steps,
      consoleOutput: interpreter.getConsoleOutput(),
      stepCount: steps.length,
      error: null,
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return {
      steps: null,
      consoleOutput: [],
      stepCount: 0,
      error: msg,
    }
  }
}

/**
 * Get all problems for a given category from codeExamples.
 */
export function getProblemsForCategory(category: string) {
  return codeExamples.filter(p => {
    const cats = p.categories ?? [p.category]
    return cats.includes(category)
  })
}

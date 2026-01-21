import type { Node, CallExpression, ArrowFunctionExpression, FunctionExpression, Program, Statement, ExpressionStatement, VariableDeclaration, BlockStatement } from 'acorn'
import { parseCode } from './parser'

export interface EventLoopStep {
  description: string
  codeLine: number
  callStack: string[]
  microQueue: string[]
  macroQueue: string[]
  output: string[]
  phase: 'sync' | 'micro' | 'macro' | 'idle'
  activeWebApi?: string
}

export interface AnalyzerWarning {
  message: string
  line?: number
}

export interface AnalyzeResult {
  success: boolean
  steps: EventLoopStep[]
  warnings: AnalyzerWarning[]
  error?: string
}

interface ScheduledTask {
  type: 'micro' | 'macro'
  label: string
  callbackLine: number
  callback?: Node
  source: string
}

interface SyncTask {
  type: 'console.log' | 'function-call' | 'function-def' | 'await' | 'schedule-micro' | 'schedule-macro'
  label: string
  line: number
  outputValue?: string
  scheduledTask?: ScheduledTask
  functionName?: string
}

const MAX_STEPS = 500
const MAX_ITERATIONS = 50

export function analyzeEventLoop(code: string): AnalyzeResult {
  const warnings: AnalyzerWarning[] = []

  const parseResult = parseCode(code)
  if (!parseResult.success || !parseResult.ast) {
    return {
      success: false,
      steps: [],
      warnings: [],
      error: parseResult.error?.message ?? 'Failed to parse code',
    }
  }

  const unsupportedPatterns = detectUnsupportedPatterns(code)
  warnings.push(...unsupportedPatterns)

  const codeLines = code.split('\n')
  const syncTasks = extractSyncTasks(parseResult.ast, codeLines)
  const steps = generateSteps(syncTasks, codeLines)

  if (steps.length >= MAX_STEPS) {
    warnings.push({ message: `Output truncated at ${MAX_STEPS} steps` })
  }

  return {
    success: true,
    steps,
    warnings,
  }
}

function detectUnsupportedPatterns(code: string): AnalyzerWarning[] {
  const warnings: AnalyzerWarning[] = []

  const patterns = [
    { regex: /Promise\.(all|race|any|allSettled)\s*\(/, message: 'Promise.all/race/any/allSettled treated as immediate resolution' },
    { regex: /\.catch\s*\(/, message: 'Error handling (.catch) not simulated' },
    { regex: /Promise\.reject/, message: 'Promise.reject not simulated' },
    { regex: /try\s*\{/, message: 'try/catch blocks not simulated for error flow' },
    { regex: /for\s+await/, message: 'for-await loops not supported' },
    { regex: /setInterval\s*\(/, message: 'setInterval shows only first iteration' },
    { regex: /fetch\s*\(/, message: 'fetch() treated as immediate resolution' },
  ]

  for (const { regex, message } of patterns) {
    if (regex.test(code)) {
      warnings.push({ message })
    }
  }

  return warnings
}

function extractSyncTasks(ast: Program, codeLines: string[]): SyncTask[] {
  const tasks: SyncTask[] = []

  // Walk only top-level statements (not inside callbacks)
  for (const stmt of ast.body) {
    extractTasksFromStatement(stmt, tasks, codeLines, false)
  }

  // Sort by line number
  tasks.sort((a, b) => a.line - b.line)

  return tasks
}

function extractTasksFromStatement(node: Node, tasks: SyncTask[], codeLines: string[], insideCallback: boolean): void {
  if (!node) return

  const line = node.loc?.start.line ?? 1

  switch (node.type) {
    case 'ExpressionStatement': {
      const expr = (node as ExpressionStatement).expression
      extractTasksFromExpression(expr, tasks, codeLines, insideCallback)
      break
    }
    case 'FunctionDeclaration': {
      // Skip function body during sync extraction - only note the declaration
      break
    }
    case 'VariableDeclaration': {
      const varDecl = node as unknown as VariableDeclaration
      for (const decl of varDecl.declarations) {
        if (decl.init) {
          extractTasksFromExpression(decl.init, tasks, codeLines, insideCallback)
        }
      }
      break
    }
  }
}

function extractTasksFromExpression(node: Node, tasks: SyncTask[], codeLines: string[], insideCallback: boolean): void {
  if (!node) return

  const line = node.loc?.start.line ?? 1

  if (node.type === 'CallExpression') {
    const call = node as CallExpression

    // console.log detection
    if (isConsoleLog(call) && !insideCallback) {
      const outputValue = extractConsoleLogValue(call, codeLines)
      tasks.push({
        type: 'console.log',
        label: `console.log('${outputValue}')`,
        line,
        outputValue,
      })
      return
    }

    // setTimeout detection
    if (isSetTimeout(call) && !insideCallback) {
      const callback = call.arguments[0]
      const callbackLine = getCallbackBodyLine(callback)
      tasks.push({
        type: 'schedule-macro',
        label: 'setTimeout()',
        line,
        scheduledTask: {
          type: 'macro',
          label: 'timeout cb',
          callbackLine,
          callback,
          source: 'setTimeout',
        },
      })
      return
    }

    // queueMicrotask detection
    if (isQueueMicrotask(call) && !insideCallback) {
      const callback = call.arguments[0]
      const callbackLine = getCallbackBodyLine(callback)
      tasks.push({
        type: 'schedule-micro',
        label: 'queueMicrotask()',
        line,
        scheduledTask: {
          type: 'micro',
          label: 'microtask',
          callbackLine,
          callback,
          source: 'queueMicrotask',
        },
      })
      return
    }

    // Promise.resolve().then() detection - walk the call chain
    const promiseTask = extractPromiseTask(call, codeLines)
    if (promiseTask && !insideCallback) {
      tasks.push(promiseTask)
      return
    }

    // Check callee for chained calls (e.g., the .then() part of Promise.resolve().then())
    if (call.callee.type === 'MemberExpression') {
      const memberExpr = call.callee as { object: Node; property: Node }
      extractTasksFromExpression(memberExpr.object, tasks, codeLines, insideCallback)
    }
  }
}

function extractPromiseTask(node: CallExpression, codeLines: string[]): SyncTask | null {
  // Check if this is a .then() call
  if (node.callee.type !== 'MemberExpression') return null

  const callee = node.callee as { object: Node; property: Node }
  const prop = callee.property

  if (prop.type !== 'Identifier' || (prop as unknown as { name: string }).name !== 'then') return null

  // Check if it's on Promise.resolve() or another promise
  const obj = callee.object
  if (obj.type === 'CallExpression') {
    const objCall = obj as CallExpression
    if (objCall.callee.type === 'MemberExpression') {
      const innerCallee = objCall.callee as { object: Node; property: Node }
      const innerProp = innerCallee.property
      const innerObj = innerCallee.object

      // Promise.resolve().then()
      if (
        innerObj.type === 'Identifier' &&
        (innerObj as unknown as { name: string }).name === 'Promise' &&
        innerProp.type === 'Identifier' &&
        (innerProp as unknown as { name: string }).name === 'resolve'
      ) {
        const callback = node.arguments[0]
        const callbackLine = getCallbackBodyLine(callback)
        const label = extractPromiseLabel(callback, codeLines)

        return {
          type: 'schedule-micro',
          label: 'Promise.then()',
          line: node.loc?.start.line ?? 1,
          scheduledTask: {
            type: 'micro',
            label: label || 'promise cb',
            callbackLine,
            callback,
            source: 'Promise.then',
          },
        }
      }
    }

    // Chained .then().then()
    const chainedTask = extractPromiseTask(objCall, codeLines)
    if (chainedTask) {
      // This is a chained .then(), add it too
      const callback = node.arguments[0]
      const callbackLine = getCallbackBodyLine(callback)
      const label = extractPromiseLabel(callback, codeLines)

      return {
        type: 'schedule-micro',
        label: 'Promise.then()',
        line: node.loc?.start.line ?? 1,
        scheduledTask: {
          type: 'micro',
          label: label || 'chained promise cb',
          callbackLine,
          callback,
          source: 'Promise.then',
        },
      }
    }
  }

  return null
}

function generateSteps(syncTasks: SyncTask[], codeLines: string[]): EventLoopStep[] {
  const steps: EventLoopStep[] = []
  const callStack: string[] = ['<script>']
  const microQueue: ScheduledTask[] = []
  const macroQueue: ScheduledTask[] = []
  const output: string[] = []

  // Initial step
  steps.push({
    description: 'Script starts executing. Global execution context pushed to call stack.',
    codeLine: -1,
    callStack: [...callStack],
    microQueue: [],
    macroQueue: [],
    output: [],
    phase: 'sync',
  })

  // Process synchronous tasks
  for (const task of syncTasks) {
    if (steps.length >= MAX_STEPS) break

    switch (task.type) {
      case 'console.log':
        callStack.push(task.label)
        output.push(task.outputValue ?? '')
        steps.push({
          description: `${task.label} executes immediately (synchronous)`,
          codeLine: task.line - 1,
          callStack: [...callStack],
          microQueue: microQueue.map(t => t.label),
          macroQueue: macroQueue.map(t => t.label),
          output: [...output],
          phase: 'sync',
        })
        callStack.pop()
        break

      case 'schedule-macro':
        if (task.scheduledTask) {
          macroQueue.push(task.scheduledTask)
          steps.push({
            description: `${task.label} registers callback in Web APIs, adds to macrotask queue`,
            codeLine: task.line - 1,
            callStack: [...callStack],
            microQueue: microQueue.map(t => t.label),
            macroQueue: macroQueue.map(t => t.label),
            output: [...output],
            phase: 'sync',
            activeWebApi: 'setTimeout',
          })
        }
        break

      case 'schedule-micro':
        if (task.scheduledTask) {
          microQueue.push(task.scheduledTask)
          steps.push({
            description: `${task.label} registers callback in microtask queue`,
            codeLine: task.line - 1,
            callStack: [...callStack],
            microQueue: microQueue.map(t => t.label),
            macroQueue: macroQueue.map(t => t.label),
            output: [...output],
            phase: 'sync',
          })
        }
        break

      case 'function-call':
        callStack.push(task.label)
        steps.push({
          description: `${task.label} called - new execution context pushed`,
          codeLine: task.line - 1,
          callStack: [...callStack],
          microQueue: microQueue.map(t => t.label),
          macroQueue: macroQueue.map(t => t.label),
          output: [...output],
          phase: 'sync',
        })
        break

      case 'await':
        microQueue.push({
          type: 'micro',
          label: `${task.functionName} continuation`,
          callbackLine: task.line,
          source: 'await',
        })
        callStack.pop()
        steps.push({
          description: `await pauses ${task.functionName}! Rest of function queued as microtask.`,
          codeLine: task.line - 1,
          callStack: [...callStack],
          microQueue: microQueue.map(t => t.label),
          macroQueue: macroQueue.map(t => t.label),
          output: [...output],
          phase: 'sync',
        })
        break
    }
  }

  // Sync phase complete
  callStack.length = 0
  if (microQueue.length > 0 || macroQueue.length > 0) {
    steps.push({
      description: 'Synchronous code done. Script pops off. Event loop checks microtasks FIRST!',
      codeLine: -1,
      callStack: [],
      microQueue: microQueue.map(t => t.label),
      macroQueue: macroQueue.map(t => t.label),
      output: [...output],
      phase: 'idle',
    })
  }

  // Process microtask queue
  let iterations = 0
  while (microQueue.length > 0 && steps.length < MAX_STEPS && iterations < MAX_ITERATIONS) {
    iterations++
    const task = microQueue.shift()!
    callStack.push(task.label)

    // Execute microtask - extract any console.log inside
    const innerTasks = task.callback ? extractCallbackTasks(task.callback, codeLines) : []
    for (const inner of innerTasks) {
      if (inner.type === 'console.log') {
        output.push(inner.outputValue ?? '')
      } else if (inner.type === 'schedule-micro' && inner.scheduledTask) {
        microQueue.push(inner.scheduledTask)
      } else if (inner.type === 'schedule-macro' && inner.scheduledTask) {
        macroQueue.push(inner.scheduledTask)
      }
    }

    steps.push({
      description: `Microtask runs: ${task.label.replace(' cb', ' callback').replace(' continuation', ' resumes')}`,
      codeLine: task.callbackLine - 1,
      callStack: [...callStack],
      microQueue: microQueue.map(t => t.label),
      macroQueue: macroQueue.map(t => t.label),
      output: [...output],
      phase: 'micro',
    })

    callStack.pop()

    // Check for more microtasks after each
    if (microQueue.length > 0) {
      steps.push({
        description: 'Microtask queue not empty - process next microtask.',
        codeLine: -1,
        callStack: [],
        microQueue: microQueue.map(t => t.label),
        macroQueue: macroQueue.map(t => t.label),
        output: [...output],
        phase: 'micro',
      })
    }
  }

  // Transition to macrotasks
  if (macroQueue.length > 0 && microQueue.length === 0) {
    steps.push({
      description: 'Microtask queue empty. Now event loop processes macrotask queue.',
      codeLine: -1,
      callStack: [],
      microQueue: [],
      macroQueue: macroQueue.map(t => t.label),
      output: [...output],
      phase: 'idle',
    })
  }

  // Process macrotask queue
  iterations = 0
  while (macroQueue.length > 0 && steps.length < MAX_STEPS && iterations < MAX_ITERATIONS) {
    iterations++
    const task = macroQueue.shift()!
    callStack.push(task.label)

    // Execute macrotask - extract any inner tasks
    const innerTasks = task.callback ? extractCallbackTasks(task.callback, codeLines) : []
    for (const inner of innerTasks) {
      if (inner.type === 'console.log') {
        output.push(inner.outputValue ?? '')
      } else if (inner.type === 'schedule-micro' && inner.scheduledTask) {
        microQueue.push(inner.scheduledTask)
      } else if (inner.type === 'schedule-macro' && inner.scheduledTask) {
        macroQueue.push(inner.scheduledTask)
      }
    }

    steps.push({
      description: `Macrotask runs: ${task.label.replace(' cb', ' callback')}`,
      codeLine: task.callbackLine - 1,
      callStack: [...callStack],
      microQueue: microQueue.map(t => t.label),
      macroQueue: macroQueue.map(t => t.label),
      output: [...output],
      phase: 'macro',
    })

    callStack.pop()

    // After each macrotask, check microtasks
    while (microQueue.length > 0 && steps.length < MAX_STEPS) {
      const microTask = microQueue.shift()!
      callStack.push(microTask.label)

      const microInner = microTask.callback ? extractCallbackTasks(microTask.callback, codeLines) : []
      for (const inner of microInner) {
        if (inner.type === 'console.log') {
          output.push(inner.outputValue ?? '')
        } else if (inner.type === 'schedule-micro' && inner.scheduledTask) {
          microQueue.push(inner.scheduledTask)
        }
      }

      steps.push({
        description: `Nested microtask runs: ${microTask.label.replace(' cb', ' callback')}`,
        codeLine: microTask.callbackLine - 1,
        callStack: [...callStack],
        microQueue: microQueue.map(t => t.label),
        macroQueue: macroQueue.map(t => t.label),
        output: [...output],
        phase: 'micro',
      })

      callStack.pop()
    }

    // Check for next macrotask
    if (macroQueue.length > 0) {
      steps.push({
        description: 'Macrotask done. Check microtasks (empty), then next macrotask.',
        codeLine: -1,
        callStack: [],
        microQueue: [],
        macroQueue: macroQueue.map(t => t.label),
        output: [...output],
        phase: 'idle',
      })
    }
  }

  // Final idle state
  steps.push({
    description: 'All queues empty. Event loop waits for new tasks.',
    codeLine: -1,
    callStack: [],
    microQueue: [],
    macroQueue: [],
    output: [...output],
    phase: 'idle',
  })

  return steps
}

function extractCallbackTasks(callback: Node, codeLines: string[]): SyncTask[] {
  const tasks: SyncTask[] = []

  // Get the callback body
  let body: Node | null = null
  if (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression') {
    body = (callback as ArrowFunctionExpression | FunctionExpression).body
  }

  if (!body) return tasks

  // If body is a block statement, walk its statements
  if (body.type === 'BlockStatement') {
    const block = body as unknown as BlockStatement
    for (const stmt of block.body) {
      extractCallbackStatementTasks(stmt, tasks, codeLines)
    }
  } else {
    // Arrow function with expression body
    extractCallbackExpressionTasks(body, tasks, codeLines)
  }

  return tasks
}

function extractCallbackStatementTasks(stmt: Statement, tasks: SyncTask[], codeLines: string[]): void {
  if (stmt.type === 'ExpressionStatement') {
    extractCallbackExpressionTasks((stmt as ExpressionStatement).expression, tasks, codeLines)
  }
}

function extractCallbackExpressionTasks(expr: Node, tasks: SyncTask[], codeLines: string[]): void {
  if (expr.type !== 'CallExpression') return

  const call = expr as CallExpression
  const line = call.loc?.start.line ?? 1

  if (isConsoleLog(call)) {
    const outputValue = extractConsoleLogValue(call, codeLines)
    tasks.push({
      type: 'console.log',
      label: `console.log('${outputValue}')`,
      line,
      outputValue,
    })
  } else if (isSetTimeout(call)) {
    const cb = call.arguments[0]
    tasks.push({
      type: 'schedule-macro',
      label: 'setTimeout()',
      line,
      scheduledTask: {
        type: 'macro',
        label: 'nested timeout cb',
        callbackLine: getCallbackBodyLine(cb),
        callback: cb,
        source: 'setTimeout',
      },
    })
  } else if (isQueueMicrotask(call)) {
    const cb = call.arguments[0]
    tasks.push({
      type: 'schedule-micro',
      label: 'queueMicrotask()',
      line,
      scheduledTask: {
        type: 'micro',
        label: 'nested microtask',
        callbackLine: getCallbackBodyLine(cb),
        callback: cb,
        source: 'queueMicrotask',
      },
    })
  } else {
    // Check for Promise.then
    const promiseTask = extractPromiseTask(call, codeLines)
    if (promiseTask) {
      tasks.push({
        ...promiseTask,
        scheduledTask: promiseTask.scheduledTask ? {
          ...promiseTask.scheduledTask,
          label: 'nested promise cb',
        } : undefined,
      })
    }
  }
}

// Helper functions
function isConsoleLog(node: CallExpression): boolean {
  const callee = node.callee
  if (callee.type === 'MemberExpression') {
    const obj = callee.object as { type: string; name?: string }
    const prop = callee.property as { type: string; name?: string }
    return (
      obj.type === 'Identifier' &&
      obj.name === 'console' &&
      prop.type === 'Identifier' &&
      prop.name === 'log'
    )
  }
  return false
}

function isSetTimeout(node: CallExpression): boolean {
  const callee = node.callee as { type: string; name?: string }
  return callee.type === 'Identifier' && callee.name === 'setTimeout'
}

function isQueueMicrotask(node: CallExpression): boolean {
  const callee = node.callee as { type: string; name?: string }
  return callee.type === 'Identifier' && callee.name === 'queueMicrotask'
}

function extractConsoleLogValue(node: CallExpression, codeLines: string[]): string {
  const arg = node.arguments[0]
  if (!arg) return ''

  if (arg.type === 'Literal') {
    return String((arg as { value: unknown }).value)
  }

  // Try to extract from code
  if (arg.loc) {
    const line = codeLines[arg.loc.start.line - 1]
    if (line) {
      const match = line.match(/console\.log\s*\(\s*['"`]([^'"`]+)['"`]/)
      if (match) return match[1]

      // Try to get the argument portion
      const argMatch = line.match(/console\.log\s*\((.+)\)/)
      if (argMatch) {
        const argStr = argMatch[1].trim()
        // Remove quotes if present
        if ((argStr.startsWith("'") && argStr.endsWith("'")) ||
            (argStr.startsWith('"') && argStr.endsWith('"'))) {
          return argStr.slice(1, -1)
        }
        return argStr
      }
    }
  }

  return '...'
}

function extractPromiseLabel(callback: Node | undefined, codeLines: string[]): string {
  if (!callback) return ''

  // Get the callback body
  let body: Node | null = null
  if (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression') {
    body = (callback as ArrowFunctionExpression | FunctionExpression).body
  }

  if (!body) return ''

  // Try to find console.log inside
  if (body.type === 'CallExpression' && isConsoleLog(body as CallExpression)) {
    return extractConsoleLogValue(body as CallExpression, codeLines) + ' cb'
  }

  if (body.type === 'BlockStatement') {
    const block = body as unknown as BlockStatement
    for (const stmt of block.body) {
      if (stmt.type === 'ExpressionStatement') {
        const expr = (stmt as ExpressionStatement).expression
        if (expr.type === 'CallExpression' && isConsoleLog(expr as CallExpression)) {
          return extractConsoleLogValue(expr as CallExpression, codeLines) + ' cb'
        }
      }
    }
  }

  return ''
}

function getCallbackBodyLine(callback: Node | undefined): number {
  if (!callback) return 1

  if (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression') {
    const body = (callback as ArrowFunctionExpression | FunctionExpression).body
    return body.loc?.start.line ?? callback.loc?.start.line ?? 1
  }

  return callback.loc?.start.line ?? 1
}

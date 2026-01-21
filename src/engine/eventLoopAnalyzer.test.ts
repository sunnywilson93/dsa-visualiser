import { describe, it, expect } from 'vitest'
import { analyzeEventLoop, EventLoopStep } from './eventLoopAnalyzer'

describe('eventLoopAnalyzer', () => {
  describe('basic sync code', () => {
    it('should handle simple console.log', () => {
      const code = `console.log('hello')`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)
      expect(result.steps.length).toBeGreaterThan(0)

      const outputStep = result.steps.find(s => s.output.includes('hello'))
      expect(outputStep).toBeDefined()
    })

    it('should handle multiple sync console.logs in order', () => {
      const code = `
console.log('1')
console.log('2')
console.log('3')
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)
      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.output).toEqual(['1', '2', '3'])
    })
  })

  describe('setTimeout (macrotask)', () => {
    it('should schedule setTimeout callback to macrotask queue', () => {
      const code = `
console.log('start')
setTimeout(() => {
  console.log('timeout')
}, 0)
console.log('end')
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      // Check that macrotask gets queued during sync phase
      const macroQueuedStep = result.steps.find(
        s => s.macroQueue.length > 0 && s.phase === 'sync'
      )
      expect(macroQueuedStep).toBeDefined()

      // Final output order: start, end, timeout
      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.output).toEqual(['start', 'end', 'timeout'])
    })
  })

  describe('Promise.then (microtask)', () => {
    it('should schedule Promise.then callback to microtask queue', () => {
      const code = `
console.log('start')
Promise.resolve().then(() => {
  console.log('promise')
})
console.log('end')
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      // Check that microtask gets queued
      const microQueuedStep = result.steps.find(
        s => s.microQueue.length > 0 && s.phase === 'sync'
      )
      expect(microQueuedStep).toBeDefined()

      // Final output order: start, end, promise
      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.output).toEqual(['start', 'end', 'promise'])
    })

    it('should process microtasks before macrotasks', () => {
      const code = `
console.log('1')
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('2')
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      // promise should come before timeout in output
      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.output).toEqual(['1', '2', 'promise', 'timeout'])
    })
  })

  describe('queueMicrotask', () => {
    it('should schedule to microtask queue', () => {
      const code = `
console.log('start')
queueMicrotask(() => {
  console.log('microtask')
})
console.log('end')
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.output).toEqual(['start', 'end', 'microtask'])
    })
  })

  describe('nested async patterns', () => {
    it('should handle setTimeout inside setTimeout', () => {
      const code = `
console.log('start')
setTimeout(() => {
  console.log('outer')
  setTimeout(() => {
    console.log('inner')
  }, 0)
}, 0)
console.log('end')
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.output).toEqual(['start', 'end', 'outer', 'inner'])
    })

    it('should handle Promise inside setTimeout', () => {
      const code = `
console.log('start')
setTimeout(() => {
  console.log('timeout')
  Promise.resolve().then(() => {
    console.log('promise in timeout')
  })
}, 0)
console.log('end')
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      const finalStep = result.steps[result.steps.length - 1]
      // promise in timeout runs as microtask during macrotask phase
      expect(finalStep.output).toEqual(['start', 'end', 'timeout', 'promise in timeout'])
    })
  })

  describe('phase tracking', () => {
    it('should correctly track phases', () => {
      const code = `
console.log('sync')
setTimeout(() => console.log('macro'), 0)
Promise.resolve().then(() => console.log('micro'))
`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      // Should have sync phase steps
      const syncSteps = result.steps.filter(s => s.phase === 'sync')
      expect(syncSteps.length).toBeGreaterThan(0)

      // Should have micro phase steps
      const microSteps = result.steps.filter(s => s.phase === 'micro')
      expect(microSteps.length).toBeGreaterThan(0)

      // Should have macro phase steps
      const macroSteps = result.steps.filter(s => s.phase === 'macro')
      expect(macroSteps.length).toBeGreaterThan(0)

      // Should end with idle phase
      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.phase).toBe('idle')
    })
  })

  describe('error handling', () => {
    it('should return error for invalid syntax', () => {
      const code = `console.log('unterminated`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should detect unsupported patterns and add warnings', () => {
      const code = `
Promise.all([p1, p2]).then(console.log)
`
      const result = analyzeEventLoop(code)

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some(w => w.message.includes('Promise.all'))).toBe(true)
    })
  })

  describe('call stack tracking', () => {
    it('should push and pop from call stack correctly', () => {
      const code = `console.log('test')`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      // Find step where console.log is on the stack
      const consoleLogStep = result.steps.find(
        s => s.callStack.some(c => c.includes('console.log'))
      )
      expect(consoleLogStep).toBeDefined()

      // Final step should have empty call stack
      const finalStep = result.steps[result.steps.length - 1]
      expect(finalStep.callStack).toEqual([])
    })

    it('should show <script> in call stack during sync phase', () => {
      const code = `console.log('test')`
      const result = analyzeEventLoop(code)

      const scriptStep = result.steps.find(
        s => s.callStack.includes('<script>') && s.phase === 'sync'
      )
      expect(scriptStep).toBeDefined()
    })
  })

  describe('codeLine tracking', () => {
    it('should track correct code lines', () => {
      const code = `console.log('line1')
console.log('line2')`
      const result = analyzeEventLoop(code)

      expect(result.success).toBe(true)

      // Find steps with actual line numbers (not -1)
      const stepsWithLines = result.steps.filter(s => s.codeLine >= 0)
      expect(stepsWithLines.length).toBeGreaterThan(0)

      // Line numbers are 0-indexed in steps (matching EventLoopViz convention)
      const line1Step = stepsWithLines.find(s => s.codeLine === 0)
      const line2Step = stepsWithLines.find(s => s.codeLine === 1)
      expect(line1Step).toBeDefined()
      expect(line2Step).toBeDefined()
    })
  })
})

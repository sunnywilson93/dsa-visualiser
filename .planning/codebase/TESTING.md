# Testing Patterns

**Analysis Date:** 2026-01-23

## Test Framework

**Runner:**
- Vitest 4.0.16
- Config: `vitest.config.ts`

**Test Environment:**
- jsdom (browser environment simulation)
- Globals enabled: `describe`, `it`, `expect` available without import

**Assertion Library:**
- Vitest built-in matchers (vitest `expect`)
- @testing-library/jest-dom for DOM assertions
- React Testing Library for component testing

**Run Commands:**
```bash
npm test                # Run tests in watch mode (default vitest behavior)
npm run test:run        # Single test run (CI mode)
npm run test:coverage   # Generate coverage report (text, json, html)
```

Run specific test file:
```bash
npm test -- interpreter.test.ts
```

## Test File Organization

**Location:**
- Co-located with source: `.test.ts` or `.test.tsx` suffix in same directory as implementation
- Example: `src/engine/interpreter.ts` → `src/engine/interpreter.test.ts`
- Dedicated test utilities: `src/__tests__/setup.ts`

**Naming:**
- `*.test.ts` for TypeScript unit tests
- `*.test.tsx` for React component tests
- Describe blocks use plain English: `'Interpreter'`, `'Variable Declarations'`

**Test Discovery:**
- Pattern in config: `include: ['src/**/*.test.{ts,tsx}']`
- Current test files found:
  - `src/engine/interpreter.test.ts` - core interpreter logic (40+ test cases)
  - `src/engine/languageDetector.test.ts` - language detection (41+ test cases)
  - `src/engine/eventLoopAnalyzer.test.ts` - event loop simulation (24+ test cases)

## Test Structure

**Suite Organization:**

```typescript
describe('Interpreter', () => {
  describe('Variable Declarations', () => {
    it('should handle var declaration', () => {
      // test code
    })

    it('should handle let declaration', () => {
      // test code
    })
  })

  describe('Assignments', () => {
    it('should handle simple assignment', () => {
      // test code
    })
  })
})
```

**Patterns:**

1. **Helper Functions at Top Level:**
   ```typescript
   function executeCode(code: string) {
     const { ast } = parseCode(code)
     if (!ast) throw new Error('Failed to parse code')
     const interpreter = new Interpreter()
     return interpreter.execute(ast)
   }

   function getPrimitiveValue(rv: RuntimeValue): number | string | boolean {
     return (rv as PrimitiveValue).value
   }

   function getArrayElements(rv: RuntimeValue): RuntimeValue[] {
     return (rv as ArrayValue).elements
   }
   ```

2. **Setup/Teardown:**
   - Global setup in `src/__tests__/setup.ts`
   - Cleanup after each test: `afterEach(() => { cleanup() })`
   - Mock window APIs once globally (matchMedia, ResizeObserver, IntersectionObserver)

3. **Assertion Patterns:**
   ```typescript
   // Existence checks
   expect(steps.length).toBeGreaterThan(0)
   expect(assignmentStep).toBeDefined()
   expect(finalScope.variables.x).toBeDefined()

   // Value assertions
   expect(steps[0].type).toBe('declaration')
   expect(getPrimitiveValue(finalScope.variables.x)).toBe(8)
   expect(finalStep.output).toEqual(['start', 'end', 'timeout'])

   // Array/collection checks
   expect(callStep?.callStack.length).toBeGreaterThanOrEqual(1)
   ```

## Mocking

**Framework:** Vitest built-in mocking (vi not required for setup tests)

**Global Mocks Setup** (`src/__tests__/setup.ts`):
```typescript
// Window APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    // ... all required methods
  }),
})

// DOM APIs
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = class IntersectionObserver {
  // ... implementation stubs
}
```

**Patterns:**

- No explicit mocking of dependencies in unit tests; real implementations used
- Interpreter tests execute actual code and verify state
- Event loop tests use real async scheduling simulation
- Language detector tests use real pattern matching

**What to Mock:**
- Browser APIs (window.matchMedia, ResizeObserver, IntersectionObserver)
- DOM mutation/rendering (React Testing Library handles)

**What NOT to Mock:**
- Parser logic (used as real parser in tests)
- Interpreter execution (core behavior being tested)
- Zustand store (test with real store state)
- Pattern matching/validation (real implementations provide correctness verification)

## Fixtures and Factories

**Test Data:**

Language detection test examples at `src/engine/languageDetector.test.ts`:
```typescript
it('detects valid JavaScript with const/let', () => {
  const result = detectLanguage('const x = 5; let y = 10;')
  expect(result.isLikelyJavaScript).toBe(true)
})

it('detects Python function definition', () => {
  const result = detectLanguage('def hello():\n  print("hi")')
  expect(result.isLikelyJavaScript).toBe(false)
  expect(result.detectedLanguage).toBe('python')
})
```

Event loop test data from `src/engine/eventLoopAnalyzer.test.ts`:
```typescript
const code = `
console.log('start')
setTimeout(() => {
  console.log('timeout')
}, 0)
console.log('end')
`
```

**Location:**
- Inline within test cases (no separate fixture files)
- Helper functions like `executeCode()` handle common setup
- Complex data structures defined at describe block scope

## Coverage

**Requirements:** Not enforced (no coverage threshold in config)

**View Coverage:**
```bash
npm run test:coverage
```

**Coverage Config** (from `vitest.config.ts`):
- Provider: v8
- Reporters: text, json, html
- Excluded: node_modules, src/__tests__/, *.d.ts, *.config.*, src/main.tsx

## Test Types

**Unit Tests:**
- Scope: Single function/module isolation
- Approach: Direct function calls with input/output verification
- Examples:
  - `src/engine/interpreter.test.ts` - variable declarations, assignments, function calls, loops
  - `src/engine/languageDetector.test.ts` - pattern matching for JS vs Python
  - `src/engine/eventLoopAnalyzer.test.ts` - async execution order

**Integration Tests:**
- Scope: Multiple modules working together
- Approach: Full code execution with state inspection
- Examples:
  - Interpreter tests check execution steps produce correct state changes
  - Event loop tests verify console output order with setTimeout/Promises
  - Full code snippets parsed → interpreted → steps generated

**E2E Tests:**
- Status: Not implemented
- Rationale: Focus on unit and integration testing of core interpreter logic

## Common Patterns

**Async Testing:**
```typescript
// Event loop tests use synchronous simulation
// Promises and setTimeout handled by eventLoopAnalyzer internally
const code = `
console.log('start')
Promise.resolve().then(() => {
  console.log('promise')
})
console.log('end')
`
const result = analyzeEventLoop(code)
expect(result.success).toBe(true)
```

**Error Testing:**
```typescript
// Language detection for non-JS code
it('detects Python def keyword', () => {
  const result = detectLanguage('def hello():\n  pass')
  expect(result.detectedLanguage).toBe('python')
})

// Parsing errors
function executeCode(code: string) {
  const { ast } = parseCode(code)
  if (!ast) throw new Error('Failed to parse code')
  // ...
}
```

**State Verification:**
```typescript
// Inspect state after execution
const steps = executeCode('let x = 10;')
const finalScope = steps[steps.length - 1].scopes[0]
expect(finalScope.variables.x).toBeDefined()
expect(finalScope.variables.x.type).toBe('primitive')
```

**Skipped Tests:**
```typescript
// Tests marked with it.skip() are deferred until feature is complete
it.skip('should handle array.push', () => {
  // Note: Array method calls (.push, .pop, etc.) are not fully tracked
  // by the interpreter - skipping until support is added
  const steps = executeCode(`
    let arr = [1, 2];
    arr.push(3);
  `)

  const finalScope = steps[steps.length - 1].scopes[0]
  expect(getArrayElements(finalScope.variables.arr).length).toBe(3)
})
```

## Critical Test Coverage Areas

**Well-Covered:**
- Interpreter variable declarations (var, let, const) at `src/engine/interpreter.test.ts`
- Assignment and compound assignment operations
- Function calls and parameter passing
- Loop iteration and control flow
- Language detection and mismatch handling at `src/engine/languageDetector.test.ts`
- Event loop ordering (sync, microtask, macrotask) at `src/engine/eventLoopAnalyzer.test.ts`

**Gaps/Minimal Coverage:**
- React component rendering (no component tests found)
- Zustand store mutations
- Monaco editor integration
- UI interactions (breakpoints, step navigation)
- Error formatting transformations
- Visualization rendering logic

---

*Testing analysis: 2026-01-23*

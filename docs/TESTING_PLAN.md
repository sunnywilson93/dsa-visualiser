# Testing Plan - JS Interview Prep

## Overview

This document outlines the testing strategy to ensure code quality and prevent regressions as the application evolves.

## Tech Stack

```bash
# Testing Libraries to Install
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

### Why This Stack?
- **Vitest** - Fast, Vite-native test runner with Jest-compatible API
- **React Testing Library** - Tests components the way users interact with them
- **jsdom** - Browser environment simulation for Node.js

---

## Test Structure

```
src/
├── __tests__/                    # Integration tests
│   ├── flows/                    # User flow tests
│   │   ├── concept-learning.test.tsx
│   │   ├── dsa-practice.test.tsx
│   │   └── navigation.test.tsx
│   └── setup.ts                  # Test setup file
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.test.tsx   # Co-located unit tests
├── engine/
│   ├── interpreter.ts
│   ├── interpreter.test.ts       # Pure function tests
│   └── ...
└── store/
    ├── executionStore.ts
    └── executionStore.test.ts    # Store tests
```

---

## 1. Unit Tests

### 1.1 Engine Tests (Critical - Pure Functions)

These are the most important tests as they verify the core interpreter logic.

#### `src/engine/interpreter.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { Interpreter } from './interpreter'

describe('Interpreter', () => {
  describe('Variable Declarations', () => {
    it('should handle var declaration with hoisting', () => {
      const code = `
        console.log(x);
        var x = 5;
        console.log(x);
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      expect(steps).toHaveLength(4) // declaration + 2 console.log + assignment
      expect(steps[1].consoleOutput).toBe('undefined')
      expect(steps[3].consoleOutput).toBe('5')
    })

    it('should handle let declaration with TDZ', () => {
      const code = `
        let x = 10;
        console.log(x);
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      const finalScope = steps[steps.length - 1].scopes[0]
      expect(finalScope.variables.x.value).toBe(10)
    })

    it('should handle const declaration', () => {
      const code = `const PI = 3.14;`
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      expect(steps[0].type).toBe('declaration')
    })
  })

  describe('Function Calls', () => {
    it('should track function call in call stack', () => {
      const code = `
        function greet(name) {
          return "Hello " + name;
        }
        greet("World");
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      const callStep = steps.find(s => s.type === 'call')
      expect(callStep?.callStack).toHaveLength(2) // global + greet
      expect(callStep?.callStack[1].name).toBe('greet')
    })

    it('should handle recursive functions', () => {
      const code = `
        function factorial(n) {
          if (n <= 1) return 1;
          return n * factorial(n - 1);
        }
        factorial(3);
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      const maxStackDepth = Math.max(...steps.map(s => s.callStack.length))
      expect(maxStackDepth).toBe(4) // global + 3 recursive calls
    })
  })

  describe('Arrays', () => {
    it('should track array modifications', () => {
      const code = `
        let arr = [1, 2, 3];
        arr[0] = 10;
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      const modifyStep = steps.find(s => s.type === 'array-modify')
      expect(modifyStep).toBeDefined()
    })

    it('should handle array methods', () => {
      const code = `
        let arr = [3, 1, 2];
        arr.push(4);
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      const finalArr = steps[steps.length - 1].scopes[0].variables.arr
      expect(finalArr.elements).toHaveLength(4)
    })
  })

  describe('Loops', () => {
    it('should track loop iterations', () => {
      const code = `
        for (let i = 0; i < 3; i++) {
          console.log(i);
        }
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      const loopSteps = steps.filter(s => s.type === 'loop-iteration')
      expect(loopSteps.length).toBe(3)
    })

    it('should handle while loops', () => {
      const code = `
        let i = 0;
        while (i < 2) {
          i++;
        }
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      expect(steps.some(s => s.type === 'loop-start')).toBe(true)
      expect(steps.some(s => s.type === 'loop-end')).toBe(true)
    })
  })

  describe('Closures', () => {
    it('should capture closure variables', () => {
      const code = `
        function outer() {
          let count = 0;
          return function inner() {
            count++;
            return count;
          };
        }
        const counter = outer();
        counter();
        counter();
      `
      const interpreter = new Interpreter(code)
      const steps = interpreter.execute()

      // Verify closure captures the count variable
      const returnSteps = steps.filter(s => s.type === 'return')
      expect(returnSteps.length).toBeGreaterThan(0)
    })
  })
})
```

#### `src/engine/runtime.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { formatValue, createPrimitive, createArray } from './runtime'

describe('Runtime Values', () => {
  describe('formatValue', () => {
    it('should format primitive numbers', () => {
      const value = createPrimitive(42)
      expect(formatValue(value)).toBe('42')
    })

    it('should format primitive strings', () => {
      const value = createPrimitive('hello')
      expect(formatValue(value)).toBe('"hello"')
    })

    it('should format arrays', () => {
      const value = createArray([
        createPrimitive(1),
        createPrimitive(2),
        createPrimitive(3)
      ])
      expect(formatValue(value)).toBe('[1, 2, 3]')
    })

    it('should truncate long arrays', () => {
      const elements = Array.from({ length: 20 }, (_, i) => createPrimitive(i))
      const value = createArray(elements)
      expect(formatValue(value, true)).toContain('...')
    })
  })
})
```

#### `src/engine/parser.test.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { parseCode } from './parser'

describe('Parser', () => {
  it('should parse valid JavaScript', () => {
    const code = 'const x = 1;'
    const result = parseCode(code)

    expect(result.ast).toBeDefined()
    expect(result.error).toBeNull()
  })

  it('should return error for invalid syntax', () => {
    const code = 'const x ='
    const result = parseCode(code)

    expect(result.error).toBeDefined()
    expect(result.error?.message).toContain('Unexpected')
  })

  it('should track source locations', () => {
    const code = `let a = 1;
let b = 2;`
    const result = parseCode(code)

    expect(result.ast?.body[0].loc?.start.line).toBe(1)
    expect(result.ast?.body[1].loc?.start.line).toBe(2)
  })
})
```

---

### 1.2 Store Tests

#### `src/store/executionStore.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useExecutionStore } from './executionStore'

describe('ExecutionStore', () => {
  beforeEach(() => {
    useExecutionStore.getState().reset()
  })

  describe('Code Management', () => {
    it('should set code', () => {
      const { setCode } = useExecutionStore.getState()
      setCode('const x = 1;')

      expect(useExecutionStore.getState().code).toBe('const x = 1;')
    })

    it('should parse code on set', () => {
      const { setCode, parseCode } = useExecutionStore.getState()
      setCode('const x = 1;')
      parseCode()

      expect(useExecutionStore.getState().parsedAST).not.toBeNull()
    })
  })

  describe('Execution Control', () => {
    it('should start execution and generate steps', () => {
      const store = useExecutionStore.getState()
      store.setCode('let x = 5;')
      store.parseCode()
      store.startExecution()

      expect(store.steps.length).toBeGreaterThan(0)
      expect(store.status).toBe('paused')
    })

    it('should step forward', () => {
      const store = useExecutionStore.getState()
      store.setCode('let x = 1; let y = 2;')
      store.parseCode()
      store.startExecution()

      const initialStep = store.currentStep
      store.stepForward()

      expect(store.currentStep).toBe(initialStep + 1)
    })

    it('should step backward', () => {
      const store = useExecutionStore.getState()
      store.setCode('let x = 1; let y = 2;')
      store.parseCode()
      store.startExecution()
      store.stepForward()
      store.stepForward()

      const currentStep = store.currentStep
      store.stepBackward()

      expect(store.currentStep).toBe(currentStep - 1)
    })

    it('should reset execution', () => {
      const store = useExecutionStore.getState()
      store.setCode('let x = 1;')
      store.parseCode()
      store.startExecution()
      store.reset()

      expect(store.status).toBe('idle')
      expect(store.currentStep).toBe(0)
      expect(store.steps).toHaveLength(0)
    })
  })

  describe('Breakpoints', () => {
    it('should toggle breakpoint', () => {
      const store = useExecutionStore.getState()
      store.toggleBreakpoint(5)

      expect(store.breakpoints).toContainEqual(
        expect.objectContaining({ line: 5, enabled: true })
      )
    })

    it('should remove breakpoint on second toggle', () => {
      const store = useExecutionStore.getState()
      store.toggleBreakpoint(5)
      store.toggleBreakpoint(5)

      expect(store.breakpoints.find(b => b.line === 5)).toBeUndefined()
    })
  })

  describe('Playback', () => {
    it('should set playback speed', () => {
      const store = useExecutionStore.getState()
      store.setPlaybackSpeed('fast')

      expect(store.playbackSpeed).toBe('fast')
    })
  })
})
```

---

### 1.3 Component Tests

#### `src/components/StepDescription/StepDescription.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StepDescription } from './StepDescription'
import { useExecutionStore } from '@/store'

// Mock the store
vi.mock('@/store', () => ({
  useCurrentStep: vi.fn(),
  useExecutionStore: vi.fn(),
  useExecutionProgress: vi.fn(),
}))

describe('StepDescription', () => {
  it('should show idle message when status is idle', () => {
    vi.mocked(useExecutionStore).mockReturnValue('idle')
    vi.mocked(useCurrentStep).mockReturnValue(null)
    vi.mocked(useExecutionProgress).mockReturnValue({ current: 0, total: 0 })

    render(<StepDescription />)

    expect(screen.getByText(/Press.*Space.*to run/)).toBeInTheDocument()
  })

  it('should display step info during execution', () => {
    vi.mocked(useExecutionStore).mockReturnValue('paused')
    vi.mocked(useCurrentStep).mockReturnValue({
      id: 1,
      type: 'declaration',
      description: 'Declare variable x',
      location: { line: 1, column: 0 },
    })
    vi.mocked(useExecutionProgress).mockReturnValue({ current: 1, total: 10 })

    render(<StepDescription />)

    expect(screen.getByText('Step 1/10')).toBeInTheDocument()
    expect(screen.getByText('Declaration')).toBeInTheDocument()
    expect(screen.getByText('Line 1')).toBeInTheDocument()
  })

  it('should label console.log as Console, not Function Call', () => {
    vi.mocked(useExecutionStore).mockReturnValue('paused')
    vi.mocked(useCurrentStep).mockReturnValue({
      id: 1,
      type: 'call',
      description: 'console.log("hello")',
      location: { line: 1, column: 0 },
    })
    vi.mocked(useExecutionProgress).mockReturnValue({ current: 1, total: 10 })

    render(<StepDescription />)

    expect(screen.getByText('Console')).toBeInTheDocument()
    expect(screen.queryByText('Function Call')).not.toBeInTheDocument()
  })
})
```

#### `src/components/Concepts/HoistingViz.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HoistingViz } from './HoistingViz'

describe('HoistingViz', () => {
  it('should render initial state', () => {
    render(<HoistingViz />)

    expect(screen.getByText('var')).toBeInTheDocument()
    expect(screen.getByText('let')).toBeInTheDocument()
    expect(screen.getByText('function')).toBeInTheDocument()
  })

  it('should switch examples when clicking tabs', () => {
    render(<HoistingViz />)

    fireEvent.click(screen.getByText('let'))

    expect(screen.getByText(/Temporal Dead Zone/i)).toBeInTheDocument()
  })

  it('should step through visualization', () => {
    render(<HoistingViz />)

    const nextButton = screen.getByText(/Next/i)
    fireEvent.click(nextButton)

    expect(screen.getByText(/Step 2/)).toBeInTheDocument()
  })

  it('should reset visualization', () => {
    render(<HoistingViz />)

    // Step forward
    fireEvent.click(screen.getByText(/Next/i))
    fireEvent.click(screen.getByText(/Next/i))

    // Reset
    fireEvent.click(screen.getByText(/Reset/i))

    expect(screen.getByText(/Step 1/)).toBeInTheDocument()
  })
})
```

#### `src/components/Controls/Controls.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Controls } from './Controls'

describe('Controls', () => {
  it('should show Run button when idle', () => {
    render(<Controls />)
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument()
  })

  it('should show step controls during execution', () => {
    // Mock store to return 'paused' status
    render(<Controls />)

    expect(screen.getByLabelText(/step forward/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/step backward/i)).toBeInTheDocument()
  })

  it('should change playback speed', () => {
    render(<Controls />)

    const speedButton = screen.getByText('1x')
    fireEvent.click(speedButton)

    expect(screen.getByText('2x')).toBeInTheDocument()
  })
})
```

---

## 2. Integration Tests

### 2.1 User Flow Tests

#### `src/__tests__/flows/concept-learning.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'

describe('Concept Learning Flow', () => {
  const renderApp = () => render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  it('should navigate from home to concepts', () => {
    renderApp()

    // Click on a concept card
    fireEvent.click(screen.getByText('Closures'))

    // Should show the closures visualization
    expect(screen.getByText(/function.*remember/i)).toBeInTheDocument()
  })

  it('should complete a concept visualization', () => {
    renderApp()

    // Navigate to Hoisting
    fireEvent.click(screen.getByText('Hoisting'))

    // Step through all steps
    const nextButton = screen.getByText(/Next/i)
    while (!nextButton.hasAttribute('disabled')) {
      fireEvent.click(nextButton)
    }

    // Should show "Done" at the end
    expect(screen.getByText('Done')).toBeInTheDocument()
  })
})
```

#### `src/__tests__/flows/dsa-practice.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'

describe('DSA Practice Flow', () => {
  const renderApp = () => render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  it('should navigate to DSA section and select a problem', async () => {
    renderApp()

    // Click DSA banner
    fireEvent.click(screen.getByText(/Explore DSA Problems/i))

    // Wait for category page
    await waitFor(() => {
      expect(screen.getByText(/Two Sum/i)).toBeInTheDocument()
    })

    // Select a problem
    fireEvent.click(screen.getByText('Two Sum'))

    // Should show the practice page
    expect(screen.getByText('CODE EDITOR')).toBeInTheDocument()
  })

  it('should execute code and show steps', async () => {
    renderApp()

    // Navigate to a problem
    fireEvent.click(screen.getByText(/Explore DSA Problems/i))
    await waitFor(() => screen.getByText('Two Sum'))
    fireEvent.click(screen.getByText('Two Sum'))

    // Run the code
    fireEvent.click(screen.getByLabelText(/run/i))

    // Should show step description
    await waitFor(() => {
      expect(screen.getByText(/Step \d+\/\d+/)).toBeInTheDocument()
    })
  })

  it('should step through execution', async () => {
    renderApp()

    // Setup: navigate and run
    // ... (navigation code)

    // Step forward
    fireEvent.click(screen.getByLabelText(/step forward/i))

    // Verify step changed
    const stepBadge = screen.getByText(/Step \d+\/\d+/)
    expect(stepBadge.textContent).toMatch(/Step [2-9]/)
  })
})
```

#### `src/__tests__/flows/navigation.test.tsx`

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'

describe('Navigation', () => {
  const renderApp = () => render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  it('should navigate to all main sections', () => {
    renderApp()

    // Home page should have 3 sections
    expect(screen.getByText('Understand')).toBeInTheDocument()
    expect(screen.getByText('Build')).toBeInTheDocument()
    expect(screen.getByText('Solve')).toBeInTheDocument()
  })

  it('should navigate back from any page', () => {
    renderApp()

    // Go to a concept
    fireEvent.click(screen.getByText('Closures'))

    // Go back
    fireEvent.click(screen.getByLabelText(/back/i))

    // Should be on concepts list or home
    expect(screen.getByText(/Understand|Concepts/)).toBeInTheDocument()
  })

  it('should preserve execution state when navigating within practice', () => {
    // This tests that stepping through a problem and navigating
    // doesn't lose the current step position
  })
})
```

---

## 3. Test Configuration

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.tsx',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### `src/__tests__/setup.ts`

```typescript
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

---

## 4. Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

---

## 5. Testing Priority

### Phase 1: Critical Path (Must Have)
1. `interpreter.test.ts` - Core execution logic
2. `parser.test.ts` - Code parsing
3. `executionStore.test.ts` - State management
4. `runtime.test.ts` - Value formatting

### Phase 2: Components (Should Have)
5. `StepDescription.test.tsx`
6. `Controls.test.tsx`
7. `HoistingViz.test.tsx`
8. Other concept visualizations

### Phase 3: Integration (Nice to Have)
9. User flow tests
10. Navigation tests
11. E2E tests (consider Playwright later)

---

## 6. CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

---

## 7. Test Commands Reference

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests once (CI)
npm run test:run

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- interpreter.test.ts

# Run tests matching pattern
npm test -- --grep "should handle"
```

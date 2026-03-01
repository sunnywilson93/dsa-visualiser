import { test, expect } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'

// All 30 React concept pages — grouped by category for readability
const reactConceptRoutes: { path: string; name: string; maxDiffPixels?: number }[] = [
  // Foundations
  { path: '/concepts/react/jsx-rendering', name: 'react-jsx-rendering' },
  { path: '/concepts/react/components-props', name: 'react-components-props' },
  { path: '/concepts/react/children-composition', name: 'react-children-composition' },
  { path: '/concepts/react/conditional-rendering', name: 'react-conditional-rendering' },
  { path: '/concepts/react/lists-keys', name: 'react-lists-keys' },
  // Basic Hooks
  { path: '/concepts/react/use-state', name: 'react-use-state' },
  { path: '/concepts/react/use-effect', name: 'react-use-effect' },
  { path: '/concepts/react/use-ref', name: 'react-use-ref' },
  { path: '/concepts/react/use-context', name: 'react-use-context' },
  // Advanced Hooks
  { path: '/concepts/react/use-reducer', name: 'react-use-reducer' },
  { path: '/concepts/react/use-memo', name: 'react-use-memo' },
  { path: '/concepts/react/use-callback', name: 'react-use-callback' },
  { path: '/concepts/react/use-layout-effect', name: 'react-use-layout-effect' },
  { path: '/concepts/react/custom-hooks', name: 'react-custom-hooks' },
  // Rendering
  { path: '/concepts/react/virtual-dom', name: 'react-virtual-dom' },
  { path: '/concepts/react/component-lifecycle', name: 'react-component-lifecycle' },
  { path: '/concepts/react/rerender-triggers', name: 'react-rerender-triggers' },
  { path: '/concepts/react/controlled-uncontrolled', name: 'react-controlled-uncontrolled' },
  { path: '/concepts/react/refs-dom-access', name: 'react-refs-dom-access' },
  // Patterns
  { path: '/concepts/react/compound-components', name: 'react-compound-components' },
  { path: '/concepts/react/render-props', name: 'react-render-props' },
  { path: '/concepts/react/higher-order-components', name: 'react-higher-order-components' },
  { path: '/concepts/react/error-boundaries', name: 'react-error-boundaries' },
  { path: '/concepts/react/context-patterns', name: 'react-context-patterns' },
  { path: '/concepts/react/portals', name: 'react-portals' },
  // Performance
  { path: '/concepts/react/react-memo', name: 'react-memo' },
  { path: '/concepts/react/code-splitting', name: 'react-code-splitting' },
  { path: '/concepts/react/suspense', name: 'react-suspense' },
  { path: '/concepts/react/concurrent-features', name: 'react-concurrent-features' },
  { path: '/concepts/react/server-components', name: 'react-server-components' },
]

test.describe('Visual — React Concepts', () => {
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

  for (const route of reactConceptRoutes) {
    test(`${route.name} renders correctly`, async ({ page }) => {
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')
      // Extra wait for ssr:false dynamic imports to hydrate and render
      await page.waitForTimeout(2000)
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
        ...(route.maxDiffPixels != null && { maxDiffPixels: route.maxDiffPixels }),
      })
    })
  }
})

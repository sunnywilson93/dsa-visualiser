import { test, expect } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'

// Representative subset of routes covering every major layout type.
// Kept small (~10 pages) so it runs in ~15-30s with a running dev server.
const smokeRoutes: { path: string; name: string; maxDiffPixels?: number }[] = [
  // Home grid layout
  { path: '/', name: 'home' },
  // Concepts overview
  { path: '/concepts', name: 'concepts' },
  // JS concept page (rich visualization)
  { path: '/concepts/closures', name: 'concept-closures' },
  // DSA concept page
  { path: '/concepts/dsa/arrays', name: 'concept-dsa-arrays' },
  // Category listing (JS)
  { path: '/js-core', name: 'category-js-core' },
  // Category listing (DSA subcategory)
  { path: '/two-pointers', name: 'category-two-pointers' },
  // Problem concept viz (two-pointers pattern) — framer-motion spring animations jitter
  { path: '/two-pointers/two-sum-ii/concept', name: 'concept-two-sum-ii', maxDiffPixels: 200 },
  // Problem concept viz (bit-manipulation pattern)
  { path: '/bit-manipulation/single-number/concept', name: 'concept-single-number' },
  // Pattern overview page
  { path: '/concepts/dsa/patterns/two-pointers', name: 'pattern-two-pointers' },
  // JS problems listing
  { path: '/js-problems', name: 'js-problems' },
]

test.describe('Visual Smoke', () => {
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

  for (const route of smokeRoutes) {
    test(`${route.name} renders correctly`, async ({ page }) => {
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
        ...(route.maxDiffPixels != null && { maxDiffPixels: route.maxDiffPixels }),
      })
    })
  }
})

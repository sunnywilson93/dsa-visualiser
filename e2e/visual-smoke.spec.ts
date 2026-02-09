import { test, expect } from '@playwright/test'

// Representative subset of routes covering every major layout type.
// Kept small (~10 pages) so it runs in ~15-30s with a running dev server.
const smokeRoutes = [
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
  // Problem concept viz (two-pointers pattern)
  { path: '/two-pointers/two-sum-ii/concept', name: 'concept-two-sum-ii' },
  // Problem concept viz (bit-manipulation pattern)
  { path: '/bit-manipulation/single-number/concept', name: 'concept-single-number' },
  // Pattern overview page
  { path: '/concepts/dsa/patterns/two-pointers', name: 'pattern-two-pointers' },
  // JS problems listing
  { path: '/js-problems', name: 'js-problems' },
]

test.describe('Visual Smoke', () => {
  for (const route of smokeRoutes) {
    test(`${route.name} renders correctly`, async ({ page }) => {
      await page.goto(route.path)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
      })
    })
  }
})

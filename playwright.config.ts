import { defineConfig } from '@playwright/test'

const skipServer = process.env.PLAYWRIGHT_SKIP_SERVER === '1'
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'
const webServer = skipServer
  ? undefined
  : {
      command: 'npm run build && npm run start -- -H 127.0.0.1',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    }

export default defineConfig({
  testDir: './e2e',
  testMatch: 'visual-regression.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    contextOptions: {
      reducedMotion: 'reduce',
    },
    launchOptions: {
      args: ['--force-prefers-reduced-motion'],
    },
  },
  ...(webServer ? { webServer } : {}),
  projects: [
    {
      name: 'desktop-1440',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'tablet-768',
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'mobile-360',
      use: { viewport: { width: 360, height: 640 } },
    },
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 0,
      animations: 'disabled',
    },
  },
})

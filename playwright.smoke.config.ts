import { defineConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'
const skipServer = process.env.PLAYWRIGHT_SKIP_SERVER === '1'
const webServer = skipServer
  ? undefined
  : {
      command: 'npm run start -- -H 127.0.0.1',
      url: baseURL,
      reuseExistingServer: true,
      timeout: 10000,
    }

export default defineConfig({
  testDir: './e2e',
  testMatch: 'visual-smoke.spec.ts',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
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
  ],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 0,
      animations: 'disabled',
    },
  },
})

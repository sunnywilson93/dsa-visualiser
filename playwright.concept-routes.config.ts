import { defineConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'
const skipServer = process.env.PLAYWRIGHT_SKIP_SERVER === '1'
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
const channel = process.env.PLAYWRIGHT_CHANNEL
const webServer = skipServer
  ? undefined
  : {
      command: 'npm run start -- -H 127.0.0.1',
      url: baseURL,
      reuseExistingServer: true,
      timeout: 10000,
    }
const launchOptions = {
  args: ['--force-prefers-reduced-motion'],
  ...(executablePath ? { executablePath } : {}),
  ...(channel ? { channel } : {}),
}

export default defineConfig({
  testDir: './e2e',
  testMatch: 'concept-route-health.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL,
    contextOptions: {
      reducedMotion: 'reduce',
    },
    launchOptions,
  },
  ...(webServer ? { webServer } : {}),
  projects: [
    {
      name: 'desktop-1440',
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
})

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: 'visual-smoke.spec.ts',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    reducedMotion: 'reduce',
    launchOptions: {
      args: ['--force-prefers-reduced-motion'],
    },
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 10000,
  },
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

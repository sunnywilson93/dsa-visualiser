import { chromium } from '@playwright/test'
import { execSync } from 'child_process'
import { setTimeout } from 'timers/promises'

async function takeScreenshot() {
  let serverProcess: any = null
  
  try {
    // Check if server is already running
    try {
      await fetch('http://localhost:3000')
      console.log('Server already running on localhost:3000')
    } catch {
      console.log('Starting dev server...')
      // Start dev server in background
      serverProcess = execSync('npm run dev &', { cwd: process.cwd(), detached: true })
      await setTimeout(5000) // Wait for server to start
    }

    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 }
    })

    console.log('Navigating to /concepts/js...')
    await page.goto('http://localhost:3000/concepts/js', { waitUntil: 'networkidle' })
    
    // Additional wait for animations/content
    await setTimeout(2000)
    
    // Take screenshot
    await page.screenshot({
      path: 'screenshots/concepts-js.png',
      fullPage: true
    })

    console.log('✅ Screenshot saved to screenshots/concepts-js.png')
    await browser.close()
  } catch (error) {
    console.error('Error taking screenshot:', error)
    process.exit(1)
  } finally {
    if (serverProcess) {
      process.kill(-serverProcess.pid)
    }
  }
}

takeScreenshot()

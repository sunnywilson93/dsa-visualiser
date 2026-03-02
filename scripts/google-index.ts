/**
 * Google Indexing API script — submits all site URLs for indexing.
 *
 * Prerequisites:
 *   1. Enable "Web Search Indexing API" in Google Cloud Console
 *   2. Create a service account & download its JSON key
 *   3. Save the key as `google-indexing-key.json` in the project root
 *   4. Add the service account email as Owner in Google Search Console
 *
 * Usage:
 *   npx tsx scripts/google-index.ts            # index all pages
 *   npx tsx scripts/google-index.ts --dry-run   # preview URLs without submitting
 */

import { google } from 'googleapis'
import { concepts } from '../src/data/concepts'
import { dsaConcepts } from '../src/data/dsaConcepts'
import { reactConcepts } from '../src/data/reactConcepts'
import { dsaPatterns } from '../src/data/dsaPatterns'
import {
  exampleCategories,
  dsaSubcategories,
  codeExamples,
  getProblemRouteCategoryIds,
} from '../src/data/examples'
import { problemConcepts } from '../src/data/algorithmConcepts'
import { topicHubs } from '../src/data/topicHubs'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = 'https://jsinterview.dev'
const KEY_PATH = path.resolve(__dirname, '..', 'google-indexing-key.json')
const BATCH_SIZE = 100
const DELAY_MS = 1000

// ── Build full URL list (mirrors sitemap.ts) ──────────────────────────

function buildUrlList(): string[] {
  const urls: string[] = []

  // Static pages
  const staticPaths = [
    '/',
    '/concepts',
    '/concepts/js',
    '/concepts/dsa',
    '/concepts/react',
    '/js-problems',
    '/interview',
    '/interview/html',
    '/interview/css',
    '/interview/js',
    '/interview/react',
    '/interview/bundlers',
    '/playground/event-loop',
    '/concepts/dsa/roadmap',
    '/concepts/js/cheatsheet',
    '/updates',
  ]
  staticPaths.forEach((p) => urls.push(`${BASE_URL}${p}`))

  // JS Concept pages
  concepts.forEach((c) => urls.push(`${BASE_URL}/concepts/js/${c.id}`))

  // DSA Concept pages
  dsaConcepts.forEach((c) => urls.push(`${BASE_URL}/concepts/dsa/${c.id}`))

  // React Concept pages
  reactConcepts.forEach((c) => urls.push(`${BASE_URL}/concepts/react/${c.id}`))

  // DSA Pattern pages
  dsaPatterns.forEach((p) => urls.push(`${BASE_URL}/concepts/dsa/patterns/${p.slug}`))

  // Topic hub pages
  topicHubs.forEach((h) => urls.push(`${BASE_URL}/topics/${h.id}`))

  // Category pages
  const categoryMap = new Map(
    [...exampleCategories, ...dsaSubcategories].map((cat) => [cat.id, cat.id]),
  )
  exampleCategories.forEach((c) => urls.push(`${BASE_URL}/${c.id}`))
  dsaSubcategories.forEach((s) => urls.push(`${BASE_URL}/${s.id}`))

  // Problem pages
  codeExamples.forEach((problem) => {
    getProblemRouteCategoryIds(problem).forEach((catId) => {
      urls.push(`${BASE_URL}/${categoryMap.get(catId) || problem.category}/${problem.id}`)
    })
  })

  // Concept visualization pages
  Object.keys(problemConcepts).forEach((problemId) => {
    const problem = codeExamples.find((p) => p.id === problemId)
    if (problem) {
      getProblemRouteCategoryIds(problem).forEach((catId) => {
        urls.push(
          `${BASE_URL}/${categoryMap.get(catId) || problem.category}/${problem.id}/concept`,
        )
      })
    }
  })

  return [...new Set(urls)]
}

// ── Submit URLs in batches ────────────────────────────────────────────

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface IndexingResult {
  url: string
  status: 'success' | 'error'
  message?: string
}

async function submitUrls(urls: string[], dryRun: boolean): Promise<void> {
  if (dryRun) {
    console.log(`\n📋 DRY RUN — ${urls.length} URLs would be submitted:\n`)
    urls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`))
    console.log(`\n✅ Run without --dry-run to submit.`)
    return
  }

  if (!fs.existsSync(KEY_PATH)) {
    console.error(`\n❌ Service account key not found at: ${KEY_PATH}`)
    console.error('   Download it from Google Cloud Console and save it there.')
    console.error('   See script header comments for full setup instructions.\n')
    process.exit(1)
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })

  const client = await auth.getClient()
  const indexing = google.indexing({ version: 'v3', auth: client as InstanceType<typeof google.auth.OAuth2> })

  console.log(`\n🚀 Submitting ${urls.length} URLs to Google Indexing API...\n`)

  const results: IndexingResult[] = []
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(urls.length / BATCH_SIZE)

    console.log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} URLs)`)

    for (const url of batch) {
      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url,
            type: 'URL_UPDATED',
          },
        })
        successCount++
        results.push({ url, status: 'success' })
        process.stdout.write(`  ✓ ${url}\n`)
      } catch (err: unknown) {
        errorCount++
        const message = err instanceof Error ? err.message : String(err)
        results.push({ url, status: 'error', message })
        process.stdout.write(`  ✗ ${url} — ${message}\n`)
      }
    }

    if (i + BATCH_SIZE < urls.length) {
      console.log(`  ⏳ Waiting ${DELAY_MS}ms before next batch...`)
      await sleep(DELAY_MS)
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`📊 Results: ${successCount} succeeded, ${errorCount} failed out of ${urls.length} total`)

  if (errorCount > 0) {
    console.log(`\n❌ Failed URLs:`)
    results.filter((r) => r.status === 'error').forEach((r) => {
      console.log(`  ${r.url}`)
      console.log(`    → ${r.message}`)
    })
  }

  console.log()
}

// ── Main ──────────────────────────────────────────────────────────────

const dryRun = process.argv.includes('--dry-run')
const urls = buildUrlList()
console.log(`\n📍 Found ${urls.length} URLs across the site`)

submitUrls(urls, dryRun).catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

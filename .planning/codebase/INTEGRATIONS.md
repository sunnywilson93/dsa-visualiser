# External Integrations

**Analysis Date:** 2026-01-31

## APIs & External Services

**Analytics:**
- Google Analytics (GA4) - Client-side page view tracking and user engagement
  - SDK/Client: Google Tag Manager script (`gtag.js`)
  - Measurement ID: `G-W2VCY1D7Y7` (hardcoded)
  - Implementation: `src/components/Analytics.tsx`
  - Script loaded from: `https://www.googletagmanager.com/gtag/js?id=G-W2VCY1D7Y7`
  - Tracks: Page navigation via pathname and search params

**CDN/External Resources:**
- Monaco Editor - Code editor component loads assets from CDN
  - Client: `@monaco-editor/react` package (version 4.6.0)
  - Integration: `src/components/CodeEditor/CodeEditor.tsx`
  - Monaco assets loaded dynamically by package

**Schema.org Integration:**
- Structured data for SEO (BreadcrumbList, TechArticle, WebPage, Organization)
  - Implementation: `src/lib/seo/breadcrumb.ts`, `src/app/concepts/[conceptId]/page.tsx`
  - Production domain: `https://jsinterview.dev`
  - Used in: Concept pages, problem pages, category pages

## Data Storage

**Databases:**
- None - Fully static Next.js application with no database integration

**File Storage:**
- Local filesystem only
- All content is static JSON/TS data files in `src/data/`
- No cloud storage (AWS S3, Google Cloud Storage, etc.)

**Caching:**
- Browser memory only
  - Execution steps cached in Zustand store (`src/store/executionStore.ts`)
  - Panel preferences persisted to localStorage via Zustand persist middleware (`src/store/panelStore.ts`)
- No external caching service (Redis, Memcached)
- Next.js build-time caching only

## Authentication & Identity

**Auth Provider:**
- None - Public, anonymous application
  - No user accounts or login system
  - All learning materials publicly accessible
  - No authentication middleware

## Monitoring & Observability

**Error Tracking:**
- None - No Sentry, LogRocket, Bugsnag, or similar service integrated

**Logs:**
- Browser console only
  - Client-side error boundary: `src/components/ErrorBoundary/ErrorBoundary.tsx`
  - Console output from executed user code stored in `consoleOutput` array in execution store
  - No centralized or remote logging service

**Performance Monitoring:**
- None - No APM tools (Datadog, New Relic, etc.)

## CI/CD & Deployment

**Hosting:**
- Vercel
  - Configuration: `vercel.json` (framework detection only: `{"framework": "nextjs"}`)
  - Platform detection: `playwright.config.ts` checks `process.env.CI`
  - Build configuration likely in Vercel dashboard

**CI Pipeline:**
- None detected in repository
  - No `.github/workflows/` directory
  - No `.gitlab-ci.yml`, `.circleci/`, or other CI config files
  - Playwright configured for CI mode: retries, workers adjusted based on `process.env.CI`

**Build Commands:**
```bash
npm run build         # Production build
npm run lint          # ESLint validation
npm run test:run      # Single test run (CI mode)
npm run test:coverage # Coverage report
```

## Environment Configuration

**Required env vars:**
- None - Application runs without environment variables

**Optional env vars:**
- `WEBPACK_POLLING` - File watching polling interval for dev mode (milliseconds)
- `NEXT_TURBOPACK` - Enable experimental Turbopack builds
- `WEBPACK_LOGGING` - Enable verbose webpack logging for debugging

**Secrets location:**
- Not applicable - No secrets required
  - Google Analytics ID is public/hardcoded in `src/components/Analytics.tsx`
  - No API keys, tokens, or private credentials

**Configuration files:**
- `.env.local.example` - Documents optional development environment variables

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None (Google Analytics uses client-side script, not webhooks)

## Development & Testing Services

**E2E Testing:**
- Playwright - Local/CI visual regression testing
  - Configuration: `playwright.config.ts`
  - Test server: Local Next.js server on `http://localhost:3000`
  - Test directory: `./e2e`
  - Viewports: Desktop (1440), Tablet (768), Mobile (360)
  - No cloud-based testing service (BrowserStack, Sauce Labs, etc.)

**Unit Testing:**
- Vitest - Local test runner
  - Configuration: `vitest.config.ts`
  - No cloud test reporting service

**Package Registry:**
- npm registry (default) - All dependencies from public npm
  - No private registry or Artifactory configured

## Network Requests

**Client-Side:**
- Google Tag Manager script: `https://www.googletagmanager.com/gtag/js?id=G-W2VCY1D7Y7`
- Monaco Editor assets (loaded via `@monaco-editor/react` package)

**Server-Side:**
- None - Static site generation only
  - No server-side API calls
  - No API routes in `src/app/api/`

## Third-Party Libraries (Non-Integration)

**UI Components:**
- Lucide React (version 0.400.0) - Client-side SVG icon rendering, no CDN
  - Import pattern: `import { Icon } from 'lucide-react'`

**Animation:**
- Framer Motion (version 11.0.0) - Client-side animation library, no external service

**Styling:**
- Tailwind CSS (version 4.1.18) - Build-time CSS generation, no CDN

## Constraints & Limitations

**Network-Dependent Code:**
- User code containing `fetch()` calls is detected and blocked
  - Parser detection: `src/engine/parser.ts` line 63
  - Error message: `src/engine/errorFormatter.ts` line 245
  - Reason: Network requests cannot be visualized in step-by-step executor

**Event Loop Visualization:**
- Simulates Web APIs (fetch, setTimeout, setInterval, XMLHttpRequest) for educational purposes
  - Location: `src/components/EventLoopPlayground/EventLoopDisplay.tsx` lines 11-16
  - Location: `src/engine/eventLoopAnalyzer.ts` line 88
  - No actual external Web API calls made - purely educational simulation

---

*Integration audit: 2026-01-31*

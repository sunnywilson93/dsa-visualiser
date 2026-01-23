# External Integrations

**Analysis Date:** 2026-01-23

## APIs & External Services

**Analytics:**
- Google Analytics (GA4) - User behavior tracking and page views
  - Measurement ID: `G-W2VCY1D7Y7`
  - Implementation: `src/components/Analytics.tsx`
  - Script loaded from: `https://www.googletagmanager.com/gtag/js`
  - Tracks: Page navigation, user engagement on concept pages and practice problems

**Visualization Services:**
- No third-party visualization APIs detected

## Data Storage

**Databases:**
- None integrated - fully client-side application

**File Storage:**
- Local filesystem only
- No cloud storage integration (AWS S3, Google Cloud Storage, etc.)

**Caching:**
- Browser memory (execution steps cached in Zustand store)
- No server-side caching or Redis

## Authentication & Identity

**Auth Provider:**
- None - Application is public and anonymous
- No user accounts or login system
- All data and learning materials publicly accessible

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, LogRocket, or similar service

**Logs:**
- Browser console output captured in `src/store/executionStore.ts`
- Console logs from executed user code stored in `consoleOutput` array
- No remote logging service

## CI/CD & Deployment

**Hosting:**
- Vercel (indicated by `vercel.json` configuration)
- Next.js compatible deployment

**CI Pipeline:**
- Not detected in repository (likely configured in Vercel dashboard)
- Build commands:
  ```bash
  npm run build        # Production build
  npm run lint         # ESLint validation
  npm test:run         # Single test run (CI mode)
  npm run test:coverage # Coverage report
  ```

## Environment Configuration

**Required env vars:**
- None detected - All configuration is static or bundled

**Secrets location:**
- No secrets management detected
- Google Analytics ID is public (client-side only)
- No API keys or private credentials in codebase

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- Google Analytics event tracking (client-side)
  - Uses gtag.js global function to send events to Google Analytics

## Code Editor Integration

**Monaco Editor:**
- Remote CDN: Uses Monaco Editor React wrapper
- No remote connection needed for core functionality
- Editor state managed entirely client-side in `src/components/CodeEditor`

## Third-Party Assets

**Icons:**
- Lucide React icons - Client-side SVG rendering (no CDN fetch)

**Fonts & Styles:**
- CSS Modules bundled with build (no external CDN)

## Constraints & Limitations

**Network-Dependent Code:**
- User code containing `fetch()` calls is detected and rejected by parser
- Warning in `src/engine/parser.ts`: "Network requests (fetch) cannot be visualized"
- Event loop analyzer specifically handles fetch requests with error: "Network requests (fetch) cannot be executed in the visualizer"
- This ensures interpreter only executes synchronous and simulated async patterns

---

*Integration audit: 2026-01-23*

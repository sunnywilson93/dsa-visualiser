# Bundler Interview Questions — Design

## Summary

Add a bundlers interview questions page at `/interview/bundlers` with ~88 questions across 9 topics: a common concepts topic plus individual topics for each major bundler (Webpack, Vite, Rollup, esbuild, Parcel, Turbopack, Rspack, Rolldown).

## Data Structure

File: `src/data/bundlerInterviewQuestions.ts`

```typescript
type BundlerInterviewTopic =
  | 'common-concepts'
  | 'webpack'
  | 'vite'
  | 'rollup'
  | 'esbuild'
  | 'parcel'
  | 'turbopack'
  | 'rspack'
  | 'rolldown'
```

Topics:
- **Common Concepts**: Tree shaking, code splitting, HMR, loaders vs plugins, source maps, bundling vs transpiling, module formats (CJS/ESM/UMD), dependency graphs, chunk strategies, lazy loading, asset pipelines, comparison questions across bundlers
- **Webpack**: Loaders, plugins, Module Federation, chunk splitting, webpack-dev-server, optimization config, caching, resolve aliases, entry/output, webpack 5 specifics
- **Vite**: ESM dev server, Rollup-based production, plugin API, HMR, `vite.config.ts`, SSR support, library mode, environment variables, dependency pre-bundling
- **Rollup**: ESM-first output, tree shaking, plugin hooks, code splitting, output formats, external dependencies, Rollup vs Webpack tradeoffs
- **esbuild**: Go-based speed, `buildOptions`, bundling/minification, JSX handling, limitations, plugin API, incremental builds
- **Parcel**: Zero-config philosophy, asset graph, transformers, packagers, Parcel 2 architecture, caching, scope hoisting
- **Turbopack**: Rust-based architecture, incremental computation, Next.js integration, comparison to Webpack/Vite
- **Rspack**: Rust-based Webpack-compatible bundler, migration from Webpack, loader/plugin compatibility, performance characteristics
- **Rolldown**: Rust-based Rollup replacement, Vite integration roadmap, compatibility goals, performance improvements

## Question Distribution

Organic distribution — not forced to a strict count. Approximate targets:

| Topic | Easy | Medium | Hard | Total |
|---|---|---|---|---|
| Common Concepts | 5 | 7 | 3 | ~15 |
| Webpack | 4 | 6 | 4 | ~14 |
| Vite | 3 | 5 | 3 | ~11 |
| Rollup | 3 | 4 | 3 | ~10 |
| esbuild | 3 | 4 | 2 | ~9 |
| Parcel | 2 | 4 | 2 | ~8 |
| Turbopack | 2 | 3 | 2 | ~7 |
| Rspack | 2 | 3 | 2 | ~7 |
| Rolldown | 2 | 3 | 2 | ~7 |
| **Total** | | | | **~88** |

Larger bundlers (Webpack, Vite) get more coverage due to broader concept surface. Newer bundlers (Turbopack, Rspack, Rolldown) have fewer but focused questions.

## Page Architecture

Single page at `/interview/bundlers` with topic filter buttons — reuses the existing `InterviewFilterBar` component. Each bundler becomes a topic button, letting users filter to a specific bundler for focused revision.

## Files

| File | Action |
|---|---|
| `src/data/bundlerInterviewQuestions.ts` | Create — ~88 questions + types + config + filter |
| `src/app/interview/bundlers/page.tsx` | Create — server component with SEO metadata |
| `src/app/interview/bundlers/BundlersInterviewClient.tsx` | Create — client component with filters |
| `src/app/interview/bundlers/BundlersInterviewClient.module.css` | Create — page styles |
| `src/app/interview/InterviewLanding.tsx` | Modify — add Bundlers card |
| `src/app/page.tsx` | Modify — add Bundlers to interview section + FAQ |
| `src/app/sitemap.ts` | Modify — add /interview/bundlers |
| `src/components/Icons/ConceptIcon.tsx` | Modify — add bundlers icon mapping |
| Visual snapshots | Update |

## SEO

- Title: "Bundler Interview Questions - Webpack, Vite, Rollup & More"
- Canonical: /interview/bundlers
- Breadcrumb: Home > Interview > Bundlers
- Added to sitemap, homepage FAQ schema, interview landing

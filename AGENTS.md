# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` Next.js App Router pages, layouts, and route segments.
- `src/components/` reusable UI components with CSS Modules (`*.module.css`).
- `src/engine/` interpreter, runtime, and parser logic powering the visualizer.
- `src/store/` Zustand state stores and selectors.
- `src/data/` static datasets for concepts and examples.
- `src/types/` shared TypeScript types.
- `src/__tests__/` test setup; tests live near source files (e.g., `src/engine/interpreter.test.ts`).
- `public/` static assets; `docs/` planning notes.

## Build, Test, and Development Commands
- `npm run dev` start the local Next.js dev server.
- `npm run build` create a production build.
- `npm run start` run the production build locally.
- `npm run lint` run Next.js ESLint checks.
- `npm run test` run Vitest in watch mode.
- `npm run test:run` run tests once (CI-friendly).
- `npm run test:coverage` generate coverage reports (text/json/html).

## Coding Style & Naming Conventions
- TypeScript + React functional components; App Router lives in `src/app`.
- Indentation is 2 spaces, single quotes, and no semicolons, matching existing files.
- Components use `PascalCase` filenames; hooks use `useSomething`.
- CSS Modules are named `Component.module.css` and imported as `styles`.
- Prefer `@/` path aliases (see `tsconfig.json`).

## Testing Guidelines
- Test framework: Vitest with Testing Library and `jsdom`.
- Name tests `*.test.ts` or `*.test.tsx` and colocate with source.
- Shared setup lives in `src/__tests__/setup.ts`.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and sentence case (e.g., "Add concept visualizations", "Fix Vercel config").
- PRs should include a clear summary, linked issue (if any), and screenshots for UI changes.
- Note the commands you ran (e.g., `npm run lint`, `npm run test:run`).

## Configuration & Deployment
- App configuration lives in `next.config.js`; deployment settings in `vercel.json`.
- SEO artifacts are in `src/app/robots.ts` and `src/app/sitemap.ts`.

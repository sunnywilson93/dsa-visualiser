# CLAUDE.md — Enforced Rules

> Every rule here is a HARD constraint. Violating any rule is a bug.

## Pre-Flight Checklist (BEFORE writing any code)

1. Read the files you are modifying — NEVER guess at existing code
2. Scan for existing patterns in nearby files — match them exactly
3. Check if a reusable component already exists in `src/components/ui/` or `src/components/` before creating anything new
4. Check `src/styles/globals.css` `@theme` block for available tokens before inventing values
5. Plan the approach — check for duplication and circular dependency risks

## Commands

```bash
npm run dev              # Dev server
npm run build            # Production build (MUST pass before committing)
npm run lint             # ESLint (MUST pass before committing)
npm test -- <file>       # Run specific test
npm run test:run         # All tests (CI mode)
npm run tokens:audit     # Audit CSS token usage
```

---

## 1. TypeScript — STRICT, NO EXCEPTIONS

- NEVER use `any`. Use `unknown` + type guards, generics, or proper interfaces
- NEVER use `@ts-ignore` or `@ts-expect-error` — fix the type instead
- NEVER use `as` type assertions unless narrowing from `unknown` after a runtime check
- ALL function parameters and return types MUST be explicitly typed
- ALL component props MUST have a dedicated `interface` or `type` (e.g., `interface FooProps`)
- ALL shared types go in `src/types/index.ts` — component-local types stay in the component file
- Export types separately: `export type { FooProps }` (not mixed with value exports)
- tsconfig has `"strict": true` — respect all strict checks

## 2. CSS — Token-First, Tailwind Config is Source of Truth

### The Rule

ALL styling values MUST come from the design token system defined in `src/styles/globals.css` `@theme` block. This is a Tailwind v4 project — the `@theme` block IS the Tailwind config.

### NEVER hardcode these:

| Property | WRONG | RIGHT |
|----------|-------|-------|
| Colors | `#38bdf8`, `rgba(...)` | `var(--color-accent-blue)`, `var(--color-white-10)` |
| Spacing | `8px`, `1rem`, `12px` | `var(--spacing-sm)`, `var(--spacing-md)` |
| Font size | `14px`, `0.85rem` | `var(--text-sm)`, `var(--text-base)` |
| Font weight | `600`, `bold` | `var(--font-weight-semibold)`, `var(--font-weight-bold)` |
| Border radius | `4px`, `8px` | `var(--radius-sm)`, `var(--radius-lg)` |
| Border width | `1px`, `2px` | `var(--border-width-1)`, `var(--border-width-2)` |
| Transitions | `0.2s ease` | `var(--transition-fast)` |
| Shadows | `0 4px 6px ...` | `var(--shadow-md)` |
| Line height | `1.5` | `var(--leading-normal)` |

### Allowed raw values (NOT violations):

- `@media` queries — CSS vars cannot be used in media queries
- `calc()` expressions combining tokens — `calc(var(--spacing-md) + var(--spacing-sm))`
- Structural values — `100%`, `0`, `none`, `transparent`, `auto`, `1fr`, `fit-content`
- Position offsets in layout — `top: -6px` for structural positioning
- Scoped CSS vars defined and consumed within the same `.module.css` file

### Tailwind v4 Type Hint Rule

When using BOTH font-size and color as Tailwind classes on the same element, ALWAYS use type hints:
```
WRONG: text-[var(--text-base)] text-[var(--color-text-muted)]
RIGHT: text-[length:var(--text-base)] text-[color:var(--color-text-muted)]
```

### Adding New Tokens

1. First — check if an existing token is close enough (within 1-2px)
2. If not, add to `src/styles/globals.css` `@theme` block following pattern: `--{category}-{scale}`
3. NEVER add tokens to `:root` — all tokens live in `@theme`

### Common Utility Classes

Global utilities live in `src/styles/globals.css` `@layer utilities` block. Check for existing utilities before writing custom CSS:
- `.scrollbar-hide` — hides scrollbars
- `.container-*` — max-width containers (narrow/content/default/wide)
- `.min-h-card-*` — card min-heights
- `.grid-cols-auto-*` — auto-fill grid columns
- `.drop-shadow-glow-*` — glow effects

## 3. CSS Consistency Rules

- EVERY component uses CSS Modules: `ComponentName.module.css` imported as `styles`
- NEVER use inline styles — use CSS Modules or Tailwind classes
- NEVER mix CSS Modules and Tailwind for the same property on the same element
- Class composition: use `clsx()` (already installed) for conditional classes
- ALWAYS use the same spacing scale — if siblings use `var(--spacing-sm)`, new elements in that group MUST too
- Border pattern: `var(--border-width-1) solid var(--color-border-primary)` — ALWAYS this order

## 4. Component Architecture — Reusability is MANDATORY

### Before Creating a New Component

1. Search `src/components/` — does a similar component already exist?
2. Search `src/components/ui/` — is there a shared primitive you should use?
3. If the pattern appears 2+ times, it MUST be a shared component

### Component Rules

- EVERY component is a React functional component with TypeScript
- EVERY component has a named export (no default exports)
- EVERY component's props are defined as an interface: `interface ComponentNameProps`
- File structure: `src/components/ComponentName/ComponentName.tsx` + `ComponentName.module.css` + `index.ts`
- Barrel exports: each component directory has an `index.ts` that re-exports

### Shared UI Components (`src/components/ui/`)

These MUST be used instead of recreating:
- `NeonBox` — themed container with glow variants
- `CodePanel` / `CodeLine` — code display blocks
- `LevelSelector` — difficulty/level picker
- `ExampleTabs` — tabbed example switcher
- `VariantSelector` — variant picker
- `StepBadge` — step indicator badge

### State Management

- Global state: Zustand store (`src/store/executionStore.ts`)
- Component state: `useState` / `useReducer`
- NEVER prop-drill more than 2 levels — use Zustand or context instead
- NEVER mutate state directly — Zustand uses Immer for immutable updates

## 5. App Consistency Rules

### Code Style

- 2 spaces indentation, single quotes, no semicolons
- Path alias: `@/` maps to `src/` — ALWAYS use `@/` imports, never relative `../../`
- Naming: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE for constants
- Files: PascalCase for components (`Button.tsx`), camelCase for utilities (`formatValue.ts`)

### Architecture Patterns

- `src/engine/` — interpreter logic (parser, interpreter, runtime). NEVER import React here
- `src/store/` — Zustand stores. NEVER import components here
- `src/data/` — static data definitions. NEVER import stores or components here
- `src/components/` — React components. Can import from engine, store, data
- `src/types/` — shared TypeScript types
- `src/app/` — Next.js pages and layouts (App Router)

### Routing

- `/` — Home
- `/concepts/js/[conceptId]` — JS concept page
- `/concepts/dsa/[conceptId]` — DSA concept page
- `/[categoryId]` — Problem category listing
- `/[categoryId]/[problemId]` — Practice page
- `/[categoryId]/[problemId]/concept` — Algorithm visualization

### No Dead Code

- NEVER leave commented-out code
- NEVER leave unused imports, variables, or functions
- NEVER add `// removed` or `// deprecated` comments — just delete

## 6. Testing

- Framework: Vitest + React Testing Library + jsdom
- Tests colocated: `ComponentName.test.tsx` next to `ComponentName.tsx`
- MUST test: interpreter logic, parser, execution store, shared utilities
- Use `describe` / `it` blocks with clear descriptions
- Setup: `src/__tests__/setup.ts`

## 7. Pre-Commit Enforcement

Husky runs on every commit:
1. `npm run lint` — ESLint with `next/core-web-vitals`
2. Visual regression smoke test (if `.css` or `.tsx` files changed)

NEVER use `--no-verify` to skip hooks.

## 8. Anti-Patterns — NEVER Do These

- NEVER create a new file when you can extend an existing one
- NEVER add comments that restate what the code does — only explain WHY when non-obvious
- NEVER introduce circular dependencies between modules
- NEVER change existing behavior unless explicitly asked
- NEVER add `console.log` in committed code (use proper error handling)
- NEVER create duplicate utilities — search first, reuse existing
- NEVER use `!important` in CSS unless overriding third-party styles (Monaco)

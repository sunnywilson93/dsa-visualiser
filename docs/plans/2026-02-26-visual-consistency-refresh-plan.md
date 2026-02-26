# Visual Consistency Refresh — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate visual inconsistency across all pages by creating shared layout components, a unified motion system, and standardized token usage.

**Architecture:** Create 5 shared UI components + motion preset library. Migrate all pages to use them. Clean up redundant color/typography usage. Existing UI components (`NeonBox`, `CodePanel`, etc.) are flat files in `src/components/ui/` — new components follow the same pattern (flat files + CSS modules alongside).

**Tech Stack:** React 18, Next.js 14 (App Router), Tailwind CSS v4, Framer Motion 11, CSS Modules, TypeScript strict mode.

**Design Doc:** `docs/plans/2026-02-26-visual-consistency-refresh-design.md`

---

## Key References

- **Design tokens:** `src/styles/globals.css` `@theme` block
- **Existing UI components:** `src/components/ui/index.ts` (barrel exports)
- **Class utility:** `cn()` from `@/utils/cn` (wraps `clsx`)
- **Card tokens already defined:** `--surface-card`, `--surface-card-hover`, `--border-card`, `--border-card-hover`
- **Container utilities:** `container-default` (1200px), `container-content` (900px), `container-narrow` (600px)
- **Path alias:** `@/` maps to `src/`
- **Component pattern:** Flat files in `src/components/ui/` — no subdirectories for simple components
- **Framer Motion convention:** `duration: 0.15` for interactions, `duration: 0.2-0.3` for entrances, `ease: 'easeOut'`

---

## Phase 1: Foundation (Motion + Components)

### Task 1: Create motion presets

**Files:**
- Create: `src/lib/motion.ts`

**Step 1: Create motion presets file**

```typescript
// src/lib/motion.ts
import type { Variants, Transition } from 'framer-motion'

// === Entrance animations ===

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

// Use as child of staggerContainer
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

// === Transitions ===

export const entranceTransition: Transition = {
  duration: 0.3,
  ease: 'easeOut',
}

export const quickTransition: Transition = {
  duration: 0.15,
  ease: 'easeOut',
}

// === Interaction props (spread onto motion elements) ===

export const hoverLift = {
  whileHover: { y: -2 },
  transition: { duration: 0.15 },
} as const

export const tapScale = {
  whileTap: { scale: 0.98 },
} as const
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to `src/lib/motion.ts`

**Step 3: Commit**

```bash
git add src/lib/motion.ts
git commit -m "feat(ui): add shared motion presets for Framer Motion"
```

---

### Task 2: Create ContentCard component

**Files:**
- Create: `src/components/ui/ContentCard.tsx`
- Create: `src/components/ui/ContentCard.module.css`
- Modify: `src/components/ui/index.ts`

**Step 1: Create CSS Module**

```css
/* src/components/ui/ContentCard.module.css */

.card {
  display: block;
  text-decoration: none;
  color: inherit;
  border: var(--border-width-1) solid var(--border-card);
  background: var(--surface-card);
  transition: var(--transition-fast);
}

.card:hover {
  border-color: var(--border-card-hover);
  background: var(--surface-card-hover);
  transform: translateY(-2px);
}

.card:focus-visible {
  outline: var(--border-width-2) solid var(--color-brand-primary);
  outline-offset: 2px;
}

/* Variant: feature (big cards) */
.feature {
  border-radius: var(--radius-xl);
}

.featureInner {
  background: var(--color-bg-page-secondary);
  border-radius: calc(var(--radius-xl) - 2px);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  height: 100%;
}

/* Variant: compact (dense cards) */
.compact {
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Variant: listing (problem cards) */
.listing {
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Variant: interactive (homepage featured) */
.interactive {
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
}

.interactive:hover {
  box-shadow: var(--shadow-md);
}
```

**Step 2: Create component**

```typescript
// src/components/ui/ContentCard.tsx
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import { staggerItem, hoverLift, tapScale } from '@/lib/motion'
import styles from './ContentCard.module.css'

type ContentCardVariant = 'feature' | 'compact' | 'listing' | 'interactive'

interface ContentCardProps {
  href: string
  variant: ContentCardVariant
  children: ReactNode
  className?: string
}

export function ContentCard({ href, variant, children, className }: ContentCardProps) {
  return (
    <motion.div variants={staggerItem} {...hoverLift} {...tapScale}>
      <Link
        href={href}
        className={cn(styles.card, styles[variant], className)}
      >
        {variant === 'feature' ? (
          <div className={styles.featureInner}>{children}</div>
        ) : (
          children
        )}
      </Link>
    </motion.div>
  )
}

export type { ContentCardProps, ContentCardVariant }
```

**Step 3: Add barrel export**

Append to `src/components/ui/index.ts`:

```typescript
export { ContentCard } from './ContentCard'
export type { ContentCardProps, ContentCardVariant } from './ContentCard'
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

**Step 5: Commit**

```bash
git add src/components/ui/ContentCard.tsx src/components/ui/ContentCard.module.css src/components/ui/index.ts
git commit -m "feat(ui): add ContentCard component with 4 variants"
```

---

### Task 3: Create SectionContainer component

**Files:**
- Create: `src/components/ui/SectionContainer.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Create component**

```typescript
// src/components/ui/SectionContainer.tsx
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, entranceTransition } from '@/lib/motion'

interface SectionContainerProps {
  title: string
  subtitle?: string
  number?: number
  viewAllHref?: string
  viewAllLabel?: string
  children: ReactNode
}

export function SectionContainer({
  title,
  subtitle,
  number,
  viewAllHref,
  viewAllLabel,
  children,
}: SectionContainerProps) {
  return (
    <motion.section
      className="mb-10"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={entranceTransition}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-text-bright m-0">
            {number !== undefined && (
              <span className="inline-flex items-center justify-center w-7 h-7 bg-brand-primary rounded-lg text-base font-bold text-white">
                {number}
              </span>
            )}
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-text-secondary mt-1 mb-0">{subtitle}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-base text-brand-primary no-underline py-2 px-0 hover:text-brand-secondary transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none focus-visible:rounded"
          >
            {viewAllLabel ?? 'View All →'}
          </Link>
        )}
      </div>
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {children}
      </motion.div>
    </motion.section>
  )
}

export type { SectionContainerProps }
```

**Step 2: Add barrel export**

Append to `src/components/ui/index.ts`:

```typescript
export { SectionContainer } from './SectionContainer'
export type { SectionContainerProps } from './SectionContainer'
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 4: Commit**

```bash
git add src/components/ui/SectionContainer.tsx src/components/ui/index.ts
git commit -m "feat(ui): add SectionContainer with numbered headers and stagger"
```

---

### Task 4: Create PageHeader component

**Files:**
- Create: `src/components/ui/PageHeader.tsx`
- Create: `src/components/ui/PageHeader.module.css`
- Modify: `src/components/ui/index.ts`

**Step 1: Create CSS Module**

```css
/* src/components/ui/PageHeader.module.css */

.hero {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-2xl);
}

.heroTitle {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-brand-light);
  margin: 0 0 var(--spacing-md) 0;
}

.heroSubtitle {
  font-size: var(--text-md);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.section {
  padding: var(--spacing-xl) 0;
}

.sectionTitle {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-bright);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.sectionSubtitle {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
}

.compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-bottom: var(--border-width-1) solid var(--color-border-primary);
  background: rgba(19, 19, 26, 0.5);
}

.compactTitle {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-bright);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 767px) {
  .heroTitle {
    font-size: var(--text-2xl);
  }
}
```

**Step 2: Create component**

```typescript
// src/components/ui/PageHeader.tsx
'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, entranceTransition } from '@/lib/motion'
import { cn } from '@/utils/cn'
import styles from './PageHeader.module.css'

type PageHeaderVariant = 'hero' | 'section' | 'compact'

interface PageHeaderProps {
  variant: PageHeaderVariant
  title: string
  subtitle?: string
  icon?: ReactNode
  metadata?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  variant,
  title,
  subtitle,
  icon,
  metadata,
  actions,
  className,
}: PageHeaderProps) {
  if (variant === 'hero') {
    return (
      <motion.header
        className={cn(styles.hero, className)}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={entranceTransition}
      >
        <h1 className={styles.heroTitle}>{title}</h1>
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
        {metadata}
        {actions}
      </motion.header>
    )
  }

  if (variant === 'compact') {
    return (
      <header className={cn(styles.compact, className)}>
        {icon}
        <h1 className={styles.compactTitle}>{title}</h1>
        {metadata}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </header>
    )
  }

  // Section variant
  return (
    <motion.header
      className={cn(styles.section, className)}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={entranceTransition}
    >
      <div className="flex items-start gap-4">
        {icon}
        <div className="flex-1">
          <h1 className={styles.sectionTitle}>{title}</h1>
          {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
          {metadata}
        </div>
        {actions}
      </div>
    </motion.header>
  )
}

export type { PageHeaderProps, PageHeaderVariant }
```

**Step 3: Add barrel export**

Append to `src/components/ui/index.ts`:

```typescript
export { PageHeader } from './PageHeader'
export type { PageHeaderProps, PageHeaderVariant } from './PageHeader'
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 5: Commit**

```bash
git add src/components/ui/PageHeader.tsx src/components/ui/PageHeader.module.css src/components/ui/index.ts
git commit -m "feat(ui): add PageHeader component with hero, section, compact variants"
```

---

### Task 5: Create PageLayout component

**Files:**
- Create: `src/components/ui/PageLayout.tsx`
- Modify: `src/components/ui/index.ts`

**Step 1: Create component**

```typescript
// src/components/ui/PageLayout.tsx
'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { NavBar } from '@/components/NavBar'
import { cn } from '@/utils/cn'
import { pageEnter, entranceTransition } from '@/lib/motion'

type PageLayoutVariant = 'wide' | 'content' | 'narrow'

interface Breadcrumb {
  label: string
  path?: string
}

interface PageLayoutProps {
  variant: PageLayoutVariant
  breadcrumbs?: Breadcrumb[]
  children: ReactNode
  className?: string
}

const containerClass: Record<PageLayoutVariant, string> = {
  wide: 'container-default',
  content: 'container-content',
  narrow: 'container-narrow',
}

export function PageLayout({ variant, breadcrumbs, children, className }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-bg-page from-0% to-bg-page-secondary to-100%">
      <NavBar breadcrumbs={breadcrumbs} />
      <motion.main
        className={cn(
          'flex-1 py-8 px-8 max-md:px-4 mx-auto w-full',
          containerClass[variant],
          className,
        )}
        variants={pageEnter}
        initial="hidden"
        animate="visible"
        transition={entranceTransition}
      >
        {children}
      </motion.main>
    </div>
  )
}

export type { PageLayoutProps, PageLayoutVariant }
```

**Step 2: Add barrel export**

Append to `src/components/ui/index.ts`:

```typescript
export { PageLayout } from './PageLayout'
export type { PageLayoutProps, PageLayoutVariant } from './PageLayout'
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 4: Commit**

```bash
git add src/components/ui/PageLayout.tsx src/components/ui/index.ts
git commit -m "feat(ui): add PageLayout component with NavBar and page entrance animation"
```

---

### Task 6: Create FilterBar component

**Files:**
- Create: `src/components/ui/FilterBar.tsx`
- Create: `src/components/ui/FilterBar.module.css`
- Modify: `src/components/ui/index.ts`

**Step 1: Create CSS Module**

```css
/* src/components/ui/FilterBar.module.css */

.container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.pill {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  border: var(--border-width-1) solid var(--color-border-primary);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
  cursor: pointer;
}

.pill:hover {
  border-color: var(--color-brand-primary-40);
  color: var(--color-text-bright);
}

.pillActive {
  border-color: var(--color-brand-primary);
  background: var(--color-brand-primary-15);
  color: var(--color-brand-primary);
}

.tab {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-bottom: var(--border-width-2) solid transparent;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
  cursor: pointer;
}

.tab:hover {
  color: var(--color-text-bright);
  border-bottom-color: var(--color-white-20);
}

.tabActive {
  color: var(--color-brand-primary);
  border-bottom-color: var(--color-brand-primary);
}
```

**Step 2: Create component**

```typescript
// src/components/ui/FilterBar.tsx
'use client'

import { cn } from '@/utils/cn'
import styles from './FilterBar.module.css'

interface FilterOption {
  id: string
  label: string
  count?: number
}

type FilterBarVariant = 'pill' | 'tab'

interface FilterBarProps {
  filters: FilterOption[]
  activeFilter: string
  onFilterChange: (id: string) => void
  variant?: FilterBarVariant
  className?: string
}

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  variant = 'pill',
  className,
}: FilterBarProps) {
  const buttonClass = variant === 'pill' ? styles.pill : styles.tab
  const activeClass = variant === 'pill' ? styles.pillActive : styles.tabActive

  return (
    <div className={cn(styles.container, className)}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={cn(buttonClass, activeFilter === filter.id && activeClass)}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
          {filter.count !== undefined && ` (${filter.count})`}
        </button>
      ))}
    </div>
  )
}

export type { FilterBarProps, FilterBarVariant, FilterOption }
```

**Step 3: Add barrel export**

Append to `src/components/ui/index.ts`:

```typescript
export { FilterBar } from './FilterBar'
export type { FilterBarProps, FilterBarVariant, FilterOption } from './FilterBar'
```

**Step 4: Verify lint and types**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Run: `npm run lint`

**Step 5: Commit**

```bash
git add src/components/ui/FilterBar.tsx src/components/ui/FilterBar.module.css src/components/ui/index.ts
git commit -m "feat(ui): add FilterBar component with pill and tab variants"
```

---

## Phase 2: Homepage Migration (validates all components)

### Task 7: Migrate Homepage to use shared components

This is the most important migration — it validates all 5 components work together.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Read the current homepage**

Run: Read `src/app/page.tsx` completely to understand current structure.

**Step 2: Rewrite homepage using shared components**

Key changes:
- Add `'use client'` directive (needed for Framer Motion via shared components)
- Replace `<NavBar />` + outer wrapper → Not using PageLayout here since Homepage has unique hero + footer. Keep the outer wrapper but standardize it.
- Replace each section's manual heading+layout → `<SectionContainer>`
- Replace each inline card `<Link>` → `<ContentCard>`
- Replace `animate-[fadeIn_0.4s_ease-out_100ms_both]` CSS animations → Framer Motion via SectionContainer/ContentCard
- Keep `<HeroStats>`, `<CategoryCarousel>`, `<DifficultyMiniBar>` — these are specialized components
- Standardize text colors: `text-white` → `text-text-bright`
- Standardize shadows: remove hardcoded `hover:shadow-[0_4px_12px_rgba(...)]` — ContentCard handles this

**Important:** The homepage has a unique structure (hero + 4 sections + footer) that doesn't fit PageLayout. Keep its custom outer wrapper but use SectionContainer for each numbered section and ContentCard for all cards.

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Start dev server and visually verify**

Run: `npm run dev` (in background)
Navigate to `http://localhost:3000` and verify:
- Hero section renders with gradient text
- All 4 sections have entrance animations (stagger)
- Cards have hover lift + border color change
- Footer renders correctly

**Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor(home): migrate homepage to shared ContentCard and SectionContainer"
```

---

## Phase 3: Page Migrations

### Task 8: Migrate JS Concept page client

**Files:**
- Modify: `src/app/concepts/js/[conceptId]/ConceptPageClient.tsx` (the client component)

**Step 1: Read the current client component completely**

**Step 2: Apply changes**

Key changes:
- Replace outer wrapper with `<PageLayout variant="content">`
- Remove direct `<NavBar />` import (PageLayout handles it)
- Replace `<h1 className="... text-[length:var(--text-3xl)] ... text-white ...">` → use PageHeader(section) or just fix classes to `text-3xl font-bold text-text-bright`
- Replace all `text-[1.15rem]` → `text-lg`
- Replace all `text-white` → `text-text-bright`
- Replace `border-[var(--color-white-10)]` → `border-border-card` (using the token)
- Keep existing Framer Motion on list items but update to use shared presets (`staggerItem` variants)
- Remove back button (breadcrumbs handle navigation)

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(concepts): migrate JS concept page to shared layout components"
```

---

### Task 9: Migrate DSA Concept page client

**Files:**
- Modify: `src/app/concepts/dsa/[conceptId]/DSAConceptPageClient.tsx`

**Step 1: Read the current client component completely**

**Step 2: Apply same changes as Task 8**

The DSA concept page has nearly identical structure to JS concept page. Apply the same pattern:
- `<PageLayout variant="content">`
- Remove `<NavBar />`
- Fix heading classes
- Fix `text-[1.15rem]` → `text-lg`
- Fix `text-white` → `text-text-bright`
- Fix border tokens
- Update Framer Motion to shared presets

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(concepts): migrate DSA concept page to shared layout components"
```

---

### Task 10: Migrate Interview pages

**Files:**
- Modify: `src/app/interview/html/HTMLInterviewClient.tsx`
- Modify: `src/app/interview/css/CSSInterviewClient.tsx`
- Modify: `src/app/interview/js/JSInterviewClient.tsx`
- Modify: `src/app/interview/react/ReactInterviewClient.tsx`
- Modify: `src/app/interview/bundlers/BundlersInterviewClient.tsx`
- Remove: Associated `.module.css` files for these clients (the CSS is now in shared components)

**Step 1: Read one interview client (HTML) to understand the pattern**

**Step 2: For each interview client:**

Key changes:
- Replace outer wrapper with `<PageLayout variant="wide">`
- Remove direct `<NavBar />`
- Replace `.header` / `.title` / `.subtitle` CSS module classes → `<PageHeader variant="section">`
- Replace `styles.questionsGrid` → `motion.div` with `staggerContainer` variants + `className="flex flex-col gap-4"`
- Add `staggerItem` to each `<InterviewQuestionCard>` wrapper
- Remove the `.module.css` file if it's fully replaced

**Note:** All 5 interview clients follow the same pattern. Apply the same transformation to each.

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(interview): migrate all interview pages to shared layout components"
```

---

### Task 11: Migrate Category listing page

**Files:**
- Modify: `src/app/[categoryId]/CategoryPageClient.tsx`

**Step 1: Read the current component**

**Step 2: Apply changes**

Key changes:
- Replace outer wrapper → `<PageLayout variant="wide">`
- Remove direct `<NavBar />`
- If it has inline filter buttons, consider using `<FilterBar variant="tab">` (optional — only if the existing InterviewFilterBar pattern doesn't apply here)
- Fix typography: headings → `text-text-bright`, body → `text-text-secondary`
- Fix card borders to use `border-card` tokens

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(category): migrate category listing to shared layout components"
```

---

### Task 12: Migrate Practice page (minimal)

**Files:**
- Modify: `src/app/[categoryId]/[problemId]/PracticePageClient.tsx`

**Step 1: Read the current component**

**Step 2: Apply minimal changes**

The practice page is full-width with a 2-column editor layout. Do NOT wrap in PageLayout (it has its own layout needs). Changes:
- Replace the header bar with `<PageHeader variant="compact">`
- Add `tapScale` to the Analyze button (may already have whileHover/whileTap)
- Fix text colors to canonical tokens
- Keep the `flex h-screen flex-col` layout as-is

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(practice): use PageHeader compact variant and canonical tokens"
```

---

### Task 13: Migrate Concept Visualization page (minimal)

**Files:**
- Modify: `src/app/[categoryId]/[problemId]/concept/ConceptVizPageClient.tsx`

**Step 1: Read the current component**

**Step 2: Apply changes**

Key changes:
- Replace outer wrapper → `<PageLayout variant="content">`
- Remove direct `<NavBar />`
- Fix the header bar to use `<PageHeader variant="compact">`
- Fix text colors to canonical tokens
- Standardize spacing to use token values

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(concept-viz): migrate to shared layout and canonical tokens"
```

---

### Task 14: Migrate Event Loop Playground (minimal)

**Files:**
- Modify: `src/app/playground/event-loop/EventLoopPlaygroundClient.tsx`

**Step 1: Read the current component**

**Step 2: Apply minimal changes**

The playground has a specialized layout. Do NOT wrap in PageLayout. Changes:
- Keep the custom 2-column grid layout
- Fix text colors: `text-text-bright` for headings
- Add `fadeUp` entrance animation to the main container
- Keep everything else as-is (this page is already well-styled)

**Step 3: Verify build**

Run: `npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(playground): add entrance animation and canonical text colors"
```

---

## Phase 4: Cleanup & Verification

### Task 15: Color and typography sweep

**Files:**
- Potentially any component file with non-canonical color/typography usage

**Step 1: Search for non-canonical text color usage**

Run these searches across `src/`:
- `text-white` in `.tsx` files (should be `text-text-bright`)
- `text-[color:var(--color-gray` in `.tsx` files (should be `text-text-secondary` or `text-text-muted`)
- `text-[1.15rem]` in `.tsx` files (should be `text-lg`)
- `border-white-6` in `.tsx` files (should be `border-border-card` or `border-[var(--border-card)]`)
- `border-white-10` in `.tsx` files (same)
- `bg-white-3` in `.tsx` files (should be `bg-[var(--surface-card)]`)
- `bg-brand-primary-5` in `.tsx` files (same, for cards)

**Step 2: Fix remaining instances**

For each file with non-canonical usage:
- Read the file
- Determine the correct canonical token
- Replace the value
- Only change values that are used in the same semantic context (cards, headings, body text). Don't change visualization-specific colors.

**Step 3: Verify lint and build**

Run: `npm run lint && npm run build 2>&1 | tail -20`

**Step 4: Commit**

```bash
git commit -am "refactor(tokens): standardize to canonical color and typography tokens"
```

---

### Task 16: Final verification

**Step 1: Run full lint**

Run: `npm run lint`
Expected: No warnings or errors

**Step 2: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Run tests**

Run: `npm run test:run`
Expected: All tests pass

**Step 4: Verify all pages render**

Start dev server and verify these routes:
- `/` — Homepage
- `/concepts/js/scope-basics` — JS concept page
- `/concepts/dsa/big-o` — DSA concept page
- `/interview/html` — Interview page
- `/js-core` — Category listing
- `/js-core/scope-basics` — Practice page (any problem)
- `/playground/event-loop` — Event loop playground

**Step 5: Final commit if any fixes needed**

```bash
git commit -am "fix: address issues from final verification"
```

---

## Task Dependency Graph

```
Phase 1 (sequential):
  Task 1 (motion) → Task 2 (ContentCard) → Task 3 (SectionContainer)
                   → Task 4 (PageHeader) → Task 5 (PageLayout) → Task 6 (FilterBar)

Phase 2 (depends on Phase 1):
  Task 7 (Homepage migration)

Phase 3 (can be parallelized after Phase 2):
  Task 8 (JS Concepts) ─┐
  Task 9 (DSA Concepts) ─┤
  Task 10 (Interview) ───┤─ All independent
  Task 11 (Category) ────┤
  Task 12 (Practice) ────┤
  Task 13 (Concept Viz) ─┤
  Task 14 (Playground) ──┘

Phase 4 (after all migrations):
  Task 15 (Color sweep) → Task 16 (Final verification)
```

**Total tasks:** 16
**Parallelizable:** Tasks 8-14 (Phase 3) can all run concurrently

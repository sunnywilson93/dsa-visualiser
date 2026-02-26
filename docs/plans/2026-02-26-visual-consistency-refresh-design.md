# Visual Consistency Refresh — Design Document

**Date:** 2026-02-26
**Goal:** Eliminate visual inconsistency across all page types by creating shared layout components, a unified motion system, canonical color/typography mappings, and a standardized responsive strategy.
**Approach:** Component-First Unification (Approach A)
**Direction:** "Refined Dark" — clean, spacious layouts with indigo/teal brand as controlled accent

---

## Problem Statement

The product has evolved organically: pages built at different times use different styling approaches. The Homepage uses raw Tailwind classes, Concept pages use inline styles with CSS vars, Interview pages use clean CSS Modules. This results in:

- 5 different page header patterns
- 3+ ways to express the same heading size
- No unified card component (each page rolls its own styled `<Link>`)
- Selective animation (Homepage animated, Interview pages static)
- Mixed border opacities, text colors, and spacing values for identical UI concepts

The design token system in `globals.css` is mature (400+ lines), but adoption is inconsistent.

---

## 1. Shared Layout Components

### 1.1 `PageLayout`

**Location:** `src/components/ui/PageLayout/PageLayout.tsx`

Thin wrapper for overall page structure. Encodes gradient background, container max-width, and responsive padding.

```
Props:
  variant: 'wide' | 'content' | 'narrow'  (maps to container-default/content/narrow)
  children: ReactNode
```

- `wide` → `container-default` (1200px) — Homepage, Interview, Category listing
- `content` → `container-content` (900px) — Concept pages (reading-focused)
- `narrow` → `container-narrow` (600px) — if ever needed
- Practice page remains full-width (no PageLayout wrapper)

Standardizes:
- `min-h-screen flex flex-col bg-gradient-to-br from-bg-page to-bg-page-secondary`
- Horizontal padding: `px-8` desktop, `px-4` mobile (max-md)
- Includes `NavBar` at top
- Applies page entrance animation via Framer Motion `pageEnter` preset

### 1.2 `PageHeader`

**Location:** `src/components/ui/PageHeader/PageHeader.tsx`

3 variants:

**Hero** (homepage):
- Centered layout, `--text-3xl` title (bold, `text-bright`), `--text-md` subtitle (`text-secondary`)
- Optional stats row (HeroStats), optional CTA buttons
- `py-10 px-8`

**Section** (concept/interview/category pages):
- Left-aligned, icon + `--text-xl` title + `--text-base` subtitle
- Optional metadata slot (difficulty badge, read time, topic count)
- Removes redundant back button (breadcrumbs in NavBar handle navigation)

**Compact** (practice page):
- Single-line bar, `--text-lg` title, difficulty badge, concept link
- Minimal vertical padding

```
Props:
  variant: 'hero' | 'section' | 'compact'
  title: string
  subtitle?: string
  icon?: ReactNode
  metadata?: ReactNode
  actions?: ReactNode
  stats?: HeroStatsProps['stats']
```

### 1.3 `ContentCard`

**Location:** `src/components/ui/ContentCard/ContentCard.tsx`

Replaces all ad-hoc styled `<Link>` card elements.

4 variants:

**Feature** — big cards (concept categories, interview topics):
- `rounded-xl`, inner bg `surface-card`, icon + badge row + title + description
- Used for: JS Deep Dive, DSA Fundamentals, HTML/CSS/JS/React/Bundler interview cards

**Compact** — dense cards (DSA subcategories):
- `rounded-lg`, horizontal layout, icon + text
- Used for: DSA subcategory preview grid

**Listing** — problem cards in category pages:
- Similar to Feature but denser content layout

**Interactive** — homepage featured concepts:
- Enhanced hover states (lift + shadow + glow)

All variants share:
- Border: `var(--border-card)` → `var(--border-card-hover)` on hover
- Background: `var(--surface-card)` → `var(--surface-card-hover)` on hover
- Transition: `var(--transition-fast)`
- Hover: `-translate-y-0.5` lift + border color change
- Feature/Listing use `var(--radius-xl)`, Compact uses `var(--radius-lg)`

```
Props:
  href: string
  variant: 'feature' | 'compact' | 'listing' | 'interactive'
  children: ReactNode
  className?: string
```

### 1.4 `SectionContainer`

**Location:** `src/components/ui/SectionContainer/SectionContainer.tsx`

Wraps content sections with consistent heading, spacing, and entrance animation.

```
Props:
  title: string
  subtitle?: string
  number?: number           (renders the numbered badge: 1, 2, 3, 4)
  viewAllHref?: string
  viewAllLabel?: string
  animationDelay?: number   (stagger offset in ms)
  children: ReactNode
```

Encodes:
- `mb-10` between sections
- `mb-6` from title to content
- Section heading with optional numbered badge + "View All →" link
- Entrance animation via Framer Motion `fadeUp` with configurable delay

### 1.5 `FilterBar`

**Location:** `src/components/ui/FilterBar/FilterBar.tsx`

Unifies interview topic filters and category filter buttons.

```
Props:
  filters: Array<{ id: string; label: string; count?: number }>
  activeFilter: string
  onFilterChange: (id: string) => void
  variant: 'pill' | 'tab'
```

- `pill` variant: rounded pill buttons (current interview filter style)
- `tab` variant: underline-style tabs for category switching

---

## 2. Motion System

### 2.1 Motion Presets

**Location:** `src/lib/motion.ts`

Framer Motion variant objects, exported as named constants:

**Entrance:**
- `fadeUp` — `initial: { opacity: 0, y: 12 }`, `animate: { opacity: 1, y: 0 }`, `transition: { duration: 0.3 }`
- `fadeIn` — `initial: { opacity: 0 }`, `animate: { opacity: 1 }`, `transition: { duration: 0.2 }`
- `staggerContainer` — `animate: { transition: { staggerChildren: 0.05 } }`
- `staggerItem` — same as `fadeUp` but triggered by parent stagger

**Interaction:**
- `hoverLift` — `whileHover: { y: -2 }`, `transition: { duration: 0.15 }`
- `tapScale` — `whileTap: { scale: 0.98 }`

**Page:**
- `pageEnter` — `initial: { opacity: 0, y: 8 }`, `animate: { opacity: 1, y: 0 }`, `transition: { duration: 0.3 }`

### 2.2 Motion Rules

1. Every page gets entrance animation via `PageLayout`
2. Every card grid uses `staggerContainer` on parent, `staggerItem` on children
3. Every clickable card gets `hoverLift` (via `ContentCard`)
4. Every button gets `tapScale`
5. Hover border/bg transitions use CSS `var(--transition-fast)` (150ms), not Framer Motion
6. No CSS `animate-[...]` arbitrary values — all motion through presets or tokens

### 2.3 Migration

- Homepage: replace CSS keyframe `animate-[fadeIn_0.4s_ease-out_100ms_both]` → Framer Motion `staggerContainer`/`staggerItem`
- Concept pages: replace ad-hoc `motion.li` configs → shared presets
- Interview pages: add `staggerContainer` on question grid, `fadeUp` on cards
- Category/Practice pages: add page entrance + card interactions

---

## 3. Color & Typography Cleanup

### 3.1 Typography Hierarchy

| Role | Token | Size | Weight | Color |
|------|-------|------|--------|-------|
| Page Title | `--text-3xl` | 2rem | bold | `text-bright` |
| Section Title | `--text-2xl` | 1.5rem | bold | `text-bright` |
| Card Title | `--text-xl` | 1.25rem | bold | `text-bright` |
| Subsection Title | `--text-lg` | 1.125rem | semibold | `text-bright` |
| Body | `--text-base` | 0.85rem | normal | `text-secondary` |
| Caption | `--text-sm` | 0.75rem | medium | `text-muted` |
| Micro | `--text-xs` | 0.7rem | medium | `text-muted` |

### 3.2 Color Canonical Mapping

**Text — one token per intent:**

| Intent | Canonical Token | Eliminates |
|--------|----------------|------------|
| Headings, titles | `text-bright` (#fff) | `text-white`, `text-text-primary` on headings |
| Body, descriptions | `text-secondary` (#94a3b8) | `gray-400`, `gray-500` for body text |
| Captions, metadata | `text-muted` (#64748b) | `gray-500-tw`, `gray-600` for captions |
| Default body | `text-primary` (#f1f5f9) | Only set on `body` in CSS — not applied to elements |

**Card surfaces — one pattern:**

| State | Border | Background |
|-------|--------|------------|
| Default | `var(--border-card)` (white 8%) | `var(--surface-card)` (white 3%) |
| Hover | `var(--border-card-hover)` (brand 40%) | `var(--surface-card-hover)` (brand 10%) |

Replaces: `border-white-6`, `border-white-10`, `border-brand-primary-20`, `bg-white-3`, `bg-brand-primary-5`, `bg-bg-page-secondary` — all used for the same card concept.

**Accent usage:**
- `brand-primary` (#6366f1) — CTAs, active states, links, interactive accents
- `brand-secondary` (#14b8a6) — gradient endpoints only (never standalone)
- `accent-*` colors — semantic meaning in visualizations only

### 3.3 What Gets Eliminated

- `text-white` on elements → `text-bright`
- `text-[color:var(--color-gray-400)]` inline → `text-secondary`
- `border-white-6` vs `border-white-10` → `border-card`
- `bg-brand-primary-5` vs `bg-white-3` for cards → `surface-card`
- `text-[1.15rem]` hardcoded → `text-lg`
- Inline style typography → Tailwind classes with tokens

---

## 4. Responsive Strategy & Spacing

### 4.1 Breakpoint Tiers

| Tier | Tailwind | Width | Purpose |
|------|----------|-------|---------|
| Desktop | default | 1024px+ | Full grids, side-by-side |
| Tablet | `max-lg:` | < 1024px | Reduced columns |
| Mobile | `max-md:` | < 768px | Single column, compact |

`max-sm:` (< 640px) reserved for fine-tuning within mobile layouts only.

### 4.2 Grid Collapse Pattern

Always: `N cols → 2 cols (max-lg) → 1 col (max-md)`

| Content Type | Desktop | Tablet | Mobile | Gap |
|-------------|---------|--------|--------|-----|
| Feature cards | 2-col | 2-col | 1-col | `gap-4` |
| Compact cards | 4-col | 2-col | 1-col | `gap-3` |
| Interview topics | 5-col | 2-col | 1-col | `gap-4` |
| Lists | 1-col | 1-col | 1-col | `gap-4` |

Gap values: `gap-4` (16px) standard, `gap-3` (12px) compact. No other values in grids.

### 4.3 Page Spacing Rhythm

| Element | Value |
|---------|-------|
| Page top padding | `py-8` (32px) |
| Between sections | `mb-10` (40px) |
| Title to content | `mb-6` (24px) |
| Horizontal padding | `px-8` desktop, `px-4` mobile |

### 4.4 Container Widths

| Page Type | Container | Reasoning |
|-----------|-----------|-----------|
| Homepage | `container-default` (1200px) | Grid-heavy |
| Concept pages | `container-content` (900px) | Reading-focused |
| Interview pages | `container-default` (1200px) | Card grids |
| Category listing | `container-default` (1200px) | Problem grids |
| Practice page | Full width | Editor needs space |

---

## 5. Migration Scope

### Pages to Migrate

1. **Homepage** (`src/app/page.tsx`) — extract inline cards to `ContentCard`, sections to `SectionContainer`, replace CSS keyframe animations with Framer Motion presets
2. **Concept pages** (`src/app/concepts/js/[conceptId]/page.tsx`, `src/app/concepts/dsa/[conceptId]/page.tsx`) — wrap in `PageLayout(content)`, use `PageHeader(section)`, replace inline styles with token classes, add motion
3. **Interview pages** (`src/app/interview/*/page.tsx`) — wrap in `PageLayout(wide)`, use `PageHeader(section)`, add entrance animations to question cards
4. **Category listing** (`src/app/[categoryId]/page.tsx`) — wrap in `PageLayout(wide)`, migrate problem cards to `ContentCard(listing)`
5. **Practice page** (`src/app/[categoryId]/[problemId]/page.tsx`) — use `PageHeader(compact)`, add page entrance
6. **Concept visualization** (`src/app/[categoryId]/[problemId]/concept/page.tsx`) — wrap in `PageLayout(content)`, standardize section styles
7. **Event loop playground** — minimal changes, already specialized

### New Files

- `src/components/ui/PageLayout/PageLayout.tsx` + `.module.css` + `index.ts`
- `src/components/ui/PageHeader/PageHeader.tsx` + `.module.css` + `index.ts`
- `src/components/ui/ContentCard/ContentCard.tsx` + `.module.css` + `index.ts`
- `src/components/ui/SectionContainer/SectionContainer.tsx` + `.module.css` + `index.ts`
- `src/components/ui/FilterBar/FilterBar.tsx` + `.module.css` + `index.ts`
- `src/lib/motion.ts`

### Files Modified

- All page files listed above
- `src/styles/globals.css` — no new tokens needed (existing tokens are sufficient)
- Existing component CSS modules — standardize to canonical token usage

### Files NOT Changed

- `src/engine/*` — no React, no visual changes
- `src/store/*` — state logic unchanged
- `src/data/*` — content unchanged
- `src/components/ui/NeonBox/`, `CodePanel/`, etc. — specialized viz components untouched

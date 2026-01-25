# Stack Research: Polish & Production

**Project:** DSA Visualizer - Polish & Production Features
**Researched:** 2026-01-25
**Focus:** Responsive design, SEO optimization, cross-linking
**Confidence:** HIGH

## Executive Summary

The existing stack (Next.js 14, React 18, CSS Modules, Framer Motion, Zustand) already provides robust foundations for the polish features. **No new dependencies are required.** All needed capabilities exist in the current stack or as built-in Next.js features.

---

## Recommended Additions

### 1. Dynamic OG Image Generation (Built-in)

**What:** Use Next.js built-in `ImageResponse` from `next/og` for dynamic OpenGraph images.

**Why:** The project currently has a static SVG OG image (`public/og-image.svg`), but OpenGraph requires PNG/JPG format. Social media platforms (Twitter, LinkedIn, Facebook) need properly formatted images to display rich previews. Dynamic generation allows unique images per page.

**Implementation:**
- Create `opengraph-image.tsx` files in dynamic route folders
- Use `ImageResponse` constructor from `next/og`
- No npm install required - built into Next.js 14

```typescript
// Example: src/app/concepts/[conceptId]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { conceptId: string } }) {
  return new ImageResponse(
    <div style={{ /* flexbox layout */ }}>
      {/* JSX for OG image */}
    </div>,
    { ...size }
  )
}
```

**Limitations (documented):**
- Only flexbox layouts supported
- Limited CSS subset (no grid, no complex selectors)
- Maximum 500KB bundle size
- Only ttf, otf, woff fonts

**Confidence:** HIGH (verified via [Next.js Official Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image))

---

### 2. Responsive Design (No New Tools)

**What:** Continue using CSS Modules with media queries; optionally add container queries for component-level responsiveness.

**Why:** The project already has responsive patterns in place (see `NavBar.module.css`, `page.module.css`). Container queries are now baseline-supported (since 2023) and complement media queries well for component-based design.

**Current State (already implemented):**
- Media queries at 1024px, 768px, 640px, 480px, 400px breakpoints
- Responsive grids using `grid-template-columns`
- Text truncation and hiding on mobile
- NavBar responsive behavior (logo text hidden, search width reduced)

**Enhancement Path:**
```css
/* Container queries for component-level responsiveness */
.vizContainer {
  container-type: inline-size;
}

@container (max-width: 400px) {
  .cell {
    width: 32px;
    height: 32px;
  }
}
```

**Do NOT add Tailwind CSS.** The project uses CSS Modules consistently (80+ module files). Converting would be disruptive and unnecessary.

**Confidence:** HIGH (CSS container queries have baseline support since 2023, per [LogRocket Container Queries 2026](https://blog.logrocket.com/container-queries-2026/))

---

### 3. SEO Metadata (Already Implemented)

**What:** The project already has comprehensive SEO infrastructure.

**Current Implementation (verified in codebase):**
- Root `layout.tsx`: Full Metadata object with OpenGraph, Twitter cards, JSON-LD structured data
- Dynamic `generateMetadata` in: `[conceptId]/page.tsx`, `[problemId]/page.tsx`, `[categoryId]/page.tsx`
- `sitemap.ts`: Generates sitemap for all routes
- `robots.ts`: Robots configuration
- Structured data: FAQPage, BreadcrumbList, Article schemas
- `StructuredData` component for page-specific schema injection

**What's Missing:**
- Dynamic OG images (addressed above)
- Consistent page-specific Twitter images

**No new libraries needed.**

**Confidence:** HIGH (directly verified from codebase)

---

### 4. Cross-Linking Infrastructure (Partially Implemented)

**What:** The project has `relatedProblems` and `relatedConcepts` data fields. Need UI components to display them.

**Current State:**
- `Concept` type has `relatedProblems?: string[]`
- `getRelatedConcepts()` and `getRelatedProblems()` functions exist in `concepts.ts`
- DSA patterns have `relatedConcepts` field
- Data structures exist but UI rendering is incomplete

**What's Needed (no new dependencies):**
1. `RelatedContent` component using existing patterns
2. `CrossLinkCard` component for consistent styling
3. Populate `relatedProblems` and `relatedConcepts` data fields across all content

**Implementation Pattern:**
```typescript
// src/components/RelatedContent/RelatedContent.tsx
interface RelatedContentProps {
  concepts?: string[]
  problems?: string[]
}

export function RelatedContent({ concepts, problems }: RelatedContentProps) {
  // Use existing Link, motion components
  // Style with CSS Modules
}
```

**Confidence:** HIGH (verified existing infrastructure in `concepts.ts`, `dsaConcepts.ts`, `dsaPatterns.ts`)

---

## Integration Points

| Feature | Integrates With | Notes |
|---------|-----------------|-------|
| OG Images | `generateMetadata`, route folders | Co-located with page.tsx |
| Responsive | Existing CSS Modules | Add container queries as enhancement |
| Cross-links | `concepts.ts`, `dsaConcepts.ts` data | Component renders existing data fields |
| SEO | Existing `layout.tsx`, page metadata | Already structured correctly |

---

## What NOT to Add

### Tailwind CSS
**Why avoid:** Project has 80+ CSS Module files with established patterns and CSS custom properties design system. Migration cost is high, benefit is zero. CSS Modules provide component scoping already.

### next-seo Package
**Why avoid:** Next.js 14 has built-in Metadata API that's already fully utilized in this codebase. `next-seo` adds redundant abstraction over native features that are already implemented.

### React Responsive / react-device-detect
**Why avoid:** CSS media queries and container queries handle responsive design better. JavaScript-based detection causes hydration mismatches with SSR and adds unnecessary bundle size.

### Sharp (for OG images)
**Why avoid:** `ImageResponse` from `next/og` handles all OG image needs without additional dependencies. Sharp is for general image processing which isn't required.

### Schema.org / react-schemaorg Libraries
**Why avoid:** Project already implements JSON-LD structured data manually in `layout.tsx` and via `StructuredData` component. No additional abstraction needed.

### CSS-in-JS Libraries (styled-components, emotion)
**Why avoid:** CSS Modules are already established with 80+ files. Adding another styling solution would create inconsistency and increase bundle size.

---

## Version Verification

| Technology | Current Version | Status | Notes |
|------------|-----------------|--------|-------|
| Next.js | ^14.2.0 | Current | Has built-in ImageResponse |
| React | ^18.3.1 | Current | No upgrade needed |
| Framer Motion | ^11.0.0 | Current | All animation needs met |
| TypeScript | ~5.5.0 | Current | Full type safety |

All versions are current and support the required features. No upgrades needed.

---

## Feature-Specific Stack Summary

### Responsive Design
| Need | Solution | Source |
|------|----------|--------|
| Viewport-based layouts | Media queries (existing) | CSS Modules |
| Component-based layouts | Container queries (CSS native) | No library |
| Smooth transitions | Framer Motion (existing) | Already installed |

### SEO Optimization
| Need | Solution | Source |
|------|----------|--------|
| Page metadata | generateMetadata (existing) | Next.js built-in |
| OG images | ImageResponse | next/og (built-in) |
| Structured data | JSON-LD (existing pattern) | Manual implementation |
| Sitemap | sitemap.ts (existing) | Next.js built-in |

### Cross-Linking
| Need | Solution | Source |
|------|----------|--------|
| Data structure | relatedProblems, relatedConcepts (existing) | concepts.ts |
| UI component | New RelatedContent component | React + CSS Modules |
| Navigation | Next.js Link (existing) | Already used |

---

## Summary Recommendation

**Zero new npm dependencies required.**

All polish & production features can be implemented with:
1. **Built-in Next.js features:** `ImageResponse` for OG images, Metadata API for SEO
2. **Modern CSS features:** Container queries (baseline 2023), existing media query patterns
3. **Existing codebase patterns:** CSS Modules, React components, data structures already defined

This is an ideal scenario - the existing stack is well-chosen and complete for the planned features.

---

## Sources

- [Next.js Metadata and OG Images Documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js opengraph-image File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Container Queries in 2026 - LogRocket](https://blog.logrocket.com/container-queries-2026/)
- [Responsive Design Best Practices 2026 - PxlPeak](https://pxlpeak.com/blog/web-design/responsive-design-best-practices)
- [Internal Linking Strategy Guide 2026 - IdeaMagix](https://www.ideamagix.com/blog/internal-linking-strategy-seo-guide-2026/)
- [Internal Linking Structure 2026 - ClickRank](https://www.clickrank.ai/effective-internal-linking-structure/)
- Project codebase analysis (package.json, layout.tsx, concepts.ts, 80+ CSS module files)

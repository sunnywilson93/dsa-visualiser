# Phase 12: SEO Standardization - Research

**Researched:** 2026-01-25
**Domain:** Next.js 14 SEO (Metadata, Structured Data, OpenGraph Images)
**Confidence:** HIGH

## Summary

The project already has substantial SEO infrastructure in place. The root layout defines comprehensive static metadata with `metadataBase`, OpenGraph/Twitter configuration, and global JSON-LD schemas. Most dynamic routes already implement `generateMetadata` with proper title, description, and canonical URLs. However, there are gaps in breadcrumb schema coverage, no dynamic OG image generation, and the sitemap uses `new Date()` instead of content-specific timestamps.

The primary work involves: (1) standardizing breadcrumb JSON-LD across all page types, (2) implementing dynamic OG images using Next.js `opengraph-image.tsx` file convention, and (3) enhancing the sitemap with accurate lastmod dates.

**Primary recommendation:** Create a shared breadcrumb utility and extend existing StructuredData pattern to all pages; implement `opengraph-image.tsx` files at route segment level for dynamic OG generation.

## Current State Audit

### Pages with generateMetadata (Complete)

| Route | Has generateMetadata | Has Breadcrumb | Has OG Image |
|-------|---------------------|----------------|--------------|
| `/` (home) | Uses root layout | N/A (home) | Static SVG |
| `/concepts` | In layout.tsx | No | Inherits root |
| `/concepts/[conceptId]` | Yes | Yes | Inherits root |
| `/concepts/js` | Client page, no meta | No | Inherits root |
| `/concepts/dsa` | Client page, no meta | No | Inherits root |
| `/concepts/dsa/[conceptId]` | Yes | Yes | Inherits root |
| `/concepts/dsa/patterns/[patternId]` | Yes | Yes | Inherits root |
| `/[categoryId]` | Yes | No | Inherits root |
| `/[categoryId]/[problemId]` | Yes | No | Inherits root |
| `/[categoryId]/[problemId]/concept` | Yes | No | Inherits root |
| `/js-problems` | Yes | No | Inherits root |
| `/playground/event-loop` | Yes (static) | Yes | Inherits root |

### Gaps Identified

1. **Missing generateMetadata:** `/concepts/js` and `/concepts/dsa` are client components without dedicated metadata
2. **Missing Breadcrumb Schema:** `/[categoryId]/*` routes, `/js-problems`
3. **No Dynamic OG Images:** All pages inherit single static `/og-image.svg`
4. **Sitemap lastmod:** All pages use `new Date()` - no content-specific timestamps
5. **Sitemap coverage:** Missing DSA patterns routes, missing `/concepts/dsa/*` routes

## Standard Stack

### Core (Built-in Next.js 14)

| Feature | Implementation | Purpose | Why Standard |
|---------|---------------|---------|--------------|
| `generateMetadata` | `next/metadata` | Dynamic metadata per route | Official App Router API |
| `opengraph-image.tsx` | File convention | Dynamic OG image generation | Built-in, auto-wired to metadata |
| `ImageResponse` | `next/og` | JSX-to-image rendering | Official API, Vercel Edge optimized |
| `sitemap.ts` | File convention | Dynamic sitemap generation | Official App Router API |
| `metadataBase` | Root layout | Canonical URL base | Required for relative URLs |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `schema-dts` | ^1.1.2 | TypeScript types for JSON-LD | Optional: type-safe structured data |

No additional libraries needed - Next.js 14 provides all SEO functionality natively.

**Installation:**
```bash
# Optional for typed JSON-LD
npm install schema-dts
```

## Architecture Patterns

### Recommended Project Structure

```
src/app/
├── layout.tsx                    # Root metadata, metadataBase, global JSON-LD
├── sitemap.ts                    # Dynamic sitemap with accurate lastmod
├── robots.ts                     # Already exists
├── opengraph-image.tsx           # Default OG image (fallback)
│
├── concepts/
│   ├── layout.tsx                # Section metadata
│   ├── opengraph-image.tsx       # Concepts section OG image
│   ├── [conceptId]/
│   │   ├── page.tsx              # Has generateMetadata
│   │   └── opengraph-image.tsx   # Dynamic per-concept OG
│   └── dsa/
│       ├── page.tsx              # ADD generateMetadata
│       └── patterns/
│           └── [patternId]/
│               ├── page.tsx      # Has generateMetadata
│               └── opengraph-image.tsx  # Dynamic per-pattern OG
│
├── [categoryId]/
│   ├── page.tsx                  # Has generateMetadata, ADD breadcrumb
│   ├── opengraph-image.tsx       # Dynamic per-category OG
│   └── [problemId]/
│       ├── page.tsx              # Has generateMetadata, ADD breadcrumb
│       └── opengraph-image.tsx   # Dynamic per-problem OG
│
└── lib/
    └── seo/
        ├── breadcrumb.ts         # Shared breadcrumb generator
        └── metadata.ts           # Shared metadata utilities
```

### Pattern 1: generateMetadata for Dynamic Routes

**What:** Export async `generateMetadata` function to generate page-specific metadata from route params.

**When to use:** Any route with dynamic segments (`[param]`).

**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ conceptId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conceptId } = await params
  const concept = getConceptById(conceptId)

  if (!concept) {
    return { title: 'Not Found | JS Interview Prep' }
  }

  return {
    title: `${concept.title} - JavaScript Concept | JS Interview Prep`,
    description: concept.description,
    openGraph: {
      title: concept.title,
      description: concept.shortDescription,
      url: `https://jsinterview.dev/concepts/${concept.id}`,
      type: 'article',
    },
    alternates: {
      canonical: `/concepts/${concept.id}`,
    },
  }
}
```

### Pattern 2: Breadcrumb JSON-LD with Shared Utility

**What:** Centralized breadcrumb generator to ensure consistent schema across all pages.

**When to use:** All pages except home page.

**Example:**
```typescript
// src/lib/seo/breadcrumb.ts
const BASE_URL = 'https://jsinterview.dev'

interface BreadcrumbItem {
  name: string
  path?: string // omit for current page (last item)
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path && { item: `${BASE_URL}${item.path}` }),
    })),
  }
}

// Usage in page.tsx
const breadcrumb = generateBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Concepts', path: '/concepts' },
  { name: concept.title }, // Last item - no path
])
```

### Pattern 3: Dynamic OG Images with opengraph-image.tsx

**What:** File-convention based OG image generation using ImageResponse.

**When to use:** Routes that need unique social sharing images (concepts, patterns, problems).

**Example:**
```typescript
// src/app/concepts/dsa/patterns/[patternId]/opengraph-image.tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
import { ImageResponse } from 'next/og'
import { getPatternBySlug } from '@/data/dsaPatterns'

export const alt = 'DSA Pattern Visualization'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ patternId: string }>
}) {
  const { patternId } = await params
  const pattern = getPatternBySlug(patternId)

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        <div style={{ color: '#667eea', fontSize: 24 }}>DSA Pattern</div>
        <div style={{ color: 'white', fontSize: 64, fontWeight: 'bold' }}>
          {pattern?.name || 'Pattern'}
        </div>
        <div style={{ color: '#888', fontSize: 28, marginTop: 20 }}>
          JS Interview Prep
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### Anti-Patterns to Avoid

- **Hardcoding metadataBase in each route:** Define once in root layout
- **Duplicating OG image config:** Use file convention, not metadata.openGraph.images for dynamic routes
- **Missing canonical URLs:** Always set alternates.canonical for SEO
- **Using `new Date()` for lastmod:** Use actual content modification timestamps
- **JSON-LD in head tag:** Place in body with StructuredData component (project already does this correctly)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image generation | Canvas/Sharp-based solution | `next/og` ImageResponse | Built-in, Edge-optimized, JSX syntax |
| Metadata merging | Manual metadata inheritance | `generateMetadata` + parent | Next.js handles hierarchy automatically |
| Social card validation | Manual testing | [Social Share Preview](https://socialsharepreview.com/) | Validates across platforms |
| Schema validation | Manual JSON checking | [Schema Markup Validator](https://validator.schema.org/) | Official Google tool |
| Sitemap generation | Manual XML construction | `sitemap.ts` convention | Handles URL escaping, formatting |

## Common Pitfalls

### Pitfall 1: OG Images Not Updating on Vercel

**What goes wrong:** Dynamic OG images may be cached and not refresh on revalidation.
**Why it happens:** Vercel aggressively caches OG images; `revalidate` config may not trigger image regeneration.
**How to avoid:** Use unique URLs with version/timestamp query params if needed, or accept build-time generation.
**Warning signs:** Social preview shows old content after deployment.

### Pitfall 2: Metadata Template Not Applied to Dynamic Routes

**What goes wrong:** Using `title.template` in page.tsx instead of layout.tsx.
**Why it happens:** Templates only work in layout files, not pages.
**How to avoid:** Define `title: { template: '%s | Site' }` in layout.tsx, use simple title strings in pages.
**Warning signs:** Titles missing site suffix.

### Pitfall 3: XSS in JSON-LD

**What goes wrong:** User-generated content injected into JSON-LD without sanitization.
**Why it happens:** JSON.stringify doesn't escape HTML.
**How to avoid:** Replace `<` with `\u003c` in JSON-LD output or sanitize input data. The project uses static content so this is low risk.
**Warning signs:** Content with angle brackets in titles/descriptions.

### Pitfall 4: Relative URLs Without metadataBase

**What goes wrong:** OpenGraph images, canonical URLs resolve incorrectly.
**Why it happens:** Relative paths need a base URL to resolve.
**How to avoid:** Set `metadataBase: new URL('https://jsinterview.dev')` in root layout (already done in project).
**Warning signs:** Broken OG images, invalid canonical URLs in social previews.

### Pitfall 5: Sitemap with Stale Timestamps

**What goes wrong:** All pages show same lastmod date.
**Why it happens:** Using `new Date()` instead of content-specific dates.
**How to avoid:** Track content modification dates in data files or use git commit timestamps.
**Warning signs:** Google Search Console shows outdated crawl dates.

## Code Examples

### Complete generateMetadata with Parent Access

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { conceptId } = await params
  const concept = getConceptById(conceptId)

  // Access parent images to extend, not replace
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: concept?.title || 'Concept',
    description: concept?.description,
    openGraph: {
      title: concept?.title,
      description: concept?.shortDescription,
      images: [...previousImages], // Extend parent images
    },
  }
}
```

### Enhanced Sitemap with Content Dates

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { concepts } from '@/data/concepts'
import { dsaConcepts } from '@/data/dsaConcepts'
import { dsaPatterns } from '@/data/dsaPatterns'
import { exampleCategories, codeExamples } from '@/data/examples'

// Ideally, track actual lastmod dates in data files
// For static content, use build date or a hardcoded recent date
const CONTENT_LAST_UPDATED = new Date('2026-01-25')

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jsinterview.dev'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/concepts`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/concepts/js`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/concepts/dsa`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/js-problems`, lastModified: CONTENT_LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const conceptPages = concepts.map((concept) => ({
    url: `${baseUrl}/concepts/${concept.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const dsaConceptPages = dsaConcepts.map((concept) => ({
    url: `${baseUrl}/concepts/dsa/${concept.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const patternPages = dsaPatterns.map((pattern) => ({
    url: `${baseUrl}/concepts/dsa/patterns/${pattern.slug}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const categoryPages = exampleCategories.map((category) => ({
    url: `${baseUrl}/${category.id}`,
    lastModified: CONTENT_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const problemPages = codeExamples.map((problem) => {
    const category = exampleCategories.find(
      (cat) => cat.id === problem.category || (cat.id === 'dsa' && problem.category.startsWith('dsa-'))
    )
    const categoryId = category?.id || 'dsa'
    return {
      url: `${baseUrl}/${categoryId}/${problem.id}`,
      lastModified: CONTENT_LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  return [
    ...staticPages,
    ...conceptPages,
    ...dsaConceptPages,
    ...patternPages,
    ...categoryPages,
    ...problemPages,
  ]
}
```

### StructuredData Component Usage

The project already has a `StructuredData` component at `src/components/StructuredData.tsx` that renders JSON-LD in the page body. Continue using this pattern for all structured data.

```typescript
// Usage pattern (already established in project)
import { StructuredData } from '@/components/StructuredData'

export default function Page() {
  const breadcrumbSchema = generateBreadcrumbSchema([...])

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <PageContent />
    </>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next/head` for metadata | `generateMetadata` / `metadata` export | Next.js 13.2+ | Cleaner API, automatic deduplication |
| `viewport` in metadata | Separate `viewport` export | Next.js 14 | Deprecated in metadata object |
| `themeColor` in metadata | Separate `viewport` export | Next.js 14 | Deprecated in metadata object |
| External OG image libraries | `next/og` ImageResponse | Next.js 13+ | Built-in, Edge-optimized |
| Manual sitemap.xml | `sitemap.ts` convention | Next.js 13.3+ | Dynamic generation, type-safe |

**Note on params:** As of Next.js 15, `params` is a Promise that must be awaited. The project uses Next.js 14.2.x, so both sync and async patterns work, but async is forward-compatible.

## Open Questions

1. **Content Timestamps**
   - What we know: Static data files have no modification dates
   - What's unclear: Whether to add lastmod fields to data or use hardcoded date
   - Recommendation: Use a single `CONTENT_LAST_UPDATED` constant, update on each content release

2. **OG Image Styling**
   - What we know: Existing SVG uses gradient background with code visualization
   - What's unclear: Whether dynamic OG should match exact styling
   - Recommendation: Use simplified version of existing design for performance

3. **Client-Only Pages Metadata**
   - What we know: `/concepts/js` and `/concepts/dsa` are client components
   - What's unclear: Convert to server or add layout metadata
   - Recommendation: Extract metadata to layout files or create wrapper server components

## Sources

### Primary (HIGH confidence)
- [Next.js generateMetadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Complete API reference
- [Next.js opengraph-image Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - File convention, ImageResponse API
- [Next.js sitemap.xml Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Dynamic sitemap generation
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Structured data implementation

### Secondary (MEDIUM confidence)
- [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList) - Breadcrumb schema specification
- [Google Rich Results Test](https://search.google.com/test/rich-results) - Validation tool

### Tertiary (LOW confidence)
- Community patterns from Medium articles - Implementation variations

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations use built-in Next.js features
- Architecture: HIGH - Follows official documentation patterns
- Pitfalls: MEDIUM - Based on documented issues and community reports

**Research date:** 2026-01-25
**Valid until:** 2026-04-25 (Next.js stable, patterns unlikely to change)

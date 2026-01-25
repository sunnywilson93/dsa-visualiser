# Architecture Research: Polish & Production

**Project:** DSA Visualiser v1.2 Polish & Production
**Researched:** 2026-01-25
**Overall Confidence:** HIGH (based on codebase analysis and official documentation)

## Executive Summary

This research documents how responsive layouts, SEO metadata, cross-linking, and page consistency integrate with the existing Next.js App Router architecture. The codebase already has foundational patterns in place for each area, making this primarily an enhancement and standardization effort rather than greenfield development.

Key architectural findings:
1. **Responsive CSS** - 57 CSS Module files already contain `@media` queries with consistent breakpoints (1024px tablet, 640px/480px mobile). Integration means extending existing patterns.
2. **SEO Metadata** - Next.js 14 metadata API is already implemented with `generateMetadata`, structured data via `StructuredData` component, and canonical URLs. Integration means standardization.
3. **Cross-linking** - Data layer already supports `relatedProblems` fields in concepts, dsaConcepts, and dsaPatterns. Integration means UI components to surface these links.
4. **Page Consistency** - NavBar component exists with breadcrumb support. Integration means standardizing usage across pattern pages.

---

## Responsive Integration

### Current State Analysis

The codebase uses CSS-first responsive design with CSS Modules. Analysis of existing patterns:

**Breakpoint Strategy (already established):**
```css
/* From NavBar.module.css, page.module.css - consistent across files */
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px)  { /* Smaller tablet */ }
@media (max-width: 640px)  { /* Mobile */ }
@media (max-width: 480px)  { /* Small mobile */ }
```

**Pattern Analysis (57 files with @media):**
- Homepage (`page.module.css`): Full responsive treatment with grid collapse, font scaling
- NavBar: Logo text hiding, search width reduction, nav link hiding on mobile
- Visualization components: Many have responsive queries but coverage varies

### Integration Points

| Component Category | Files | Current Responsive Status | Action Needed |
|-------------------|-------|--------------------------|---------------|
| App Pages | 8 page.module.css files | Partial (homepage complete) | Standardize all |
| NavBar | NavBar.module.css | Complete | None |
| Visualization (Concepts) | 25+ *Viz.module.css | Varies | Audit and standardize |
| DSA Patterns | 3 pattern viz CSS files | Minimal | Add media queries |
| SharedViz | 3 CSS files | Partial | Complete |

### Responsive Strategy

**Approach:** Enhance existing CSS Modules with mobile-first media queries, following established breakpoint pattern.

**Components requiring responsive work:**
1. **Pattern pages** (`TwoPointersViz.module.css`, `HashMapViz.module.css`, `BitManipulationViz.module.css`)
   - Currently desktop-focused layouts
   - Need grid/flex collapse for mobile
   - Code panels need horizontal scroll on small screens

2. **SharedViz components** (`CodePanel.module.css`, `StepControls.module.css`, `StepProgress.module.css`)
   - Used by multiple visualizations
   - Changes here propagate to all users
   - Need careful mobile treatment

3. **Practice pages** (`[problemId]/page.module.css`, `[problemId]/concept/page.module.css`)
   - Split-pane layouts need mobile stacking
   - Code editor needs minimum height on mobile

### Implementation Pattern

Follow the established pattern from `page.module.css`:

```css
/* Desktop-first existing styles */
.container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-xl);
}

/* Tablet */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .container {
    padding: var(--space-lg);
  }
}
```

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/DSAPatterns/TwoPointersViz/TwoPointersViz.module.css` | Add responsive grid collapse, touch targets |
| `src/components/DSAPatterns/HashMapViz/HashMapViz.module.css` | Add responsive grid collapse, bucket viz scaling |
| `src/components/DSAPatterns/BitManipulationViz/BitManipulationViz.module.css` | Add responsive binary grid sizing |
| `src/components/SharedViz/CodePanel.module.css` | Horizontal scroll, reduced font |
| `src/components/SharedViz/StepControls.module.css` | Touch-friendly button sizes |
| `src/app/[categoryId]/[problemId]/page.module.css` | Stack layout on mobile |
| `src/app/concepts/dsa/patterns/[patternId]/page.module.css` | Responsive padding/margins |

### New Components Needed

None. All responsive work is CSS-only modifications to existing component styles.

---

## SEO Integration

### Current State Analysis

The project already has comprehensive SEO implementation:

**Root Layout (`src/app/layout.tsx`):**
- Static metadata with title, description, keywords
- OpenGraph configuration with images
- Twitter card setup
- JSON-LD structured data (WebSite, EducationalOrganization, SoftwareApplication)
- `metadataBase` properly set

**Dynamic Pages:**
- `generateMetadata` function pattern established in:
  - `/concepts/[conceptId]/page.tsx` - Full implementation with FAQ, Breadcrumb, Article schemas
  - `/[categoryId]/page.tsx` - Basic implementation
  - `/concepts/dsa/patterns/[patternId]/page.tsx` - Full implementation with Breadcrumb, Article schemas

**StructuredData Component:**
```typescript
// src/components/StructuredData.tsx - Already exists
// Renders JSON-LD structured data for SEO
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  // Uses script tag with application/ld+json type
  // Safe because data is generated server-side from trusted sources
}
```

### Integration Points

| Page Type | Current Metadata | Current Structured Data | Gap |
|-----------|-----------------|------------------------|-----|
| Home (`/`) | Root layout only | Yes (3 schemas) | Specific home OG image |
| Concept Pages | Full generateMetadata | FAQ + Breadcrumb + Article | None |
| Category Pages | Basic generateMetadata | None | Add structured data |
| Problem Pages | Needs verification | Needs verification | Audit needed |
| Pattern Pages | Full generateMetadata | Breadcrumb + Article | None |
| DSA Concepts | Needs verification | Needs verification | Audit needed |

### SEO Strategy

**Approach:** Standardize metadata across all pages following the established pattern in `/concepts/[conceptId]/page.tsx`.

**Key patterns to follow:**
1. Use `generateMetadata` for all dynamic routes
2. Include `alternates.canonical` for all pages
3. Add `StructuredData` component for Breadcrumb schemas
4. Use FAQ schema where applicable (concepts with key points)

### Implementation Pattern

```typescript
// Standard pattern for dynamic pages
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getDataById(params.id)

  if (!data) {
    return { title: 'Not Found | JS Interview Prep' }
  }

  return {
    title: `${data.title} | JS Interview Prep`,
    description: data.description,
    keywords: `${data.title.toLowerCase()}, javascript, interview`,
    openGraph: {
      title: data.title,
      description: data.shortDescription,
      url: `https://jsinterview.dev/${route}/${data.id}`,
    },
    alternates: {
      canonical: `/${route}/${data.id}`,
    },
  }
}
```

### Files to Modify

| File | Current State | Changes Needed |
|------|---------------|----------------|
| `src/app/[categoryId]/[problemId]/page.tsx` | Verify metadata | Add/standardize generateMetadata, add structured data |
| `src/app/[categoryId]/[problemId]/concept/page.tsx` | Verify metadata | Add/standardize generateMetadata |
| `src/app/concepts/dsa/[conceptId]/page.tsx` | Verify metadata | Add structured data if missing |
| `src/app/js-problems/page.tsx` | Verify metadata | Add generateMetadata |
| `src/app/playground/event-loop/page.tsx` | Verify metadata | Add generateMetadata |

### New Components Needed

None. The existing `StructuredData` component serves all needs.

---

## Cross-Linking Integration

### Current State Analysis

**Data Layer Support (already exists):**

```typescript
// concepts.ts
interface Concept {
  relatedProblems?: string[]  // IDs of problems from examples.ts
}

// dsaConcepts.ts
interface DSAConcept {
  relatedProblems?: string[]  // Links to problem IDs
}

// dsaPatterns.ts
interface DSAPattern {
  relatedProblems?: string[]  // Problem IDs from examples.ts
}
```

**Current Usage:**
- `DSAConceptPageClient.tsx` renders `relatedProblems` as links (lines 229-242)
- Pattern pages do not currently render relatedProblems
- Problem pages do not link back to patterns

**Examples with relatedProblems populated:**
- `dsaPatterns.ts`: All 3 patterns have `relatedProblems` arrays
- `dsaConcepts.ts`: 6 concepts have `relatedProblems` arrays
- `concepts.ts`: 4 concepts have `relatedProblems` arrays

### Integration Points

**Bidirectional Cross-Linking Needed:**

| From | To | Current State | Implementation |
|------|-----|---------------|----------------|
| Pattern Page | Problem Pages | Data exists, UI missing | Add "Practice This Pattern" section |
| Problem Page | Pattern Page | No data, no UI | Reverse lookup + UI |
| DSA Concept | Problems | Data exists, UI exists | None needed |
| JS Concept | Problems | Data exists, UI missing | Add practice section |

### Cross-Linking Strategy

**1. Pattern to Problem (forward direction):**
- Data already in `dsaPatterns[].relatedProblems`
- Add UI component to pattern pages

**2. Problem to Pattern (reverse direction):**
- Need reverse lookup function
- Add UI component to problem concept pages

### Data Flow

```
+------------------+     +------------------+
|  dsaPatterns.ts  |     |   examples.ts    |
|  relatedProblems +---->|   problem IDs    |
+--------+---------+     +--------+---------+
         |                        |
         | forward lookup         | reverse lookup
         v                        v
+------------------+     +------------------+
|  Pattern Page    |     |  Problem Page    |
| "Practice these" |     | "Learn pattern"  |
+------------------+     +------------------+
```

### Implementation Pattern

**New utility functions needed:**

```typescript
// src/data/crossLinks.ts (new file)
import { dsaPatterns } from './dsaPatterns'
import { codeExamples, getExampleById } from './examples'

// Reverse lookup: given problem ID, find pattern(s) that use it
export function getPatternsByProblem(problemId: string): DSAPattern[] {
  return dsaPatterns.filter(pattern =>
    pattern.relatedProblems?.includes(problemId)
  )
}

// Forward lookup: given pattern ID, get problem details
export function getProblemsByPattern(patternId: string): CodeExample[] {
  const pattern = dsaPatterns.find(p => p.id === patternId)
  if (!pattern?.relatedProblems) return []
  return pattern.relatedProblems
    .map(id => getExampleById(id))
    .filter(Boolean) as CodeExample[]
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/data/crossLinks.ts` | Cross-linking utility functions |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/DSAPatterns/TwoPointersViz/TwoPointersViz.tsx` | Add RelatedProblems section |
| `src/components/DSAPatterns/HashMapViz/HashMapViz.tsx` | Add RelatedProblems section |
| `src/components/DSAPatterns/BitManipulationViz/BitManipulationViz.tsx` | Add RelatedProblems section |
| `src/app/[categoryId]/[problemId]/concept/page.tsx` | Add "Learn the Pattern" section |
| `src/app/[categoryId]/[problemId]/ConceptVizPageClient.tsx` | Add pattern link UI |

### New Components Needed

| Component | Purpose |
|-----------|---------|
| `src/components/CrossLinks/RelatedProblems.tsx` | Reusable "Practice these problems" section |
| `src/components/CrossLinks/RelatedPattern.tsx` | Reusable "Learn the pattern" link |

---

## Page Consistency Integration

### Current State Analysis

**NavBar Component:**
- Already supports breadcrumbs via `breadcrumbs` prop
- Consistent styling across site
- Responsive (hides text on mobile)

**Current NavBar Usage:**
```typescript
// Concept pages - full breadcrumbs
<NavBar breadcrumbs={[
  { label: 'Concepts', path: '/concepts' },
  { label: 'DSA', path: '/concepts/dsa' },
  { label: concept.title },
]} />

// Pattern pages - full breadcrumbs
<NavBar breadcrumbs={[
  { label: 'Concepts', path: '/concepts' },
  { label: 'DSA', path: '/concepts/dsa' },
  { label: 'Patterns', path: '/concepts/dsa/patterns' },
  { label: pattern.name },
]} />

// Home page - no breadcrumbs (correct)
<NavBar />
```

**Page Header Patterns:**
- Concept pages: Icon + Title + Difficulty badge + Description
- Pattern pages: Back button + Title row + Description (similar but not identical)
- Problem pages: Different structure

### Integration Points

| Page Type | NavBar | Header Style | Gap |
|-----------|--------|--------------|-----|
| Home | Correct | Custom | None |
| JS Concepts | Correct | Standardized | None |
| DSA Concepts | Correct | Standardized | None |
| Pattern Pages | Correct | Similar to concepts | Minor styling differences |
| Problem Pages | Correct | Different style | Acceptable (different purpose) |

### Consistency Strategy

**Approach:** Pattern pages already follow the concept page pattern closely. Minor CSS adjustments for visual consistency.

**Header pattern to match:**
```typescript
// Standard header pattern
<header className={styles.header}>
  <button className={styles.backBtn} onClick={() => router.push(backPath)}>
    <ArrowLeft size={18} />
    <span>All {categoryName}</span>
  </button>

  <div className={styles.titleRow}>
    <span className={styles.icon}>
      <ConceptIcon conceptId={id} size={32} />
    </span>
    <h1 className={styles.title}>{title}</h1>
    <span className={styles.difficulty}>{difficulty}</span>
  </div>

  <p className={styles.description}>{description}</p>
</header>
```

### Files to Modify

| File | Changes |
|------|---------|
| `src/app/concepts/dsa/patterns/[patternId]/page.module.css` | Align with concept page styles |
| Pattern page client components | Verify consistent header structure |

### New Components Needed

None. Existing components are sufficient.

---

## Suggested Build Order

Based on dependencies and complexity:

### Phase 1: Data Layer (Foundation)

**Order: 1st**
**Reason:** Cross-linking utilities are needed by UI components.

1. Create `src/data/crossLinks.ts`
2. Test utility functions

**Dependencies:** None
**Estimated effort:** Small

### Phase 2: SEO Standardization

**Order: 2nd**
**Reason:** Independent of other features, straightforward audit and fix.

1. Audit all page.tsx files for metadata
2. Add/standardize generateMetadata
3. Add StructuredData where missing
4. Verify canonical URLs

**Dependencies:** None
**Estimated effort:** Medium

### Phase 3: Cross-Linking Components

**Order: 3rd**
**Reason:** Depends on Phase 1 data layer.

1. Create `RelatedProblems.tsx` component
2. Create `RelatedPattern.tsx` component
3. Integrate into pattern pages
4. Integrate into problem concept pages

**Dependencies:** Phase 1 (crossLinks.ts)
**Estimated effort:** Medium

### Phase 4: Page Consistency

**Order: 4th**
**Reason:** Quick CSS fixes, low risk.

1. Audit pattern page headers
2. Align CSS with concept page styles

**Dependencies:** None
**Estimated effort:** Small

### Phase 5: Responsive CSS

**Order: 5th (last)**
**Reason:** Touches many files, highest testing burden. Should happen after content is finalized.

1. Audit all CSS Module files for responsive coverage
2. Add media queries to pattern viz components
3. Update SharedViz components
4. Test on multiple device sizes

**Dependencies:** Phases 1-4 complete (so content is finalized)
**Estimated effort:** Large

### Build Order Summary

| Phase | Focus | Effort | Why This Order |
|-------|-------|--------|----------------|
| 1 | Data Layer | Small | Foundation for cross-links |
| 2 | SEO | Medium | Independent, straightforward |
| 3 | Cross-Links | Medium | Needs Phase 1 |
| 4 | Consistency | Small | Quick wins |
| 5 | Responsive | Large | After content finalized |

---

## Sources

**Official Documentation:**
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - generateMetadata function reference
- [Next.js Metadata Getting Started](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) - Metadata and OG images overview
- [Next.js CSS Getting Started](https://nextjs.org/docs/app/getting-started/css) - CSS Modules and styling options

**Codebase Analysis:**
- Examined 57 CSS Module files with existing responsive patterns
- Reviewed all page.tsx files for metadata implementation
- Analyzed data files (concepts.ts, dsaConcepts.ts, dsaPatterns.ts) for relatedProblems fields
- Traced existing cross-linking UI in DSAConceptPageClient.tsx

**Search References:**
- [Next.js SEO Guide](https://www.digitalapplied.com/blog/nextjs-seo-guide) - SEO best practices
- [Internal Linking Strategy 2026](https://www.ideamagix.com/blog/internal-linking-strategy-seo-guide-2026/) - Cross-linking patterns
- [Next.js Best Practices 2025](https://www.raftlabs.com/blog/building-with-next-js-best-practices-and-benefits-for-performance-first-teams/) - App Router patterns

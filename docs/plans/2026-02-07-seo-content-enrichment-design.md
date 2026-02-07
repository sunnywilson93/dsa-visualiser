# SEO Content Enrichment Design

## Problem

Google Search Console data (3 months, as of Feb 2026):
- 115 impressions, 0 clicks, average position 38.8
- 29 pages indexed out of ~137 in sitemap
- Top queries: "critical rendering path" (13 imp), "this keyword in javascript" (4), "event loop javascript" (1)
- All pages rank on page 4+ — Google sees the site but doesn't consider it authoritative enough for page 1

Root cause: concept pages are visualization-heavy with minimal crawlable text. Competitors ranking for the same queries have 1000+ word articles.

## Solution

Add a prose "Understanding [Title]" section to concept pages, placed between the Interactive Visualization and Key Points sections. Content is stored as an `explanation` field on the `Concept` type in `concepts.ts`.

## Target Pages (by Search Console impressions)

1. **critical-render-path** — 36 impressions, position 53.6
2. **this-keyword** — 16 impressions, position 32.2
3. **promise-polyfills** (category page) — 15 impressions, position 17.7
4. **event-loop** — 9 impressions, position 36.7
5. **prototypes** — 3 impressions, position 39.0
6. **closures** — 1 impression, position (high-value interview query)

## Implementation

- Added `explanation?: string` to `Concept` interface
- Content stored as plain text with `\n\n` paragraph breaks
- Rendered as `<p>` tags with `leading-[1.8]` for readability
- `<h2>Understanding {concept.title}</h2>` for SEO heading weight
- Optional field — concepts without explanations unchanged

## Files Changed

- `src/data/concepts.ts` — type + 5 concept explanations
- `src/app/concepts/js/[conceptId]/ConceptPageClient.tsx` — rendering section

## Next Steps

- Monitor Search Console for position improvements (2-4 weeks)
- Add explanations to remaining high-value concepts
- Consider enriching DSA concept pages with same pattern

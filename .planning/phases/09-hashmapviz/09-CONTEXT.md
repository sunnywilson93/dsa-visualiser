# Phase 9: HashMapViz - Context

**Gathered:** 2026-01-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Step-through visualization of Hash Map pattern showing bucket mechanism, key-value relationships, and common operations (lookup, insert, frequency counting). Users can see how keys hash to buckets and watch operations unfold step by step.

</domain>

<decisions>
## Implementation Decisions

### Bucket Visualization
- Grid layout with indices (compact, expandable entries)
- 8-10 buckets shown (medium size, realistic without overwhelming)
- Simplified collision handling (no collisions in visualization)
- Each entry shows: key, value, and original index (for index-tracking problems)
- Lookup highlighting: both glow effect AND arrow pointing to bucket

### Operation Animations
- Detailed steps (3-4 per operation): Read key → Calculate hash → Access bucket → Return/set value
- Decision panel same pattern as TwoPointersViz ("Is key in map? No → Insert new entry")
- Frequency counter updates: animate number change AND flash the entry
- Animated lookup path showing key → hash → bucket → value flow

### Example Selection
- Problem types: Two Sum, Frequency Counter, Valid Anagram, Group Anagrams
- Variant tabs by pattern type: Complement Lookup | Frequency Counter | Index Storage
- Difficulty distribution:
  - Beginner: Two Sum + basic frequency counter
  - Intermediate: Valid Anagram
  - Advanced: Group Anagrams
- Target: 5-6 examples total (similar to TwoPointersViz)

### Hash Function Display
- Show step-by-step hash calculation (educational, not abstracted)
- Educational formula: sum of character codes % bucket count
- Hash calculation appears inline with the animated arrow/path
- Full breakdown for short keys (under 5 chars), abbreviated for longer

### Claude's Discretion
- Empty bucket visibility (show all vs hide unused)
- Visual distinction between insert/lookup operations (colors or labels)
- Map size/count indicator (if educationally valuable)

</decisions>

<specifics>
## Specific Ideas

- Hash calculation should feel "aha!" - learners understand why keys map to specific buckets
- Visual path from key → hash → bucket → value should be traceable at a glance
- Frequency counter increment should feel satisfying (animation + glow)
- Match TwoPointersViz patterns: SharedViz components, variant tabs, difficulty levels

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-hashmapviz*
*Context gathered: 2026-01-25*

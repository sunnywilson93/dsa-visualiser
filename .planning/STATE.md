# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-31)

**Core value:** Learners can step through code execution visually, seeing exactly how algorithms and JavaScript work under the hood
**Current focus:** v4.0 Design Token Consistency - Replace 700+ hardcoded colors with @theme tokens

## Current Position

Milestone: v4.0
Phase: 22 - Foundation & Audit (3 of 3 plans complete)
Plan: 03 complete
Status: Phase complete
Last activity: 2026-01-31 -- Completed 22-03-PLAN.md

Progress: [###_______] 3/13 plans (23.1%)

## v4.0 Overview

| Phase | Name | Requirements | Plans | Status |
|-------|------|--------------|-------|--------|
| 22 | Foundation & Audit | INFRA-01..04, MIG-04 (5) | 3 | Complete |
| 23 | Level Indicators Migration | MIG-01 (1) | 3 | Planned |
| 24 | Phase/Status Colors Migration | MIG-02 (1) | 2 | Planned |
| 25 | Animation Colors Handling | ANIM-01..03 (3) | 2 | Planned |
| 26 | Inline Styles Cleanup | MIG-03, QUAL-01..03 (4) | 3 | Planned |

**Quality requirements (all phases):** QUAL-01..03

## Performance Metrics

**Previous milestones (v1.0-v3.0):**
- Total plans completed: 57
- Phases completed: 20
- Average duration: ~5.5 min per plan

**v4.0 (current):**
- Total plans: 13
- Plans completed: 3
- Average duration: 7 min (3 samples: 5 min + 7 min + 8 min)

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Decision | Choice | Source |
|----------|--------|--------|
| No new libraries needed | Existing @theme + TypeScript sufficient | v4.0 research |
| Shared modules before migration | Create levelInfo, phaseColors, statusColors first | v4.0 research |
| Animation hex constants separate | Framer Motion cannot interpolate CSS vars | v4.0 research |
| Pre-define opacity variants | ${color}15 pattern breaks with CSS vars | v4.0 research |
| Visual regression per batch | Verify parity after each migration batch | v4.0 research |
| Level bg uses 15% opacity | var(--color-{color}-15) for backgrounds | 22-01 |
| Level border uses 40% opacity | var(--color-{color}-40) for borders | 22-01 |
| Single Phase union type | Exhaustive union covering all 100+ phases from 20 viz components | 22-02 |
| Separated status subtypes | HoistingStatus, VariableState, StackFrameStatus, ThreadStatus combined into VariableStatus | 22-02 |
| Status opacity variants included | STATUS_BG_COLORS (15%) and STATUS_BORDER_COLORS (40%) for badges | 22-02 |
| Barrel export type/value separation | Type exports separate from value exports for tree-shaking | 22-03 |

### Critical Pitfalls (from research)

1. **Framer Motion cannot interpolate CSS vars** - Use hex constants for animations
2. **Dynamic opacity suffix breaks** - ${color}15 invalid with CSS vars, pre-define variants
3. **Visual parity verification** - Wrong token shade selection breaks appearance
4. **CSS var whitespace** - getPropertyValue() may include leading space, use trim()
5. **Semantic token ambiguity** - Multiple similar tokens, need decision authority

### Pending Todos

None.

### Blockers/Concerns

**Research flags (from SUMMARY.md):**
- Phase 25: Framer Motion behavior needs hands-on testing for edge cases

## Session Continuity

Last session: 2026-01-31T13:24:42Z
Stopped at: Completed 22-03-PLAN.md (Phase 22 complete)
Resume file: None
Next action: Begin Phase 23 - Level Indicators Migration

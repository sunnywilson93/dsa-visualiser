# Project Research Summary

**Project:** DSA Visualiser - Design Token Consistency (v4.0)
**Domain:** Design system refactoring - color token migration
**Researched:** 2026-01-31
**Confidence:** HIGH

## Executive Summary

This is a refactoring task to eliminate 700+ hardcoded hex colors across 56 visualization components by migrating to CSS custom properties already defined in the codebase. The existing Tailwind v4 setup provides 130+ design tokens in the @theme block, but components bypass them with inline `style={{ color: '#10b981' }}` patterns. The solution is not adding new libraries but creating TypeScript modules that reference existing CSS variables and extracting shared color objects (levelInfo, phaseColors) into reusable constants.

The critical technical challenge is Framer Motion's inability to interpolate CSS variables in animations. Components extensively use `animate={{ color: '#10b981' }}` patterns that will break if naively migrated to `var(--color-emerald-500)`. The mitigation strategy requires maintaining animation-specific hex constants while using CSS variables for static styles. Additionally, 70+ instances of dynamic opacity suffix patterns (`${color}15`) must be replaced with pre-defined opacity variants in the @theme block.

Key risks are visual parity drift (migrating to wrong token shades), animation breakage (CSS vars in Framer Motion), and maintenance overhead if shared patterns aren't extracted. Success requires visual regression testing per batch, establishing clear token selection guidelines, and creating reusable modules before touching individual components. Estimated effort: 15-25 hours across 5 phases.

## Key Findings

### Recommended Stack

**NO new libraries needed.** The existing stack (Tailwind v4 + TypeScript + React) provides everything required. This is purely refactoring work.

**Core technologies (already in use):**
- **Tailwind CSS v4.1.18**: Provides @theme directive with 130+ tokens already defined in globals.css
- **TypeScript ~5.5.0**: Type safety for color constant modules
- **React ^18.3.1**: Component framework (no changes needed)
- **Framer Motion**: Animation library (requires special handling for color animations)

**Evaluated and rejected:**
- vanilla-extract: Overkill, requires build pipeline changes
- Style Dictionary: Design tool sync not needed
- Stitches/Theme UI: CSS-in-JS contradicts Tailwind approach
- CSS Modules typed: Already phasing out CSS Modules

**Implementation pattern:**
Create TypeScript constants modules (`src/constants/colors.ts`, `src/constants/levelInfo.ts`) that export CSS variable references like `'var(--color-emerald-500)'` with type safety. Components import shared objects instead of defining inline.

### Expected Features

**Must have (table stakes):**
- Semantic token layer: Maps purpose to color (--color-difficulty-beginner not raw hex)
- Single source of truth: All colors defined once in @theme, referenced everywhere
- Consistent naming convention: --color-[category]-[concept]-[variant] format
- Difficulty level tokens: Beginner/intermediate/advanced color system
- Phase/state tokens: Creation/Execution/Return semantic colors
- Documentation: Clear comments on when to use each token
- Tailwind v4 @theme integration: Already in place, maintain pattern

**Should have (differentiators):**
- TypeScript token constants: Autocomplete for inline styles
- Dark/light mode preparation: Semantic names that support theming
- Opacity scale tokens: Complete -10, -20, -30 pattern for all colors
- Gradient utility classes: Reduce inline gradient verbosity
- ESLint rule for hardcoded colors: Prevent regression post-migration

**Defer (v2+):**
- Component-scoped token overrides: Only 1 component uses this pattern
- Animation timing tokens: Some exist, low priority to extend
- Token usage heatmap: Nice for cleanup, not blocking
- Runtime token switching: CSS variables already support this

**Anti-features (deliberately avoid):**
- Component-level token definitions: Creates 672+ token maintenance burden
- Token transformation pipeline: Style Dictionary adds build complexity for no benefit
- Design token JSON/YAML source: Adds translation step and potential drift
- Per-component CSS modules for tokens: Fragments the system
- Runtime token switching via React context: CSS custom properties already handle this
- Token versioning/deprecation system: Over-engineering for 56-component scope

### Architecture Approach

Migration follows a 2-tier token architecture: primitives (--color-emerald-500) plus semantic aliases (--color-level-beginner). Create shared TypeScript modules in `src/constants/` that export color objects referencing CSS vars, then migrate components in batches with visual verification between each batch.

**Major components:**
1. **Shared token constants** (`src/constants/colors.ts`) - CSS var references grouped by semantic category (level, phase, status)
2. **Level configuration** (`src/constants/levelInfo.ts`) - Standardizes the 39-file levelInfo object pattern with typed beginner/intermediate/advanced config
3. **Phase colors** (`src/constants/phaseColors.ts`) - Centralizes Creation/Execution/Return color mappings used in 21 files
4. **Status colors** (`src/constants/statusColors.ts`) - Hoisted/initialized/TDZ state colors

**File structure:**
```
src/
  constants/
    colors.ts           # CSS var references, semantic groupings
    levelInfo.ts        # Shared level configuration
    phaseColors.ts      # Execution phase colors
    statusColors.ts     # Variable state colors
    index.ts            # Barrel export
  styles/
    globals.css         # @theme block (existing, minimal changes)
```

**Critical patterns identified:**
- 39 files duplicate identical levelInfo objects with #10b981, #f59e0b, #ef4444
- 21 files define getPhaseColor functions returning hardcoded hex
- 70+ instances of opacity suffix pattern `${color}15` that breaks with CSS vars
- 18 Framer Motion animate props using hex colors that cannot migrate to CSS variables
- Component-scoped `--js-viz-*` variables in 14 files need preservation

### Critical Pitfalls

1. **Framer Motion Cannot Interpolate CSS Variables** - 18 components use `animate={{ color: '#10b981' }}` patterns. If migrated to CSS variables, animations break with "not an animatable value" errors. **Solution:** Maintain animation-specific hex constants (src/constants/animationColors.ts) while using CSS vars for static styles.

2. **Dynamic Opacity Suffix Pattern Breaks** - 70+ instances of `${color}15` to append hex opacity suffixes. After migration, `var(--color-emerald-500)15` is invalid CSS. **Solution:** Pre-define all opacity variants in @theme block (--color-emerald-15, --color-emerald-20, --color-emerald-40) before migration.

3. **Visual Parity Verification Without Regression Tests** - Hardcoded #10b981 may map to --color-emerald-500 (#10b981) OR --color-accent-green (#34d399), different shades. Wrong choice breaks visual parity. **Solution:** Build color audit tool before migration, establish canonical mapping document, run visual regression tests per batch.

4. **CSS Variable Whitespace Breaks Framer Motion Parsing** - Even static styles fail if CSS defines `--color-green: #1be958` with space after colon; getPropertyValue() returns leading whitespace causing parse failures. **Solution:** Audit globals.css for consistent formatting, use trim() when reading vars programmatically.

5. **Semantic Token Ambiguity** - Multiple tokens with similar values (--color-accent-red, --color-red-500, --difficulty-hard) create decision paralysis. **Solution:** Document token selection decision tree upfront; assign authority to prevent bike-shedding.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Audit
**Rationale:** Must establish infrastructure and create authoritative mappings before touching components. Sets up visual regression testing and prevents thrashing.
**Delivers:**
- Color audit mapping all hardcoded hex to target tokens
- Shared constants modules (colors.ts, levelInfo.ts, phaseColors.ts, statusColors.ts)
- Visual regression baseline screenshots
- Token selection decision tree documentation
- Opacity variant definitions in @theme block
**Addresses:** Table stakes (semantic token layer, naming convention, single source of truth)
**Avoids:** Pitfalls #2, #3, #5 (opacity suffix, visual parity, ambiguity)
**Research flags:** No deeper research needed - patterns established

### Phase 2: Level Indicators Migration
**Rationale:** Highest duplication (39 files with identical levelInfo pattern), well-defined scope, low risk once shared module exists. Early win builds confidence.
**Delivers:**
- 39 components migrated from inline levelInfo to shared import
- Beginner/intermediate/advanced colors centralized
- Visual parity verified via regression tests
**Addresses:** Difficulty level tokens (table stakes)
**Avoids:** Pitfall #3 (visual drift) via batch testing
**Research flags:** Standard pattern - no research needed

### Phase 3: Phase & Status Colors Migration
**Rationale:** Second-highest duplication (21 files with getPhaseColor, ~10 with getStatusColor). Similar pattern to Phase 2 but depends on establishing shared module conventions.
**Delivers:**
- Phase colors (Creation/Execution/Return) centralized
- Status colors (hoisted/initialized/TDZ) centralized
- Reduced code duplication across execution visualizations
**Addresses:** Phase/state tokens (table stakes)
**Uses:** Shared constants pattern from Phase 1
**Research flags:** No research needed - established pattern

### Phase 4: Framer Motion Animation Colors
**Rationale:** Highest technical risk - must handle Framer Motion's CSS variable limitation carefully. Depends on having static styles already migrated to validate approach.
**Delivers:**
- Animation-specific hex constants (animationColors.ts)
- 18 components with Framer Motion animations handled correctly
- Pattern documented for future animated components
**Addresses:** ESLint rule for hardcoded colors (differentiator)
**Avoids:** Pitfalls #1, #4, #6 (Framer Motion interpolation, whitespace, performance)
**Research flags:** Need validation testing - Framer Motion behavior can be subtle

### Phase 5: Inline Styles Audit & Cleanup
**Rationale:** Catches remaining hardcoded colors not in shared patterns. Final validation ensures no hex values remain.
**Delivers:**
- All 147 inline style instances audited
- Gradient token system for repeated gradient patterns
- ESLint rule configured to prevent regression
- Documentation of token usage patterns
**Addresses:** Gradient token system (table stakes), documentation (table stakes)
**Avoids:** Pitfall #10 (stale tokens) via exhaustive audit
**Research flags:** No research needed - cleanup phase

### Phase Ordering Rationale

- **Foundation first:** Cannot migrate without shared modules, visual regression setup, and token mapping. Trying to migrate components without this creates rework.
- **High-duplication patterns next:** levelInfo (39 files) and phaseColors (21 files) provide maximum impact for effort. Establishes shared module import pattern.
- **High-risk patterns later:** Framer Motion animations (Phase 4) deferred until static migration patterns validated. Lower risk of breaking working code.
- **Audit last:** Final sweep catches edge cases and validates completeness. ESLint rule prevents regression.

**Dependencies:**
```
Phase 1 (Foundation)
  |
  +---> Phase 2 (Level Indicators) - uses shared modules
  +---> Phase 3 (Phase/Status) - uses shared modules
  |
  +---> Phase 4 (Framer Motion) - depends on static patterns working
  |
  +---> Phase 5 (Audit) - validates all previous phases complete
```

### Research Flags

**Phases needing validation during execution:**
- **Phase 4 (Framer Motion):** Animation interpolation edge cases need hands-on testing. Framer Motion behavior with CSS variables has known quirks (GitHub issues #1652, #2390, #546).

**Phases with standard patterns (no research needed):**
- **Phase 1:** File structure and token patterns well-established
- **Phase 2:** Simple find/replace with shared imports
- **Phase 3:** Identical pattern to Phase 2
- **Phase 5:** Grep-based audit, mechanical cleanup

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No new libraries needed; existing @theme provides all tokens |
| Features | HIGH | Clear table stakes (semantic tokens, single source of truth) vs nice-to-haves (TypeScript constants, ESLint rules) |
| Architecture | HIGH | Codebase analyzed directly; shared module pattern established in 14 components already |
| Pitfalls | HIGH | Verified via Framer Motion GitHub issues, 70+ opacity suffix instances grepped, animation color patterns counted |

**Overall confidence:** HIGH

### Gaps to Address

- **Token value drift:** Current audit tool (npm run tokens:audit) exists but mapping document not yet created. Need authoritative "this hex maps to this token" before Phase 2 starts.

- **Visual regression tooling:** npm run test:visual exists but baseline screenshots not captured. Must run before any migration work to establish ground truth.

- **Framer Motion animation test coverage:** Need to identify ALL 18 animated components and create test suite validating smooth interpolation. Current testing likely focuses on functionality, not animation smoothness.

- **Opacity variant completeness:** globals.css has some opacity variants (-10, -20, -30) but not for all colors. Phase 1 must audit which combinations are actually used and define missing variants.

- **Dark mode assumptions:** Current tokens assume dark theme. If light mode planned for future, semantic token selection (bg-primary vs bg-secondary) matters. Clarify theming roadmap before migration.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** - Direct inspection of 56 visualization components, globals.css @theme block (130+ tokens), grep analysis (402 occurrences of #10b981/#f59e0b/#ef4444)
- **Tailwind CSS v4 docs** - Official @theme directive documentation, CSS-first configuration
- **Framer Motion GitHub issues** - #1652 (CSS variable animation fails), #2390 (drag functionality fails), #546 (whitespace parsing bug)

### Secondary (MEDIUM confidence)
- [Type-Safe Design Tokens in Tailwind 4](https://dev.to/wearethreebears/exploring-typesafe-design-tokens-in-tailwind-4-372d) - TypeScript pattern validation
- [UXPin: Design Tokens in React](https://www.uxpin.com/studio/blog/what-are-design-tokens-in-react/) - Semantic token architecture
- [GitLab Pajamas: Design tokens overview](https://design.gitlab.com/product-foundations/design-tokens/) - Multi-tier token systems
- [Crafting a semantic colour system](https://www.fourzerothree.in/p/crafting-a-semantic-colour-system) - Semantic naming conventions

### Tertiary (LOW confidence)
- [Medium: Component-level Design Tokens](https://medium.com/@NateBaldwin/component-level-design-tokens-are-they-worth-it-d1ae4c6b19d4) - Anti-pattern validation (confirms avoiding component-scoped tokens)
- [The Design System Guide](https://thedesignsystem.guide/design-tokens) - General token best practices

---
*Research completed: 2026-01-31*
*Ready for roadmap: yes*

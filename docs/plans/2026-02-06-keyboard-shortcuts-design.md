# Keyboard Shortcuts System Design

**Date**: 2026-02-06
**Status**: Approved, ready for implementation

## Problem

Keyboard shortcut handling is fragmented across the codebase:

- **ExecutionBar** (practice pages): Space, Arrow keys, Escape — inline `addEventListener`
- **ConceptPanel** (DSA patterns): Shift+Arrow keys — different convention, inline handler
- **NodeEventLoopViz**: Arrow keys + R — one-off implementation
- **~50 concept visualizations**: Zero keyboard support — mouse-only via StepControls
- **GlobalSearch**: Cmd/Ctrl+K — separate inline handler

This creates an inconsistent UX and makes shortcuts undiscoverable.

## Solution

A unified keyboard shortcut system with three layers:

### Layer 1: `useKeyboardShortcuts` Hook

Central hook that accepts a shortcut map and registers a single global listener.

**File**: `src/hooks/useKeyboardShortcuts.ts`

```typescript
type ShortcutMap = Record<string, {
  action: () => void
  description: string
  when?: () => boolean
}>

function useKeyboardShortcuts(shortcuts: ShortcutMap): void
```

**Key format**: `"Space"`, `"ArrowRight"`, `"Shift+ArrowRight"`, `"Mod+k"` (Mod = Cmd on Mac, Ctrl elsewhere)

**Guard logic**:
- Auto-skips when focus is in `<input>`, `<textarea>`, or Monaco's `.monaco-editor`
- Optional per-shortcut `when` guard for conditional activation

### Layer 2: Shortcut Registry Store

A small Zustand store that collects all registered shortcuts for the overlay.

**File**: `src/hooks/useShortcutRegistry.ts`

Components register their shortcuts on mount. The overlay reads from this store to show context-aware help.

### Layer 3: ShortcutOverlay Component

Press `?` to toggle a help modal showing all active shortcuts.

**File**: `src/components/ShortcutOverlay/ShortcutOverlay.tsx`

**Design**:
- Centered modal with semi-transparent backdrop
- 2-column grid grouped by context (Navigation, Playback, Editor, Global)
- `<kbd>` styled keys on left, descriptions on right
- Framer Motion fade + scale animation
- Close with `?` or `Escape`
- Styled with cyberpunk theme (brand-primary accent border glow)

## Unified Shortcut Map

### All Step-Based Views (concept vizs + practice pages)

| Key | Action | Notes |
|-----|--------|-------|
| `Space` | Play/Pause (or Start if idle) | |
| `ArrowRight` | Step forward | |
| `ArrowLeft` | Step backward | |
| `Escape` | Reset | |

### Practice Pages Only (interpreter)

| Key | Action | Notes |
|-----|--------|-------|
| `E` | Run to end / completion | |
| `B` | Toggle breakpoint on current line | Only when running |
| `1` | Speed: 0.5x (slow) | |
| `2` | Speed: 1x (medium) | |
| `3` | Speed: 2x (fast) | |
| `F` | Focus code editor | |

### Global

| Key | Action | Notes |
|-----|--------|-------|
| `Cmd/Ctrl+K` | Focus search | Already exists |
| `?` | Toggle shortcuts help | New |

## Integration Points

### StepControls (high-leverage)

Add `useKeyboardShortcuts` inside `StepControls.tsx`. Since ~50 concept visualizations use this component, they all get keyboard support with zero individual changes.

### ExecutionBar (refactor)

Replace the inline `handleKeyDown` (lines 60-92) with the hook. Add new power-user shortcuts (E, B, 1/2/3, F).

### Cleanup (remove duplicates)

- Delete inline handler from `ConceptPanel.tsx` (lines 69-86)
- Delete inline handler from `NodeEventLoopViz.tsx` (lines 660-677)
- These are replaced by StepControls having keyboard support

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/hooks/useKeyboardShortcuts.ts` | Central shortcut hook |
| Create | `src/hooks/useShortcutRegistry.ts` | Registry store for overlay |
| Create | `src/hooks/index.ts` | Barrel export |
| Create | `src/components/ShortcutOverlay/ShortcutOverlay.tsx` | Help modal |
| Create | `src/components/ShortcutOverlay/ShortcutOverlay.module.css` | Styles |
| Modify | `src/components/SharedViz/StepControls.tsx` | Add keyboard support via hook |
| Modify | `src/components/ExecutionBar/ExecutionBar.tsx` | Replace inline handler, add new shortcuts |
| Modify | `src/components/ConceptPanel/ConceptPanel.tsx` | Remove duplicate handler |
| Modify | `src/components/Concepts/NodeEventLoopViz.tsx` | Remove duplicate handler |
| Modify | Layout wrapper | Mount ShortcutOverlay + `?` global shortcut |

## Design Decisions

1. **Why a centralized hook instead of per-component listeners?**
   - Prevents shortcut conflicts when multiple components are mounted
   - Single source of truth for guard logic (input skipping)
   - Registry enables discoverable overlay

2. **Why put keyboard support in StepControls rather than each viz?**
   - 50+ components use StepControls — one change, universal coverage
   - Avoids 50 individual file edits
   - Consistent behavior guaranteed

3. **Why Arrows without Shift for concept vizs?**
   - ConceptPanel used Shift+Arrows, but this conflicts with text selection expectations
   - ExecutionBar already uses plain Arrows — unifying on plain Arrows is more intuitive
   - Guard logic prevents conflicts with input fields

4. **Why a Zustand registry instead of React Context?**
   - Matches existing state management pattern (executionStore, panelStore)
   - Mount/unmount registration is simpler with Zustand's `subscribe`
   - No provider wrapping needed

## Edge Cases

- **Monaco editor active**: Guard skips all shortcuts when Monaco has focus (user is typing code)
- **Multiple StepControls mounted**: Shouldn't happen by routing, but `when` guards provide safety
- **Speed keys (1/2/3) in concept vizs**: Only registered by ExecutionBar on practice pages — no conflict

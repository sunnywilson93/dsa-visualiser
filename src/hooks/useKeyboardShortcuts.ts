import { useEffect, useRef, useId } from 'react'
import { useShortcutRegistry } from './useShortcutRegistry'

export interface ShortcutConfig {
  action: () => void
  description: string
  group?: string
  when?: () => boolean
}

export type ShortcutMap = Record<string, ShortcutConfig>

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

function isInputFocused(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true
  if (target.closest('.monaco-editor')) return true
  if (target.isContentEditable) return true
  return false
}

/**
 * Parse a key string like "Mod+k", "Shift+ArrowRight", "Space" into
 * a normalized form for matching against KeyboardEvents.
 */
function parseKey(keyStr: string) {
  const parts = keyStr.split('+')
  const key = parts.pop()!
  const modifiers = {
    ctrl: false,
    meta: false,
    shift: false,
    alt: false,
  }

  for (const mod of parts) {
    const lower = mod.toLowerCase()
    if (lower === 'mod') {
      if (isMac) modifiers.meta = true
      else modifiers.ctrl = true
    } else if (lower === 'ctrl') modifiers.ctrl = true
    else if (lower === 'meta' || lower === 'cmd') modifiers.meta = true
    else if (lower === 'shift') modifiers.shift = true
    else if (lower === 'alt') modifiers.alt = true
  }

  return { key, modifiers }
}

function matchesEvent(parsed: ReturnType<typeof parseKey>, e: KeyboardEvent): boolean {
  const eventKey = e.key === ' ' ? 'Space' : e.key

  if (eventKey.toLowerCase() !== parsed.key.toLowerCase()) return false
  if (e.ctrlKey !== parsed.modifiers.ctrl) return false
  if (e.metaKey !== parsed.modifiers.meta) return false
  if (e.shiftKey !== parsed.modifiers.shift) return false
  if (e.altKey !== parsed.modifiers.alt) return false

  return true
}

/** Format a key string for display (e.g. "Mod+k" → "⌘K" on Mac) */
export function formatKey(keyStr: string): string {
  return keyStr
    .replace(/Mod\+/i, isMac ? '\u2318' : 'Ctrl+')
    .replace(/Shift\+/i, isMac ? '\u21E7' : 'Shift+')
    .replace(/Alt\+/i, isMac ? '\u2325' : 'Alt+')
    .replace(/Ctrl\+/i, isMac ? '\u2303' : 'Ctrl+')
    .replace('ArrowRight', '\u2192')
    .replace('ArrowLeft', '\u2190')
    .replace('ArrowUp', '\u2191')
    .replace('ArrowDown', '\u2193')
    .replace('Escape', 'Esc')
    .replace('Space', 'Space')
}

/**
 * Centralized keyboard shortcut hook.
 *
 * Registers shortcuts with the global registry (for the help overlay)
 * and attaches a single keydown listener with guard logic.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap): void {
  const hookId = useId()
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  const register = useShortcutRegistry((s) => s.register)
  const unregister = useShortcutRegistry((s) => s.unregister)

  // Register all shortcuts with the overlay registry
  useEffect(() => {
    const entries = Object.entries(shortcutsRef.current)
    const ids: string[] = []

    for (const [key, config] of entries) {
      const id = `${hookId}-${key}`
      ids.push(id)
      register(id, {
        key,
        description: config.description,
        group: config.group ?? 'General',
      })
    }

    return () => {
      for (const id of ids) unregister(id)
    }
  }, [hookId, register, unregister])

  // Attach global keydown listener
  useEffect(() => {
    const parsed = Object.entries(shortcutsRef.current).map(([key, config]) => ({
      parsed: parseKey(key),
      config,
    }))

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused(e.target)) return

      for (const { parsed: p, config } of parsed) {
        if (matchesEvent(p, e)) {
          if (config.when && !config.when()) continue
          e.preventDefault()
          config.action()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

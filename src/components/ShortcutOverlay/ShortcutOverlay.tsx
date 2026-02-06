'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShortcutRegistry, formatKey } from '@/hooks'
import type { RegisteredShortcut } from '@/hooks'
import styles from './ShortcutOverlay.module.css'

/** Group order for display */
const GROUP_ORDER = ['Navigation', 'Playback', 'Editor', 'Global', 'General']

function groupShortcuts(shortcuts: Map<string, RegisteredShortcut>) {
  const groups = new Map<string, RegisteredShortcut[]>()

  // Deduplicate by key (multiple components may register the same key)
  const seen = new Map<string, RegisteredShortcut>()
  for (const shortcut of shortcuts.values()) {
    if (!seen.has(shortcut.key)) {
      seen.set(shortcut.key, shortcut)
    }
  }

  for (const shortcut of seen.values()) {
    const group = shortcut.group
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(shortcut)
  }

  // Sort groups by predefined order
  const sorted = new Map<string, RegisteredShortcut[]>()
  for (const name of GROUP_ORDER) {
    if (groups.has(name)) sorted.set(name, groups.get(name)!)
  }
  // Append any remaining groups
  for (const [name, items] of groups) {
    if (!sorted.has(name)) sorted.set(name, items)
  }

  return sorted
}

export function ShortcutOverlay() {
  const isOpen = useShortcutRegistry((s) => s.isOverlayOpen)
  const closeOverlay = useShortcutRegistry((s) => s.closeOverlay)
  const toggleOverlay = useShortcutRegistry((s) => s.toggleOverlay)
  const shortcuts = useShortcutRegistry((s) => s.shortcuts)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.target instanceof HTMLElement && e.target.closest('.monaco-editor')) return

      if (e.key === '?') {
        e.preventDefault()
        toggleOverlay()
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        closeOverlay()
      }
    },
    [isOpen, toggleOverlay, closeOverlay]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const grouped = groupShortcuts(shortcuts)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={closeOverlay}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Keyboard Shortcuts</h2>
              <span className={styles.closeHint}>
                Press <kbd className={styles.kbd}>?</kbd> or <kbd className={styles.kbd}>Esc</kbd> to close
              </span>
            </div>

            <div className={styles.groups}>
              {Array.from(grouped.entries()).map(([group, items]) => (
                <div key={group} className={styles.group}>
                  <h3 className={styles.groupTitle}>{group}</h3>
                  <div className={styles.shortcutList}>
                    {items.map((item) => (
                      <div key={item.key} className={styles.shortcutItem}>
                        <kbd className={styles.kbd}>{formatKey(item.key)}</kbd>
                        <span className={styles.description}>{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Always show the global ? shortcut */}
              <div className={styles.group}>
                <h3 className={styles.groupTitle}>Global</h3>
                <div className={styles.shortcutList}>
                  <div className={styles.shortcutItem}>
                    <kbd className={styles.kbd}>?</kbd>
                    <span className={styles.description}>Toggle this overlay</span>
                  </div>
                  <div className={styles.shortcutItem}>
                    <kbd className={styles.kbd}>{formatKey('Mod+k')}</kbd>
                    <span className={styles.description}>Search</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

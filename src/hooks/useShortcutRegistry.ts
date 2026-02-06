import { create } from 'zustand'

export interface RegisteredShortcut {
  key: string
  description: string
  group: string
}

interface ShortcutRegistryState {
  shortcuts: Map<string, RegisteredShortcut>
  isOverlayOpen: boolean
  register: (id: string, shortcut: RegisteredShortcut) => void
  unregister: (id: string) => void
  toggleOverlay: () => void
  closeOverlay: () => void
}

export const useShortcutRegistry = create<ShortcutRegistryState>((set) => ({
  shortcuts: new Map(),
  isOverlayOpen: false,

  register: (id, shortcut) =>
    set((state) => {
      const next = new Map(state.shortcuts)
      next.set(id, shortcut)
      return { shortcuts: next }
    }),

  unregister: (id) =>
    set((state) => {
      const next = new Map(state.shortcuts)
      next.delete(id)
      return { shortcuts: next }
    }),

  toggleOverlay: () =>
    set((state) => ({ isOverlayOpen: !state.isOverlayOpen })),

  closeOverlay: () =>
    set({ isOverlayOpen: false }),
}))

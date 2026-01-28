import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PanelType = 
  | 'heap-memory' 
  | 'visualization' 
  | 'call-stack' 
  | 'variables' 
  | 'console-output'

export interface PanelConfig {
  id: PanelType
  label: string
  icon: string
  defaultVisible: boolean
}

export const PANELS: PanelConfig[] = [
  { id: 'heap-memory', label: 'Heap Memory', icon: 'Database', defaultVisible: true },
  { id: 'visualization', label: 'Visualization', icon: 'BarChart3', defaultVisible: true },
  { id: 'call-stack', label: 'Call Stack', icon: 'Layers', defaultVisible: true },
  { id: 'variables', label: 'Variables', icon: 'Box', defaultVisible: true },
  { id: 'console-output', label: 'Output', icon: 'Terminal', defaultVisible: true },
]

interface PanelState {
  order: PanelType[]
  collapsed: Record<PanelType, boolean>
  setOrder: (order: PanelType[]) => void
  movePanel: (fromIndex: number, toIndex: number) => void
  toggleCollapsed: (panelId: PanelType) => void
  expandAll: () => void
  collapseAll: () => void
  resetToDefault: () => void
}

const DEFAULT_ORDER: PanelType[] = [
  'heap-memory',
  'visualization', 
  'call-stack',
  'variables',
  'console-output',
]

const DEFAULT_COLLAPSED: Record<PanelType, boolean> = {
  'heap-memory': false,
  'visualization': false,
  'call-stack': false,
  'variables': false,
  'console-output': false,
}

export const usePanelStore = create<PanelState>()(
  persist(
    (set) => ({
      order: DEFAULT_ORDER,
      collapsed: { ...DEFAULT_COLLAPSED },
      
      setOrder: (order) => set({ order }),
      
      movePanel: (fromIndex, toIndex) => set((state) => {
        const newOrder = [...state.order]
        const [moved] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, moved)
        return { order: newOrder }
      }),
      
      toggleCollapsed: (panelId) => set((state) => ({
        collapsed: {
          ...state.collapsed,
          [panelId]: !state.collapsed[panelId],
        },
      })),
      
      expandAll: () => set({ collapsed: { ...DEFAULT_COLLAPSED } }),
      
      collapseAll: () => set({
        collapsed: {
          'heap-memory': true,
          'visualization': true,
          'call-stack': true,
          'variables': true,
          'console-output': true,
        },
      }),
      
      resetToDefault: () => set({
        order: DEFAULT_ORDER,
        collapsed: { ...DEFAULT_COLLAPSED },
      }),
    }),
    {
      name: 'panel-order-storage',
    }
  )
)

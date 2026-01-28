'use client'

import {
  Database,
  BarChart3,
  Layers,
  Box,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import { Icon, type IconSize, type IconVariant } from './Icon'

export type PanelType = 
  | 'heap-memory' 
  | 'visualization' 
  | 'call-stack' 
  | 'variables' 
  | 'console-output'

interface PanelIconConfig {
  icon: LucideIcon
  label: string
  variant: IconVariant
}

const panelIconMap: Record<PanelType, PanelIconConfig> = {
  'heap-memory': { 
    icon: Database, 
    label: 'Heap Memory',
    variant: 'primary'
  },
  'visualization': { 
    icon: BarChart3, 
    label: 'Visualization',
    variant: 'secondary'
  },
  'call-stack': { 
    icon: Layers, 
    label: 'Call Stack',
    variant: 'default'
  },
  'variables': { 
    icon: Box, 
    label: 'Variables',
    variant: 'success'
  },
  'console-output': { 
    icon: Terminal, 
    label: 'Output',
    variant: 'muted'
  },
}

interface PanelIconProps {
  panelId: PanelType
  size?: IconSize
  className?: string
}

export function PanelIcon({ panelId, size = 'md', className }: PanelIconProps) {
  const config = panelIconMap[panelId]
  
  if (!config) return null
  
  return (
    <Icon 
      icon={config.icon} 
      size={size} 
      variant={config.variant}
      className={className}
    />
  )
}

export function getPanelLabel(panelId: PanelType): string {
  return panelIconMap[panelId]?.label || panelId
}

export function getPanelIcon(panelId: PanelType): LucideIcon {
  return panelIconMap[panelId]?.icon || Box
}

export { panelIconMap }

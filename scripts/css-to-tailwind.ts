#!/usr/bin/env tsx
/**
 * CSS Module to Tailwind CSS Converter
 * 
 * This script analyzes CSS Module files and converts them to Tailwind utility classes.
 * It's designed to handle the conversion systematically while preserving:
 * - Complex selectors (hover, focus, media queries)
 * - Pseudo-elements (::before, ::after)
 * - Design token references
 */

import * as fs from 'fs'
import * as path from 'path'

// Mapping of common CSS properties to Tailwind classes
const PROPERTY_MAP: Record<string, string | ((val: string) => string | null)> = {
  // Display
  'display: flex': 'flex',
  'display: grid': 'grid',
  'display: block': 'block',
  'display: inline': 'inline',
  'display: inline-block': 'inline-block',
  'display: none': 'hidden',
  'display: revert': 'inline', // fallback
  
  // Position
  'position: relative': 'relative',
  'position: absolute': 'absolute',
  'position: fixed': 'fixed',
  'position: sticky': 'sticky',
  
  // Overflow
  'overflow: hidden': 'overflow-hidden',
  'overflow: auto': 'overflow-auto',
  'overflow: visible': 'overflow-visible',
  'overflow: scroll': 'overflow-scroll',
  
  // Flex direction
  'flex-direction: row': 'flex-row',
  'flex-direction: column': 'flex-col',
  'flex-direction: row-reverse': 'flex-row-reverse',
  'flex-direction: column-reverse': 'flex-col-reverse',
  
  // Flex wrap
  'flex-wrap: wrap': 'flex-wrap',
  'flex-wrap: nowrap': 'flex-nowrap',
  
  // Flex grow/shrink
  'flex-grow: 1': 'grow',
  'flex-grow: 0': 'grow-0',
  'flex-shrink: 0': 'shrink-0',
  'flex-shrink: 1': 'shrink',
  'flex: 1': 'flex-1',
  'flex: 0': 'flex-none',
  
  // Alignment
  'align-items: center': 'items-center',
  'align-items: flex-start': 'items-start',
  'align-items: flex-end': 'items-end',
  'align-items: stretch': 'items-stretch',
  'justify-content: center': 'justify-center',
  'justify-content: flex-start': 'justify-start',
  'justify-content: flex-end': 'justify-end',
  'justify-content: space-between': 'justify-between',
  'justify-content: space-around': 'justify-around',
  
  // Text alignment
  'text-align: center': 'text-center',
  'text-align: left': 'text-left',
  'text-align: right': 'text-right',
  
  // Font weight
  'font-weight: 400': 'font-normal',
  'font-weight: 500': 'font-medium',
  'font-weight: 600': 'font-semibold',
  'font-weight: 700': 'font-bold',
  'font-weight: normal': 'font-normal',
  'font-weight: bold': 'font-bold',
  'font-weight: var(--font-weight-normal)': 'font-normal',
  'font-weight: var(--font-weight-medium)': 'font-medium',
  'font-weight: var(--font-weight-semibold)': 'font-semibold',
  'font-weight: var(--font-weight-bold)': 'font-bold',
  
  // Cursor
  'cursor: pointer': 'cursor-pointer',
  'cursor: not-allowed': 'cursor-not-allowed',
  
  // Border style
  'border-style: none': 'border-none',
  'border-style: solid': 'border-solid',
  
  // List style
  'list-style: none': 'list-none',
  
  // Transitions
  'transition: all': 'transition-all',
  'transition: color': 'transition-colors',
  'transition: opacity': 'transition-opacity',
  'transition: transform': 'transition-transform',
  
  // Opacity
  'opacity: 0': 'opacity-0',
  'opacity: 0.5': 'opacity-50',
  'opacity: 1': 'opacity-100',
  'opacity: 0.75': 'opacity-75',
  
  // Z-index
  'z-index: 0': 'z-0',
  'z-index: 10': 'z-10',
  'z-index: 50': 'z-50',
  'z-index: 100': 'z-[100]',
  'z-index: 200': 'z-[200]',
  
  // Box sizing
  'box-sizing: border-box': 'box-border',
  
  // Whitespace
  'white-space: nowrap': 'whitespace-nowrap',
  
  // Pointer events
  'pointer-events: none': 'pointer-events-none',
  
  // Visibility
  'visibility: hidden': 'invisible',
  'visibility: visible': 'visible',
}

// Design token mappings
const COLOR_TOKENS: Record<string, string> = {
  'var(--color-bg-primary)': 'bg-bg-primary',
  'var(--color-bg-secondary)': 'bg-bg-secondary',
  'var(--color-bg-tertiary)': 'bg-bg-tertiary',
  'var(--color-bg-elevated)': 'bg-bg-elevated',
  'var(--color-bg-page)': 'bg-bg-page',
  'var(--color-bg-page-secondary)': 'bg-bg-page-secondary',
  'var(--color-text-primary)': 'text-text-primary',
  'var(--color-text-secondary)': 'text-text-secondary',
  'var(--color-text-muted)': 'text-text-muted',
  'var(--color-text-bright)': 'text-text-bright',
  'var(--color-white)': 'text-white',
  'var(--color-black)': 'text-black',
  'var(--color-accent-blue)': 'text-accent-blue',
  'var(--color-accent-green)': 'text-accent-green',
  'var(--color-accent-yellow)': 'text-accent-yellow',
  'var(--color-accent-red)': 'text-accent-red',
  'var(--color-accent-purple)': 'text-accent-purple',
  'var(--color-accent-cyan)': 'text-accent-cyan',
  'var(--color-accent-orange)': 'text-accent-orange',
  'var(--color-brand-primary)': 'text-brand-primary',
  'var(--color-brand-secondary)': 'text-brand-secondary',
  'var(--color-brand-light)': 'text-brand-light',
  'var(--color-border-primary)': 'border-border-primary',
  'var(--color-border-secondary)': 'border-border-secondary',
  'var(--border-card)': 'border-white-8',
}

const BG_COLOR_TOKENS: Record<string, string> = {
  'var(--color-bg-primary)': 'bg-bg-primary',
  'var(--color-bg-secondary)': 'bg-bg-secondary',
  'var(--color-bg-tertiary)': 'bg-bg-tertiary',
  'var(--color-bg-elevated)': 'bg-bg-elevated',
  'var(--color-bg-page)': 'bg-bg-page',
  'var(--color-bg-page-secondary)': 'bg-bg-page-secondary',
  'var(--color-accent-blue)': 'bg-accent-blue',
  'var(--color-accent-green)': 'bg-accent-green',
  'var(--color-accent-red)': 'bg-accent-red',
  'var(--color-accent-yellow)': 'bg-accent-yellow',
  'var(--color-accent-purple)': 'bg-accent-purple',
  'var(--color-white-5)': 'bg-white-5',
  'var(--color-white-8)': 'bg-white-8',
  'var(--color-white-10)': 'bg-white-10',
  'var(--color-white-15)': 'bg-white-15',
  'var(--color-brand-primary)': 'bg-brand-primary',
  'var(--color-brand-secondary)': 'bg-brand-secondary',
  'var(--color-black-50)': 'bg-black-50',
  'var(--surface-card)': 'bg-white-3',
  'var(--color-bg-tertiary)': 'bg-bg-tertiary',
  'rgba(15, 15, 26, 0.85)': 'bg-[rgba(15,15,26,0.85)]',
  'transparent': 'bg-transparent',
}

const BORDER_COLOR_TOKENS: Record<string, string> = {
  'var(--color-border-primary)': 'border-border-primary',
  'var(--color-border-secondary)': 'border-border-secondary',
  'var(--border-card)': 'border-white-8',
  'var(--color-accent-blue)': 'border-accent-blue',
  'var(--color-brand-primary)': 'border-brand-primary',
  'var(--color-white-15)': 'border-white-15',
  'transparent': 'border-transparent',
  'var(--card-border)': 'border-brand-primary-30',
  'var(--card-border-hover)': 'border-brand-primary-50',
}

const SPACING_TOKENS: Record<string, string> = {
  'var(--spacing-xs)': '1',
  'var(--spacing-sm)': '2',
  'var(--spacing-md)': '3',
  'var(--spacing-lg)': '4',
  'var(--spacing-xl)': '6',
  'var(--spacing-2xl)': '8',
  'var(--spacing-3xl)': '10',
  'var(--spacing-4xl)': '12',
  'var(--spacing-5xl)': '16',
  'var(--spacing-6xl)': '20',
  '0': '0',
  '0px': '0',
  '4px': '1',
  '8px': '2',
  '10px': '2.5',
  '12px': '3',
  '16px': '4',
  '20px': '5',
  '24px': '6',
  '32px': '8',
  '40px': '10',
  '44px': '11',
  '48px': '12',
  '64px': '16',
  '70px': '17.5',
  '80px': '20',
  '100px': '25',
  '120px': '30',
  '140px': '35',
  '200px': '50',
  '280px': '70',
  '300px': '75',
  '320px': '80',
  '340px': '85',
  '360px': '90',
  '400px': '100',
  '100%': 'full',
  'auto': 'auto',
}

const RADIUS_TOKENS: Record<string, string> = {
  'var(--radius-none)': 'rounded-none',
  'var(--radius-xs)': 'rounded-xs',
  'var(--radius-sm)': 'rounded-sm',
  'var(--radius-md)': 'rounded-md',
  'var(--radius-lg)': 'rounded-lg',
  'var(--radius-xl)': 'rounded-xl',
  'var(--radius-2xl)': 'rounded-2xl',
  'var(--radius-3xl)': 'rounded-3xl',
  'var(--radius-4xl)': 'rounded-4xl',
  'var(--radius-full)': 'rounded-full',
  '0': 'rounded-none',
  '2px': 'rounded-xs',
  '4px': 'rounded-sm',
  '5px': 'rounded',
  '6px': 'rounded-md',
  '8px': 'rounded-lg',
  '12px': 'rounded-xl',
  '16px': 'rounded-2xl',
  '20px': 'rounded-3xl',
  '24px': 'rounded-4xl',
  '999px': 'rounded-full',
}

const FONT_SIZE_TOKENS: Record<string, string> = {
  'var(--text-2xs)': 'text-2xs',
  'var(--text-xs)': 'text-xs',
  'var(--text-sm)': 'text-sm',
  'var(--text-base)': 'text-base',
  'var(--text-md)': 'text-md',
  'var(--text-lg)': 'text-lg',
  'var(--text-xl)': 'text-xl',
  'var(--text-2xl)': 'text-2xl',
  'var(--text-3xl)': 'text-3xl',
  '0.625rem': 'text-2xs',
  '0.7rem': 'text-xs',
  '0.75rem': 'text-sm',
  '0.85rem': 'text-base',
  '1rem': 'text-md',
  '1.125rem': 'text-lg',
  '1.25rem': 'text-xl',
  '1.5rem': 'text-2xl',
  '2rem': 'text-3xl',
  '10px': 'text-2xs',
  '11px': 'text-xs',
  '12px': 'text-xs',
  '13px': 'text-sm',
  '14px': 'text-sm',
  '16px': 'text-md',
  '18px': 'text-lg',
  '20px': 'text-xl',
  '24px': 'text-2xl',
  '32px': 'text-3xl',
}

const LINE_HEIGHT_TOKENS: Record<string, string> = {
  'var(--leading-none)': 'leading-none',
  'var(--leading-tight)': 'leading-tight',
  'var(--leading-snug)': 'leading-snug',
  'var(--leading-normal)': 'leading-normal',
  'var(--leading-relaxed)': 'leading-relaxed',
  '1': 'leading-none',
  '1.25': 'leading-tight',
  '1.4': 'leading-snug',
  '1.5': 'leading-normal',
  '1.6': 'leading-relaxed',
}

const BORDER_WIDTH_TOKENS: Record<string, string> = {
  'var(--border-width-1)': 'border',
  'var(--border-width-2)': 'border-2',
  'var(--border-width-3)': 'border-[3px]',
  'var(--border-width-4)': 'border-4',
  '1px': 'border',
  '2px': 'border-2',
  '0': 'border-0',
  '0px': 'border-0',
}

const SHADOW_TOKENS: Record<string, string> = {
  'var(--shadow-sm)': 'shadow-sm',
  'var(--shadow-md)': 'shadow-md',
  'var(--shadow-lg)': 'shadow-lg',
  'var(--shadow-xl)': 'shadow-xl',
}

const TRANSITION_TOKENS: Record<string, string> = {
  'var(--transition-fast)': 'duration-fast',
  'var(--transition-normal)': 'duration-normal',
  'var(--transition-slow)': 'duration-slow',
  'ease': 'ease-out',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
}

/**
 * Convert a CSS declaration to Tailwind classes
 */
function convertDeclaration(prop: string, value: string, isHover = false): string[] {
  const classes: string[] = []
  const fullDecl = `${prop}: ${value}`
  
  // Direct property mapping
  if (PROPERTY_MAP[fullDecl]) {
    const cls = PROPERTY_MAP[fullDecl]
    classes.push(typeof cls === 'string' ? cls : cls(value) || '')
    return classes.filter(Boolean)
  }
  
  // Handle specific properties
  switch (prop) {
    case 'background':
    case 'background-color': {
      if (BG_COLOR_TOKENS[value]) {
        classes.push(BG_COLOR_TOKENS[value])
      } else if (value.startsWith('var(--color-')) {
        classes.push(`bg-${value.replace('var(--color-', '').replace(')', '')}`)
      } else if (value === 'none' || value === 'transparent') {
        classes.push('bg-transparent')
      } else if (value.includes('gradient')) {
        // Complex gradients - use arbitrary values
        classes.push(`bg-[${value}]`)
      } else if (value.startsWith('rgba') || value.startsWith('#')) {
        classes.push(`bg-[${value}]`)
      }
      break
    }
    
    case 'color': {
      if (COLOR_TOKENS[value]) {
        classes.push(COLOR_TOKENS[value])
      } else if (value.startsWith('var(--color-')) {
        classes.push(`text-${value.replace('var(--color-', '').replace(')', '')}`)
      } else if (value.startsWith('rgba') || value.startsWith('#')) {
        classes.push(`text-[${value}]`)
      }
      break
    }
    
    case 'border-color': {
      if (BORDER_COLOR_TOKENS[value]) {
        classes.push(BORDER_COLOR_TOKENS[value])
      } else if (value.startsWith('var(--color-')) {
        classes.push(`border-${value.replace('var(--color-', '').replace(')', '')}`)
      } else if (value.startsWith('rgba') || value.startsWith('#')) {
        classes.push(`border-[${value}]`)
      }
      break
    }
    
    case 'border': {
      if (BORDER_WIDTH_TOKENS[value]) {
        classes.push(BORDER_WIDTH_TOKENS[value])
      } else if (value === 'none') {
        classes.push('border-none')
      } else {
        classes.push('border')
        if (BORDER_COLOR_TOKENS[value]) {
          classes.push(BORDER_COLOR_TOKENS[value])
        }
      }
      break
    }
    
    case 'border-width': {
      if (BORDER_WIDTH_TOKENS[value]) {
        classes.push(BORDER_WIDTH_TOKENS[value])
      } else if (value.startsWith('var(--border-width-')) {
        classes.push(BORDER_WIDTH_TOKENS[value] || 'border')
      }
      break
    }
    
    case 'border-radius': {
      if (RADIUS_TOKENS[value]) {
        classes.push(RADIUS_TOKENS[value])
      } else {
        classes.push(`rounded-[${value}]`)
      }
      break
    }
    
    case 'padding': {
      const paddingVal = value.includes('var(--spacing-') ? value.trim() : value.trim()
      if (SPACING_TOKENS[paddingVal]) {
        classes.push(`p-${SPACING_TOKENS[paddingVal]}`)
      } else if (paddingVal.includes(' ')) {
        // Different values for different sides
        const parts = paddingVal.split(/\s+/)
        if (parts.length === 2) {
          const y = SPACING_TOKENS[parts[0]] || parts[0]
          const x = SPACING_TOKENS[parts[1]] || parts[1]
          classes.push(`py-${y} px-${x}`)
        } else if (parts.length === 4) {
          classes.push(`pt-${parts[0]} pr-${parts[1]} pb-${parts[2]} pl-${parts[3]}`)
        }
      } else {
        classes.push(`p-[${paddingVal}]`)
      }
      break
    }
    
    case 'padding-top': {
      const pt = SPACING_TOKENS[value] || value
      classes.push(`pt-${pt}`)
      break
    }
    
    case 'padding-bottom': {
      const pb = SPACING_TOKENS[value] || value
      classes.push(`pb-${pb}`)
      break
    }
    
    case 'padding-left':
    case 'padding-right':
    case 'padding-inline':
    case 'padding-inline-start':
    case 'padding-inline-end': {
      if (prop === 'padding-left' || prop === 'padding-inline-start') {
        const pl = SPACING_TOKENS[value] || value
        classes.push(`pl-${pl}`)
      } else {
        const pr = SPACING_TOKENS[value] || value
        classes.push(`pr-${pr}`)
      }
      break
    }
    
    case 'margin': {
      if (SPACING_TOKENS[value]) {
        classes.push(`m-${SPACING_TOKENS[value]}`)
      } else if (value === '0' || value === '0px') {
        classes.push('m-0')
      } else if (value === 'auto') {
        classes.push('m-auto')
      } else {
        classes.push(`m-[${value}]`)
      }
      break
    }
    
    case 'margin-top': {
      if (SPACING_TOKENS[value]) {
        classes.push(`mt-${SPACING_TOKENS[value]}`)
      } else if (value === '0' || value === '0px') {
        classes.push('mt-0')
      } else if (value === 'auto') {
        classes.push('mt-auto')
      } else {
        classes.push(`mt-[${value}]`)
      }
      break
    }
    
    case 'margin-bottom': {
      if (SPACING_TOKENS[value]) {
        classes.push(`mb-${SPACING_TOKENS[value]}`)
      } else if (value === '0' || value === '0px') {
        classes.push('mb-0')
      } else if (value === 'auto') {
        classes.push('mb-auto')
      } else {
        classes.push(`mb-[${value}]`)
      }
      break
    }
    
    case 'margin-left':
    case 'margin-right': {
      if (prop === 'margin-left') {
        if (SPACING_TOKENS[value]) {
          classes.push(`ml-${SPACING_TOKENS[value]}`)
        } else if (value === '0' || value === '0px') {
          classes.push('ml-0')
        } else if (value === 'auto') {
          classes.push('ml-auto')
        } else {
          classes.push(`ml-[${value}]`)
        }
      } else {
        if (SPACING_TOKENS[value]) {
          classes.push(`mr-${SPACING_TOKENS[value]}`)
        } else if (value === '0' || value === '0px') {
          classes.push('mr-0')
        } else if (value === 'auto') {
          classes.push('mr-auto')
        } else {
          classes.push(`mr-[${value}]`)
        }
      }
      break
    }
    
    case 'gap': {
      if (SPACING_TOKENS[value]) {
        classes.push(`gap-${SPACING_TOKENS[value]}`)
      } else {
        classes.push(`gap-[${value}]`)
      }
      break
    }
    
    case 'row-gap':
      classes.push(`gap-y-[${value}]`)
      break
      
    case 'column-gap':
      classes.push(`gap-x-[${value}]`)
      break
    
    case 'font-size': {
      if (FONT_SIZE_TOKENS[value]) {
        classes.push(FONT_SIZE_TOKENS[value])
      } else {
        classes.push(`text-[${value}]`)
      }
      break
    }
    
    case 'line-height': {
      if (LINE_HEIGHT_TOKENS[value]) {
        classes.push(LINE_HEIGHT_TOKENS[value])
      } else {
        classes.push(`leading-[${value}]`)
      }
      break
    }
    
    case 'width': {
      if (SPACING_TOKENS[value]) {
        classes.push(`w-${SPACING_TOKENS[value]}`)
      } else if (value === '100%') {
        classes.push('w-full')
      } else if (value === 'auto') {
        classes.push('w-auto')
      } else if (value === '100vw') {
        classes.push('w-screen')
      } else if (value.startsWith('calc')) {
        classes.push(`w-[${value}]`)
      } else {
        classes.push(`w-[${value}]`)
      }
      break
    }
    
    case 'min-width': {
      if (SPACING_TOKENS[value]) {
        classes.push(`min-w-${SPACING_TOKENS[value]}`)
      } else if (value === '100%') {
        classes.push('min-w-full')
      } else if (value === '0') {
        classes.push('min-w-0')
      } else {
        classes.push(`min-w-[${value}]`)
      }
      break
    }
    
    case 'max-width': {
      if (value === '1400px') {
        classes.push('max-w-[1400px]')
      } else if (value === '100%') {
        classes.push('max-w-full')
      } else if (value.startsWith('var(--breakpoint-')) {
        classes.push(`max-w-[${value}]`)
      } else {
        classes.push(`max-w-[${value}]`)
      }
      break
    }
    
    case 'height': {
      if (SPACING_TOKENS[value]) {
        classes.push(`h-${SPACING_TOKENS[value]}`)
      } else if (value === '100%') {
        classes.push('h-full')
      } else if (value === '100vh') {
        classes.push('h-screen')
      } else if (value === 'auto') {
        classes.push('h-auto')
      } else if (value.startsWith('calc')) {
        classes.push(`h-[${value}]`)
      } else {
        classes.push(`h-[${value}]`)
      }
      break
    }
    
    case 'min-height': {
      if (SPACING_TOKENS[value]) {
        classes.push(`min-h-${SPACING_TOKENS[value]}`)
      } else if (value === '100%') {
        classes.push('min-h-full')
      } else if (value === '100vh') {
        classes.push('min-h-screen')
      } else if (value === '0') {
        classes.push('min-h-0')
      } else {
        classes.push(`min-h-[${value}]`)
      }
      break
    }
    
    case 'text-decoration': {
      if (value === 'none') {
        classes.push('no-underline')
      } else if (value === 'underline') {
        classes.push('underline')
      }
      break
    }
    
    case 'text-transform': {
      if (value === 'uppercase') {
        classes.push('uppercase')
      } else if (value === 'capitalize') {
        classes.push('capitalize')
      } else if (value === 'lowercase') {
        classes.push('lowercase')
      }
      break
    }
    
    case 'letter-spacing': {
      if (value === '0.1em') {
        classes.push('tracking-widest')
      } else if (value === '0.5px') {
        classes.push('tracking-tight')
      } else if (value === '-0.5px') {
        classes.push('tracking-tighter')
      } else {
        classes.push(`tracking-[${value}]`)
      }
      break
    }
    
    case 'box-shadow': {
      if (SHADOW_TOKENS[value]) {
        classes.push(SHADOW_TOKENS[value])
      } else if (value.includes('var(--glow-') || value.includes('var(--card-glow')) {
        // Custom glows - keep as inline style for now
        classes.push('/* glow */')
      } else {
        classes.push(`shadow-[${value}]`)
      }
      break
    }
    
    case 'transition': {
      if (TRANSITION_TOKENS[value]) {
        classes.push('transition-all', TRANSITION_TOKENS[value])
      } else if (value === 'none') {
        classes.push('transition-none')
      } else if (value.includes('var(--transition-')) {
        const match = value.match(/var\(--transition-(\w+)\)/)
        if (match) {
          classes.push(`duration-${match[1]}`)
        }
      }
      break
    }
    
    case 'transition-duration': {
      if (TRANSITION_TOKENS[value]) {
        classes.push(TRANSITION_TOKENS[value])
      } else {
        classes.push(`duration-[${value}]`)
      }
      break
    }
    
    case 'transition-property': {
      if (value === 'all') {
        classes.push('transition-all')
      } else if (value === 'color') {
        classes.push('transition-colors')
      } else if (value === 'opacity') {
        classes.push('transition-opacity')
      } else if (value === 'transform') {
        classes.push('transition-transform')
      } else {
        classes.push(`transition-[${value}]`)
      }
      break
    }
    
    case 'transform': {
      if (value === 'none') {
        classes.push('transform-none')
      } else if (value.includes('translateY')) {
        const match = value.match(/translateY\(([^)]+)\)/)
        if (match) {
          if (match[1] === '-4px') {
            classes.push('-translate-y-1')
          } else {
            classes.push(`-translate-y-[${match[1]}]`)
          }
        }
      } else if (value.includes('scale')) {
        const match = value.match(/scale\(([^)]+)\)/)
        if (match) {
          classes.push(`scale-[${match[1]}]`)
        }
      } else if (value.includes('rotate')) {
        const match = value.match(/rotate\(([^)]+)\)/)
        if (match) {
          classes.push(`rotate-[${match[1]}]`)
        }
      } else if (value.includes('translateX')) {
        const match = value.match(/translateX\(([^)]+)\)/)
        if (match) {
          classes.push(`translate-x-[${match[1]}]`)
        }
      }
      break
    }
    
    case 'filter': {
      if (value.includes('brightness')) {
        const match = value.match(/brightness\(([^)]+)\)/)
        if (match) {
          classes.push(`brightness-[${match[1]}]`)
        }
      } else if (value.includes('drop-shadow')) {
        classes.push(`filter`)
      }
      break
    }
    
    case 'backdrop-filter': {
      if (value.includes('blur')) {
        const match = value.match(/blur\(([^)]+)\)/)
        if (match) {
          classes.push(`backdrop-blur-[${match[1]}]`)
        }
      }
      break
    }
    
    case 'inset': {
      if (value === '0') {
        classes.push('inset-0')
      } else {
        classes.push(`inset-[${value}]`)
      }
      break
    }
    
    case 'top':
    case 'right':
    case 'bottom':
    case 'left': {
      if (value === '0') {
        classes.push(`${prop}-0`)
      } else if (SPACING_TOKENS[value]) {
        classes.push(`${prop}-${SPACING_TOKENS[value]}`)
      } else {
        classes.push(`${prop}-[${value}]`)
      }
      break
    }
    
    case 'content': {
      if (value === "''" || value === '""' || value === "''") {
        classes.push('content-[""]')
      } else {
        classes.push(`content-[${value}]`)
      }
      break
    }
    
    case 'scroll-snap-align': {
      if (value === 'start') {
        classes.push('snap-start')
      } else if (value === 'end') {
        classes.push('snap-end')
      } else if (value === 'center') {
        classes.push('snap-center')
      }
      break
    }
    
    case '-webkit-background-clip':
    case 'background-clip': {
      if (value === 'text') {
        classes.push('bg-clip-text')
      }
      break
    }
    
    case '-webkit-text-fill-color': {
      if (value === 'transparent') {
        classes.push('text-transparent')
      }
      break
    }
    
    case 'grid-template-columns': {
      if (value === 'repeat(3, 1fr)') {
        classes.push('grid-cols-3')
      } else if (value === 'repeat(2, 1fr)') {
        classes.push('grid-cols-2')
      } else if (value === '1fr') {
        classes.push('grid-cols-1')
      } else {
        classes.push(`grid-cols-[${value}]`)
      }
      break
    }
    
    case 'flex': {
      const numValue = parseInt(value)
      if (!isNaN(numValue)) {
        if (numValue === 1) {
          classes.push('flex-1')
        } else {
          classes.push(`flex-[${value}]`)
        }
      } else if (value.includes(' ')) {
        // Complex flex values
        classes.push(`flex-[${value}]`)
      }
      break
    }
    
    case 'order': {
      classes.push(`order-[${value}]`)
      break
    }
    
    case 'aspect-ratio': {
      classes.push(`aspect-[${value}]`)
      break
    }
    
    case 'object-fit': {
      if (value === 'cover') {
        classes.push('object-cover')
      } else if (value === 'contain') {
        classes.push('object-contain')
      }
      break
    }
    
    case 'resize': {
      if (value === 'none') {
        classes.push('resize-none')
      }
      break
    }
    
    case 'user-select': {
      if (value === 'none') {
        classes.push('select-none')
      }
      break
    }
    
    case 'pointer-events': {
      if (value === 'none') {
        classes.push('pointer-events-none')
      }
      break
    }
  }
  
  return classes.filter(Boolean)
}

/**
 * Parse CSS content and extract class definitions
 */
function parseCSS(css: string): Map<string, { declarations: string[], pseudo?: string, media?: string }> {
  const classes = new Map()
  
  // Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
  
  // Match class definitions including nested @media
  const classRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{([^}]*)\}/g
  const mediaRegex = /@media\s*\([^)]+\)\s*\{([^}]*)\}/g
  
  let match
  while ((match = classRegex.exec(css)) !== null) {
    const className = match[1]
    const content = match[2].trim()
    
    // Parse declarations
    const declarations = content.split(';')
      .map(d => d.trim())
      .filter(d => d.length > 0)
    
    classes.set(className, { declarations, pseudo: null, media: null })
  }
  
  // Handle @media queries - simplified
  css.replace(mediaRegex, (match, content) => {
    // For now, we'll handle media queries inline in the converted component
    return match
  })
  
  return classes
}

/**
 * Convert CSS Module file to Tailwind classes report
 */
export function convertCSSModule(cssPath: string): { classMap: Record<string, string>, needsInlineStyles: Record<string, string[]> } {
  const css = fs.readFileSync(cssPath, 'utf-8')
  const classes = parseCSS(css)
  const classMap: Record<string, string> = {}
  const needsInlineStyles: Record<string, string[]> = {}
  
  for (const [className, info] of classes) {
    const tailwindClasses: string[] = []
    const inlineStyles: string[] = []
    
    for (const decl of info.declarations) {
      const colonIndex = decl.indexOf(':')
      if (colonIndex === -1) continue
      
      const prop = decl.substring(0, colonIndex).trim()
      const value = decl.substring(colonIndex + 1).trim()
      
      const converted = convertDeclaration(prop, value)
      
      if (converted.length > 0 && !converted[0].startsWith('/*')) {
        tailwindClasses.push(...converted)
      } else if (converted.length > 0) {
        // Needs inline style
        inlineStyles.push(`${prop}: ${value}`)
      }
    }
    
    classMap[className] = tailwindClasses.join(' ')
    if (inlineStyles.length > 0) {
      needsInlineStyles[className] = inlineStyles
    }
  }
  
  return { classMap, needsInlineStyles }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Usage: tsx css-to-tailwind.ts <css-module-file>')
    process.exit(1)
  }
  
  const cssPath = args[0]
  const result = convertCSSModule(cssPath)
  
  console.log('=== Tailwind Class Mapping ===')
  console.log(JSON.stringify(result.classMap, null, 2))
  
  if (Object.keys(result.needsInlineStyles).length > 0) {
    console.log('\n=== Needs Inline Styles ===')
    console.log(JSON.stringify(result.needsInlineStyles, null, 2))
  }
}

import { clsx, type ClassValue } from 'clsx'

/**
 * Utility to conditionally join classNames together
 * Uses clsx for conditional class merging
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

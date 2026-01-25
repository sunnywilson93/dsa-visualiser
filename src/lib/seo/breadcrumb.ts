/**
 * Breadcrumb Schema Generator
 *
 * Generates valid schema.org BreadcrumbList JSON-LD for SEO.
 * Use this utility to ensure consistent breadcrumb structured data across all pages.
 */

export interface BreadcrumbItem {
  name: string
  path?: string
}

export interface BreadcrumbSchema extends Record<string, unknown> {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}

const BASE_URL = 'https://jsinterview.dev'

/**
 * Generates a valid schema.org BreadcrumbList JSON-LD object.
 *
 * @param items - Array of breadcrumb items. The last item typically has no path (current page).
 * @returns BreadcrumbSchema object ready for JSON-LD injection
 *
 * @example
 * // For /concepts/dsa/patterns/two-pointers
 * generateBreadcrumbSchema([
 *   { name: 'Home', path: '/' },
 *   { name: 'Concepts', path: '/concepts' },
 *   { name: 'DSA Patterns', path: '/concepts/dsa' },
 *   { name: 'Two Pointers' } // Current page, no path
 * ])
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const listItem: BreadcrumbSchema['itemListElement'][number] = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      }

      if (item.path) {
        listItem.item = item.path.startsWith('http')
          ? item.path
          : `${BASE_URL}${item.path}`
      }

      return listItem
    }),
  }
}

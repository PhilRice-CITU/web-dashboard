import type { DocsSection } from './types'

/** Single source of truth for sidebar grouping and order. */
export const docsNav: DocsSection[] = [
  {
    label: 'Getting Started',
    items: [
      'getting-started/introduction',
      'getting-started/dashboard-overview',
      'getting-started/first-login-and-roles',
    ],
  },
  {
    label: 'Using the Dashboard',
    items: [
      'using-the-dashboard/results',
      'using-the-dashboard/devices',
      'using-the-dashboard/analytics',
      'using-the-dashboard/test-grading',
    ],
  },
  {
    label: 'Grading & Standards',
    items: [
      'grading-and-standards/how-grading-works',
      'grading-and-standards/quality-grades',
      'grading-and-standards/defect-types',
    ],
  },
  {
    label: 'Technical Reference',
    items: [
      'technical-reference/api-architecture',
      'technical-reference/database-schema',
      'technical-reference/grading-pipeline',
      'technical-reference/metrics-contract',
      'technical-reference/device-events',
    ],
  },
]

/** The first page — `/docs` redirects here. */
export const FIRST_DOC_SLUG = docsNav[0].items[0]

/** All slugs in display order. */
export function flattenDocsNav(): string[] {
  return docsNav.flatMap((section) => section.items)
}

/** Previous/next slug for a given page, or null at the ends. */
export function getAdjacentDocs(slug: string): {
  prev: string | null
  next: string | null
} {
  const flat = flattenDocsNav()
  const i = flat.indexOf(slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i < flat.length - 1 ? flat[i + 1] : null,
  }
}

/** The section label that contains a slug, or null. */
export function getSectionLabel(slug: string): string | null {
  return docsNav.find((s) => s.items.includes(slug))?.label ?? null
}

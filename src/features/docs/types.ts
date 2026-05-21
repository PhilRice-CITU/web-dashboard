import type { ComponentType } from 'react'

/** Frontmatter exported by every doc file. */
export interface DocFrontmatter {
  title: string
  description: string
}

/** A resolved doc page from the registry. */
export interface DocMeta extends DocFrontmatter {
  /** URL slug, e.g. "getting-started/introduction" (no extension). */
  slug: string
  /** Compiled MDX component. */
  Component: ComponentType
}

/** One group in the sidebar nav. */
export interface DocsSection {
  label: string
  /** Slugs, in display order. */
  items: string[]
}

/** A heading captured for the "On this page" TOC. */
export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

/** A flattened entry used for search and prev/next paging. */
export interface DocSearchEntry {
  slug: string
  title: string
  description: string
  section: string
}

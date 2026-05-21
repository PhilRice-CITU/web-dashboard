import type { ComponentType } from 'react'

/** Frontmatter as parsed from a doc file — fields may be absent before normalization. */
export interface DocFrontmatter {
  title?: string
  description?: string
}

/** A resolved doc page from the registry (frontmatter normalized). */
export interface DocMeta extends DocFrontmatter {
  /** URL slug, e.g. "getting-started/introduction" (no extension). */
  slug: string
  /** Page title — always present (the registry skips files without one). */
  title: string
  /** Page description — normalized to '' when absent from frontmatter. */
  description: string
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

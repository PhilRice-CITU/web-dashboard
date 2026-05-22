import type { DocSearchEntry } from '../types'
import { docsNav, getSectionLabel } from '../docs.config'
import { getDoc } from './docs-registry'

/** Build the client-side search index from the nav config + registry. */
export function buildSearchIndex(): DocSearchEntry[] {
  const entries: DocSearchEntry[] = []
  for (const section of docsNav) {
    for (const slug of section.items) {
      const doc = getDoc(slug)
      if (!doc) continue
      entries.push({
        slug,
        title: doc.title,
        description: doc.description,
        section: getSectionLabel(slug) ?? '',
      })
    }
  }
  return entries
}

/** Case-insensitive substring filter over title + description + section. */
export function searchDocs(
  index: DocSearchEntry[],
  query: string,
): DocSearchEntry[] {
  const q = query.trim().toLowerCase()
  if (q === '') return index
  return index.filter((e) =>
    `${e.title} ${e.description} ${e.section}`.toLowerCase().includes(q),
  )
}

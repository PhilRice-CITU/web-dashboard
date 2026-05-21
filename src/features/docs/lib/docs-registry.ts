import type { ComponentType } from 'react'
import type { DocFrontmatter, DocMeta } from '../types'

interface DocModule {
  default: ComponentType
  frontmatter?: DocFrontmatter
}

// Eagerly import every doc file. ~15 small files — eager keeps the registry
// synchronous and avoids Suspense plumbing.
const modules = import.meta.glob<DocModule>('/src/content/docs/**/*.{md,mdx}', {
  eager: true,
})

const PREFIX = '/src/content/docs/'

/** Convert a glob path to a slug: ".../getting-started/intro.mdx" → "getting-started/intro". */
function pathToSlug(path: string): string {
  return path.slice(PREFIX.length).replace(/\.(md|mdx)$/, '')
}

const registry = new Map<string, DocMeta>()
for (const [path, mod] of Object.entries(modules)) {
  const slug = pathToSlug(path)
  const fm = mod.frontmatter
  if (!fm?.title) {
    console.warn(`[docs] "${slug}" is missing frontmatter title — skipped.`)
    continue
  }
  registry.set(slug, {
    slug,
    title: fm.title,
    description: fm.description ?? '',
    Component: mod.default,
  })
}

/** Resolve a slug to its doc, or null if unknown. */
export function getDoc(slug: string): DocMeta | null {
  return registry.get(slug) ?? null
}

/** True if a content file exists for the slug. */
export function docExists(slug: string): boolean {
  return registry.has(slug)
}

/** All registered docs (unordered — use docs.config for order). */
export function getAllDocs(): DocMeta[] {
  return [...registry.values()]
}

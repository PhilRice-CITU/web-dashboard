import { describe, it, expect } from 'vitest'
import { getDoc, getAllDocs, docExists } from '../lib/docs-registry'
import { flattenDocsNav } from '../docs.config'

describe('docs-registry', () => {
  it('resolves a known slug to a doc with a component and frontmatter', () => {
    const doc = getDoc('getting-started/introduction')
    expect(doc).not.toBeNull()
    expect(doc!.title).toBe('Introduction')
    expect(typeof doc!.Component).toBe('function')
  })

  it('returns null for an unknown slug', () => {
    expect(getDoc('nope/does-not-exist')).toBeNull()
    expect(docExists('nope/does-not-exist')).toBe(false)
  })

  it('every slug in docs.config has a matching content file', () => {
    for (const slug of flattenDocsNav()) {
      expect(docExists(slug), `missing content file for "${slug}"`).toBe(true)
    }
  })

  it('every content file is listed in docs.config', () => {
    const nav = new Set(flattenDocsNav())
    for (const doc of getAllDocs()) {
      expect(nav.has(doc.slug), `"${doc.slug}" is not in docs.config`).toBe(
        true,
      )
    }
  })
})

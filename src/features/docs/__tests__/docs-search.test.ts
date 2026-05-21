import { describe, it, expect } from 'vitest'
import { buildSearchIndex, searchDocs } from '../lib/docs-search'

describe('docs-search', () => {
  it('builds one index entry per nav page', () => {
    const index = buildSearchIndex()
    expect(index.length).toBeGreaterThan(0)
    expect(index[0]).toMatchObject({ slug: 'getting-started/introduction' })
  })

  it('matches on title, case-insensitively', () => {
    const index = buildSearchIndex()
    const hits = searchDocs(index, 'DEVICES')
    expect(hits.some((d) => d.slug === 'using-the-dashboard/devices')).toBe(
      true,
    )
  })

  it('matches on description text', () => {
    const index = buildSearchIndex()
    const hits = searchDocs(index, 'grain defects')
    expect(hits.length).toBeGreaterThan(0)
  })

  it('returns the full index for an empty query', () => {
    const index = buildSearchIndex()
    expect(searchDocs(index, '   ')).toHaveLength(index.length)
  })

  it('returns nothing for a non-matching query', () => {
    const index = buildSearchIndex()
    expect(searchDocs(index, 'zzzznomatch')).toHaveLength(0)
  })
})

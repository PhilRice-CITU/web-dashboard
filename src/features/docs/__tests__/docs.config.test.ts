import { describe, it, expect } from 'vitest'
import { docsNav, flattenDocsNav, getAdjacentDocs } from '../docs.config'

describe('docs.config', () => {
  it('flattens the nav into ordered slugs', () => {
    const flat = flattenDocsNav()
    expect(flat[0]).toBe('getting-started/introduction')
    expect(flat.length).toBe(docsNav.reduce((n, s) => n + s.items.length, 0))
  })

  it('returns no previous for the first page', () => {
    const { prev, next } = getAdjacentDocs('getting-started/introduction')
    expect(prev).toBeNull()
    expect(next).toBe('getting-started/dashboard-overview')
  })

  it('returns no next for the last page', () => {
    const flat = flattenDocsNav()
    const { prev, next } = getAdjacentDocs(flat[flat.length - 1])
    expect(next).toBeNull()
    expect(prev).not.toBeNull()
  })

  it('returns both neighbors for a middle page', () => {
    const { prev, next } = getAdjacentDocs('getting-started/dashboard-overview')
    expect(prev).toBe('getting-started/introduction')
    expect(next).toBe('getting-started/first-login-and-roles')
  })
})

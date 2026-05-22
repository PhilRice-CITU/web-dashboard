import { describe, it, expect } from 'vitest'
import * as Smoke from './fixtures/smoke.mdx'

describe('MDX pipeline', () => {
  it('compiles an .mdx file to a component', () => {
    expect(typeof Smoke.default).toBe('function')
  })

  it('exposes frontmatter as a named export', () => {
    expect(Smoke.frontmatter).toEqual({
      title: 'Smoke',
      description: 'Pipeline smoke-test fixture.',
    })
  })
})

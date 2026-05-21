// Ambient module declarations for MDX/Markdown files compiled by @mdx-js/rollup.
// `.mdx` (operator guide) and `.md` (technical reference) both expose a default
// component plus a `frontmatter` named export (via remark-mdx-frontmatter).
declare module '*.mdx' {
  import type { ComponentType } from 'react'

  export const frontmatter: { title: string; description: string }
  const MDXComponent: ComponentType
  export default MDXComponent
}

declare module '*.md' {
  import type { ComponentType } from 'react'

  export const frontmatter: { title: string; description: string }
  const MDXComponent: ComponentType
  export default MDXComponent
}

import type { ComponentProps } from 'react'
import { Link } from '@tanstack/react-router'
import { Callout } from './Callout'
import { CardGrid } from './CardGrid'
import { DocCard } from './DocCard'

/** Element + custom component map passed to MDXProvider. */
export const mdxComponents = {
  h1: (p: ComponentProps<'h1'>) => (
    <h1
      className="mb-4 scroll-mt-24 text-[28px] font-bold tracking-tight text-foreground"
      {...p}
    />
  ),
  h2: (p: ComponentProps<'h2'>) => (
    <h2
      className="mt-10 mb-3 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground"
      {...p}
    />
  ),
  h3: (p: ComponentProps<'h3'>) => (
    <h3
      className="mt-6 mb-2 scroll-mt-24 text-base font-semibold text-foreground"
      {...p}
    />
  ),
  p: (p: ComponentProps<'p'>) => (
    <p className="my-4 leading-7 text-muted-foreground" {...p} />
  ),
  a: ({ href = '#', ...p }: ComponentProps<'a'>) => {
    const cls = 'font-medium text-foreground underline underline-offset-2'
    // Links into the docs site → SPA navigation via the splat route.
    if (href.startsWith('/docs/')) {
      const slug = href.replace(/^\/docs\//, '')
      return (
        <Link to="/docs/$" params={{ _splat: slug }} className={cls} {...p} />
      )
    }
    // Other in-app links (e.g. /results) leave the docs site → plain anchor.
    if (href.startsWith('/')) {
      return <a href={href} className={cls} {...p} />
    }
    // External links.
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} {...p} />
    )
  },
  ul: (p: ComponentProps<'ul'>) => (
    <ul
      className="my-4 list-disc space-y-1.5 pl-6 text-muted-foreground"
      {...p}
    />
  ),
  ol: (p: ComponentProps<'ol'>) => (
    <ol
      className="my-4 list-decimal space-y-1.5 pl-6 text-muted-foreground"
      {...p}
    />
  ),
  li: (p: ComponentProps<'li'>) => <li className="leading-7" {...p} />,
  strong: (p: ComponentProps<'strong'>) => (
    <strong className="font-semibold text-foreground" {...p} />
  ),
  blockquote: (p: ComponentProps<'blockquote'>) => (
    <blockquote
      className="my-4 border-l-2 border-border pl-4 text-muted-foreground italic"
      {...p}
    />
  ),
  code: (p: ComponentProps<'code'>) => (
    <code
      className="rounded bg-accent px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
      {...p}
    />
  ),
  pre: (p: ComponentProps<'pre'>) => (
    <pre
      className="my-5 overflow-x-auto rounded-lg border border-border bg-accent/50 p-4 text-[13px] [&>code]:bg-transparent [&>code]:p-0"
      {...p}
    />
  ),
  table: (p: ComponentProps<'table'>) => (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p: ComponentProps<'th'>) => (
    <th
      className="border border-border bg-accent/50 px-3 py-2 text-left font-semibold text-foreground"
      {...p}
    />
  ),
  td: (p: ComponentProps<'td'>) => (
    <td
      className="border border-border px-3 py-2 text-muted-foreground"
      {...p}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (p: ComponentProps<'img'>) => (
    <img className="my-5 rounded-lg border border-border" {...p} />
  ),
  // custom MDX components — usable in any .mdx file without import
  Callout,
  CardGrid,
  DocCard,
}

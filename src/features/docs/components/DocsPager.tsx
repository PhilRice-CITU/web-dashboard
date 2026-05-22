import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { getAdjacentDocs } from '../docs.config'
import { getDoc } from '../lib/docs-registry'

export function DocsPager({ slug }: { slug: string }) {
  const { prev, next } = getAdjacentDocs(slug)
  const prevDoc = prev ? getDoc(prev) : null
  const nextDoc = next ? getDoc(next) : null

  if (!prevDoc && !nextDoc) return null

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-stretch justify-between gap-4 border-t border-border pt-6"
    >
      {prevDoc ? (
        <Link
          to="/docs/$"
          params={{ _splat: prevDoc.slug }}
          className="group flex flex-1 flex-col gap-1 rounded-lg border border-border p-3 no-underline transition-colors hover:bg-accent/60"
        >
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ArrowLeftIcon aria-hidden className="size-3" /> Previous
          </span>
          <span className="text-sm font-medium text-foreground">
            {prevDoc.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {nextDoc ? (
        <Link
          to="/docs/$"
          params={{ _splat: nextDoc.slug }}
          className="group flex flex-1 flex-col items-end gap-1 rounded-lg border border-border p-3 text-right no-underline transition-colors hover:bg-accent/60"
        >
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            Next <ArrowRightIcon aria-hidden className="size-3" />
          </span>
          <span className="text-sm font-medium text-foreground">
            {nextDoc.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}

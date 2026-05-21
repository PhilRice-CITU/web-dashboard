import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

export function DocCard({
  title,
  slug,
  children,
}: {
  title: string
  /** Doc slug, e.g. "using-the-dashboard/results". */
  slug: string
  children: ReactNode
}) {
  return (
    <Link
      to="/docs/$"
      params={{ _splat: slug }}
      className="group flex flex-col gap-1.5 rounded-lg border border-border p-4 no-underline transition-colors hover:bg-accent/60"
    >
      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        {title}
        <ArrowRightIcon className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="text-[13px] leading-snug text-muted-foreground">
        {children}
      </span>
    </Link>
  )
}

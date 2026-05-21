import { Link, useRouterState } from '@tanstack/react-router'
import { ArrowLeftIcon, SearchIcon } from 'lucide-react'
import { cn } from '#/shared/lib/utils'
import { docsNav } from '../docs.config'
import { getDoc } from '../lib/docs-registry'
import { DocsThemeToggle } from './DocsThemeToggle'

/** The current doc slug from the URL (/docs/<slug>), or '' at /docs. */
function useCurrentSlug(): string {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return pathname.replace(/^\/docs\/?/, '')
}

export function DocsSidebar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const currentSlug = useCurrentSlug()

  return (
    <aside className="flex flex-col gap-1 px-3 py-4">
      {/* brand + theme toggle */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo-icon.svg" alt="hum.ai" className="size-6" />
          <div className="leading-tight">
            <div className="text-sm font-bold text-foreground">hum.ai</div>
            <div className="text-[10px] text-muted-foreground">
              Rice Analytics
            </div>
          </div>
        </div>
        <DocsThemeToggle />
      </div>

      {/* back to dashboard */}
      <a
        href="/results"
        className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon aria-hidden className="size-3.5" />
        Back to Dashboard
      </a>

      {/* search trigger */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Search docs"
        className="mb-3 flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/60"
      >
        <SearchIcon aria-hidden className="size-3.5" />
        <span>Search docs</span>
        <kbd className="ml-auto rounded border border-border px-1 text-[10px]">
          ⌘K
        </kbd>
      </button>

      {/* nav groups */}
      <nav aria-label="Documentation" className="flex flex-col gap-4">
        {docsNav.map((section) => (
          <div key={section.label}>
            <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {section.label}
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((slug) => {
                const doc = getDoc(slug)
                const active = slug === currentSlug
                return (
                  <li key={slug}>
                    <Link
                      to="/docs/$"
                      params={{ _splat: slug }}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-[13px] transition-colors',
                        active
                          ? 'bg-accent font-medium text-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {doc?.title ?? slug}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

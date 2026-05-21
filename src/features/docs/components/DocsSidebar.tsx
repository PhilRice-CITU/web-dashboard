import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ArrowLeftIcon, ChevronDownIcon, SearchIcon } from 'lucide-react'
import { cn } from '#/shared/lib/utils'
import { docsNav, getSectionLabel } from '../docs.config'
import { getDoc } from '../lib/docs-registry'
import { DocsThemeToggle } from './DocsThemeToggle'

/** The current doc slug from the URL (/docs/<slug>), or '' at /docs. */
function useCurrentSlug(): string {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return pathname.replace(/^\/docs\/?/, '')
}

export function DocsSidebar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const currentSlug = useCurrentSlug()

  // The nav group holding the current page — falls back to the first group
  // at the /docs index, where no slug matches a section.
  const currentSection = getSectionLabel(currentSlug) ?? docsNav[0].label

  // One group expanded at a time; the current page's group opens by default.
  const [openSection, setOpenSection] = useState(currentSection)

  // Follow navigation: opening the group of whichever page you land on.
  useEffect(() => {
    setOpenSection(currentSection)
  }, [currentSection])

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

      {/* nav groups — one expanded at a time */}
      <nav aria-label="Documentation" className="flex flex-col gap-0.5">
        {docsNav.map((section) => {
          const open = openSection === section.label
          return (
            <div key={section.label}>
              <button
                type="button"
                onClick={() => setOpenSection(open ? '' : section.label)}
                aria-expanded={open}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                <span>{section.label}</span>
                <ChevronDownIcon
                  aria-hidden
                  className={cn(
                    'size-3 transition-transform',
                    !open && '-rotate-90',
                  )}
                />
              </button>
              {open && (
                <ul className="mt-0.5 flex flex-col gap-0.5">
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
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

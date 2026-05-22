import { useRef, useState } from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { MDXProvider } from '@mdx-js/react'
import { mdxComponents } from './mdx/mdx-components'
import { DocsSidebar } from './DocsSidebar'
import { DocsTOC } from './DocsTOC'
import { DocsSearch } from './DocsSearch'
import { DocsMobileNav } from './DocsMobileNav'
import { useTableOfContents } from '../hooks/useTableOfContents'

export function DocsLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Re-extract the TOC whenever the route (doc page) changes.
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { items, activeId } = useTableOfContents(contentRef, [pathname])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DocsMobileNav onOpenSearch={() => setSearchOpen(true)} />
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 lg:grid-cols-[226px_minmax(0,1fr)] xl:grid-cols-[226px_minmax(0,1fr)_196px]">
        {/* left nav */}
        <div className="hidden lg:block">
          <div className="hide-scrollbar sticky top-0 max-h-screen overflow-y-auto">
            <DocsSidebar onOpenSearch={() => setSearchOpen(true)} />
          </div>
        </div>

        {/* content */}
        <main className="flex justify-center px-6 py-9 sm:px-8">
          <div ref={contentRef} className="w-full max-w-[580px]">
            <MDXProvider components={mdxComponents}>
              <Outlet />
            </MDXProvider>
          </div>
        </main>

        {/* right toc */}
        <DocsTOC items={items} activeId={activeId} />
      </div>

      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '#/shared/components/ui/dialog'
import { Input } from '#/shared/components/ui/input'
import { buildSearchIndex, searchDocs } from '../lib/docs-search'

export function DocsSearch({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const index = useMemo(() => buildSearchIndex(), [])
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchDocs(index, query), [index, query])

  // Open/close on Cmd/Ctrl+K from anywhere in the docs.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  function go(slug: string) {
    onOpenChange(false)
    setQuery('')
    navigate({ to: '/docs/$', params: { _splat: slug } })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Search documentation</DialogTitle>

        <div className="flex items-center gap-2 border-b border-border px-3">
          <SearchIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) go(results[0].slug)
            }}
            placeholder="Search documentation…"
            className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found.
            </li>
          ) : (
            results.map((entry) => (
              <li key={entry.slug}>
                <button
                  type="button"
                  onClick={() => go(entry.slug)}
                  className="flex w-full flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
                >
                  <span className="text-sm text-foreground">{entry.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {entry.section}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

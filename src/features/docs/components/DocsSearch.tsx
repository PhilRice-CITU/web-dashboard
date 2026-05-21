import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/shared/components/ui/command'
import { buildSearchIndex } from '../lib/docs-search'

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

  // Open on Cmd/Ctrl+K from anywhere in the docs.
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
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search documentation…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {index.map((entry) => (
            <CommandItem
              key={entry.slug}
              value={`${entry.title} ${entry.description} ${entry.section}`}
              onSelect={() => go(entry.slug)}
            >
              <div className="flex flex-col">
                <span className="text-sm">{entry.title}</span>
                <span className="text-xs text-muted-foreground">
                  {entry.section}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

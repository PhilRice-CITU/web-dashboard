import { cn } from '#/shared/lib/utils'
import type { TocItem } from '../types'

export function DocsTOC({
  items,
  activeId,
}: {
  items: TocItem[]
  activeId: string | null
}) {
  if (items.length === 0) return <aside className="hidden xl:block" />

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-10 px-4 py-9">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block py-1 text-[13px] leading-snug transition-colors',
                  item.level === 3 && 'pl-3',
                  activeId === item.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

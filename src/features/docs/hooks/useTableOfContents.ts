import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import type { TocItem } from '../types'

/**
 * Extracts h2/h3 headings from a rendered content container and tracks the
 * heading currently in view (scroll-spy). `deps` re-runs extraction when the
 * page changes (pass the current slug).
 */
export function useTableOfContents(
  containerRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
): { items: TocItem[]; activeId: string | null } {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Collect headings whenever the content changes.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const headings = [...el.querySelectorAll('h2, h3')].filter(
      (h): h is HTMLHeadingElement => h.id !== '',
    )
    setItems(
      headings.map((h) => ({
        id: h.id,
        text: (h.textContent as string | null) ?? '',
        level: h.tagName === 'H2' ? 2 : 3,
      })),
    )
    setActiveId(headings[0]?.id ?? null)
    // deps array is intentional — re-run when the page/slug changes
  }, deps)

  // Scroll-spy: highlight the top-most heading currently on screen.
  useEffect(() => {
    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    )
    for (const item of items) {
      const node = document.getElementById(item.id)
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [items])

  return { items, activeId }
}

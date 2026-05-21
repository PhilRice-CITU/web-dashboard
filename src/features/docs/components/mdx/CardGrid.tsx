import type { ReactNode } from 'react'

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
  )
}

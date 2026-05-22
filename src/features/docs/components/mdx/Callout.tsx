import type { ReactNode } from 'react'
import { InfoIcon } from 'lucide-react'

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-5 flex gap-3 rounded-md border border-border border-l-[3px] border-l-foreground/40 bg-accent/60 px-4 py-3 text-sm text-muted-foreground">
      <InfoIcon className="mt-0.5 size-4 shrink-0 text-foreground/70" />
      <div className="[&>p]:m-0 [&>p]:leading-relaxed">{children}</div>
    </div>
  )
}

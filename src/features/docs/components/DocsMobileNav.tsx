import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { MenuIcon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/shared/components/ui/sheet'
import { DocsSidebar } from './DocsSidebar'

export function DocsMobileNav({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2">
        <img src="/logo-icon.svg" alt="hum.ai" className="size-6" />
        <span className="text-sm font-bold text-foreground">hum.ai</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Open navigation"
          className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent/60"
        >
          <MenuIcon className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[264px] overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Documentation navigation</SheetTitle>
          </SheetHeader>
          <DocsSidebar onOpenSearch={onOpenSearch} />
        </SheetContent>
      </Sheet>
    </div>
  )
}

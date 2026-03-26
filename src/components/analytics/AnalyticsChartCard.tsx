import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'

import { Button } from '#/components/ui/button'

type AnalyticsChartCardProps = {
  title: string
  subtitle: string
  isEditing?: boolean
  onToggleEdit?: () => void
  controls: ReactNode
  children: ReactNode
}

export function AnalyticsChartCard({
  title,
  subtitle,
  isEditing,
  onToggleEdit,
  controls,
  children,
}: AnalyticsChartCardProps) {
  return (
    <section className="group h-full bg-background p-4 md:p-5">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {onToggleEdit ? (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label={isEditing ? 'Close chart editor' : 'Edit chart'}
              onClick={onToggleEdit}
              className={`size-8 transition-opacity ${
                isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <Pencil className="size-4" />
            </Button>
          ) : null}
        </div>
        {controls}
      </div>
      <div className="pt-4">
        <div className="h-80 w-full">{children}</div>
      </div>
    </section>
  )
}

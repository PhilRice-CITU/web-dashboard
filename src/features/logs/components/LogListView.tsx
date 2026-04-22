import { Badge } from '#/components/ui/badge'
import { getLevelBadgeClassName } from '../mappers/logs.mappers'
import type { LogEvent } from '../types/logs.types'

type Props = {
  events: LogEvent[]
}

export function LogListView({ events }: Props) {
  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div
          key={`${event.device}-${event.time}-${event.message}`}
          className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-background p-3"
        >
          <p className="font-mono text-xs text-muted-foreground">
            {event.time}
          </p>
          <Badge className={getLevelBadgeClassName(event.level)}>
            {event.level}
          </Badge>
          <p className="text-sm font-medium text-foreground">{event.device}</p>
          <p className="text-sm text-muted-foreground">{event.message}</p>
        </div>
      ))}
      {events.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No logs match your search.
        </p>
      )}
    </div>
  )
}

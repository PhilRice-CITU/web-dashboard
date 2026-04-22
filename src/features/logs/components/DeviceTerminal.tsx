import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ExpandIcon } from 'lucide-react'
import type { LogEvent } from '../types/logs.types'

type Props = {
  device: string
  events: LogEvent[]
  onExpand: () => void
}

export function DeviceTerminal({ device, events, onExpand }: Props) {
  const newestFirstEvents = [...events].sort(
    (left, right) => right.createdAt - left.createdAt,
  )
  const collapsedTerminalEvents = [...newestFirstEvents.slice(0, 12)].reverse()

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <p className="font-mono text-xs text-foreground">{device}</p>
          <Badge variant="outline" className="font-mono text-[11px]">
            {events.length} logs
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={onExpand}>
          <ExpandIcon className="mr-1 size-3.5" />
          Expand
        </Button>
      </div>
      <div className="h-full overflow-auto bg-zinc-950 p-3 font-mono text-[11px] leading-5 text-zinc-200">
        {collapsedTerminalEvents.map((event) => (
          <p
            key={`${event.time}-${event.message}`}
            className="wrap-break-word pb-1"
          >
            <span className="text-zinc-400">[{event.time}]</span>{' '}
            <span className="text-zinc-300">[{event.level}]</span>{' '}
            <span className="text-zinc-100">{event.message}</span>
          </p>
        ))}
      </div>
    </div>
  )
}

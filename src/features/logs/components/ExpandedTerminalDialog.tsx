import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import type { LogEvent } from '../types/logs.types'

type Props = {
  device: string | null
  events: LogEvent[]
  onClose: () => void
}

export function ExpandedTerminalDialog({ device, events, onClose }: Props) {
  return (
    <Dialog
      open={Boolean(device)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="w-[94vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Terminal Logs • {device}</DialogTitle>
          <DialogDescription>
            Full, scrollable log stream for selected device.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[calc(100vh-10rem)] overflow-auto rounded-md border border-border bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-200 m-2 mt-0">
          {events.map((event) => (
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
      </DialogContent>
    </Dialog>
  )
}

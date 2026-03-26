import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Download,
  ExpandIcon,
  LayoutGrid,
  List,
  Search,
} from 'lucide-react'

import { PlatformShell } from '#/components/layout/PlatformShell'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

type EventLevel = 'INFO' | 'WARN' | 'ERROR'

interface LogEvent {
  time: string
  device: string
  level: EventLevel
  message: string
}

const mockEvents: LogEvent[] = [
  {
    time: '10:41:12',
    device: 'IS-03',
    level: 'WARN',
    message: 'Moisture threshold exceeded (14.7%)',
  },
  {
    time: '10:39:58',
    device: 'NE-01',
    level: 'INFO',
    message: 'Heartbeat received, queue depth 0',
  },
  {
    time: '10:38:21',
    device: 'DV-05',
    level: 'ERROR',
    message: 'Camera timeout during capture stage',
  },
  {
    time: '10:37:42',
    device: 'BO-02',
    level: 'INFO',
    message: 'Upload complete for batch PR-2026-314',
  },
  {
    time: '10:36:30',
    device: 'IS-03',
    level: 'INFO',
    message: 'LED profile switched to blue-enhanced mode',
  },
  {
    time: '10:35:56',
    device: 'NE-01',
    level: 'INFO',
    message: 'Capture queue flushed after successful retry',
  },
  {
    time: '10:35:11',
    device: 'DV-05',
    level: 'WARN',
    message: 'Camera reconnect succeeded on second attempt',
  },
  {
    time: '10:34:48',
    device: 'BO-02',
    level: 'INFO',
    message: 'Analysis started for lot PR-2026-315',
  },
  {
    time: '10:33:54',
    device: 'IS-03',
    level: 'WARN',
    message: 'Upload latency above 4s threshold',
  },
  {
    time: '10:33:09',
    device: 'NE-01',
    level: 'INFO',
    message: 'Heartbeat received, queue depth 1',
  },
  {
    time: '10:32:41',
    device: 'DV-05',
    level: 'INFO',
    message: 'Storage cleanup removed 12 old temp files',
  },
  {
    time: '10:31:55',
    device: 'BO-02',
    level: 'WARN',
    message: 'Moisture trend rising for intake lane B',
  },
  {
    time: '10:31:20',
    device: 'IS-03',
    level: 'INFO',
    message: 'Model checksum verified (edge-client v0.4.2)',
  },
  {
    time: '10:30:58',
    device: 'NE-01',
    level: 'INFO',
    message: 'Camera calibration profile loaded',
  },
  {
    time: '10:30:14',
    device: 'DV-05',
    level: 'ERROR',
    message: 'Capture aborted due to invalid frame sync',
  },
  {
    time: '10:29:48',
    device: 'BO-02',
    level: 'INFO',
    message: 'Upload route switched to backup endpoint',
  },
  {
    time: '10:29:02',
    device: 'IS-03',
    level: 'INFO',
    message: 'Queue depth returned to zero',
  },
  {
    time: '10:28:26',
    device: 'NE-01',
    level: 'WARN',
    message: 'CPU temperature approaching threshold (74C)',
  },
  {
    time: '10:27:39',
    device: 'DV-05',
    level: 'INFO',
    message: 'Camera warmup complete; ready for trigger',
  },
  {
    time: '10:27:01',
    device: 'BO-02',
    level: 'INFO',
    message: 'Batch metadata synced to API server',
  },
]

export function LogsPage() {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')
  const [expandedTerminalDevice, setExpandedTerminalDevice] = useState<
    string | null
  >(null)

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return mockEvents
    }

    return mockEvents.filter((event) =>
      `${event.device} ${event.level} ${event.message} ${event.time}`
        .toLowerCase()
        .includes(query),
    )
  }, [search])

  const deviceGroups = useMemo(() => {
    const grouped = filteredEvents.reduce<Record<string, LogEvent[]>>(
      (accumulator, event) => {
        accumulator[event.device] ??= []
        accumulator[event.device].push(event)
        return accumulator
      },
      {},
    )

    return Object.entries(grouped).map(([device, events]) => ({
      device,
      events,
    }))
  }, [filteredEvents])

  return (
    <PlatformShell
      title="Logs & Audit"
      description="Investigate device events, command outcomes, and system errors."
      actions={
        <>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 size-4" />
            Export Logs
          </Button>
          <Sheet>
            <SheetTrigger
              render={<Button size="sm" />}
              className="h-9 bg-logo-color"
            >
              <AlertTriangle className="mr-2 size-4" />
              Incident Review
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Incident Review</SheetTitle>
                <SheetDescription>
                  Link the incident to a device and add action notes for the
                  team.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <Input placeholder="Incident ID (e.g. INC-1042)" />
                <Input placeholder="Assigned responder" />
                <Input placeholder="Mitigation action" />
              </div>
              <SheetFooter>
                <Button>Save Incident Note</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      }
    >
      <section className="overflow-hidden border-b border-border">
        <div className="border-b border-border p-4 md:p-5">
          <h2 className="text-base font-semibold">Event Stream</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Near real-time events from edge devices and backend services.
          </p>
        </div>

        <div className="p-4 md:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by device, level, or message..."
              className="min-w-56 flex-1"
            />
            <Button variant="outline" size="sm" className="h-8.5">
              <Search className="mr-2 size-4" />
              Search
            </Button>
            <div className="ml-auto inline-flex rounded-md border border-border bg-background p-0.5">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-7"
              >
                <List className="mr-2 size-4" />
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-7"
              >
                <LayoutGrid className="mr-2 size-4" />
                Grid
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-2">
              {filteredEvents.map((event) => (
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
                  <p className="text-sm font-medium text-foreground">
                    {event.device}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.message}
                  </p>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No logs match your search.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {deviceGroups.map((group) => (
                  <div
                    key={group.device}
                    className="min-h-72 overflow-hidden rounded-lg border border-border bg-muted/20 lg:min-h-88"
                  >
                    <DeviceTerminal
                      device={group.device}
                      events={group.events}
                      onExpand={() => setExpandedTerminalDevice(group.device)}
                    />
                  </div>
                ))}
              </div>
              {deviceGroups.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No device logs to display.
                </p>
              )}
            </div>
          )}
        </div>

        {expandedTerminalDevice ? (
          <Dialog
            open={Boolean(expandedTerminalDevice)}
            onOpenChange={(open) => {
              if (!open) {
                setExpandedTerminalDevice(null)
              }
            }}
          >
            <DialogContent className="w-[94vw] max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  Terminal Logs • {expandedTerminalDevice}
                </DialogTitle>
                <DialogDescription>
                  Full, scrollable log stream for selected device.
                </DialogDescription>
              </DialogHeader>
              <div className="h-[calc(100vh-10rem)] overflow-auto rounded-md border border-border bg-zinc-950 p-3 font-mono text-xs leading-5 text-zinc-200 m-2 mt-0">
                {(
                  deviceGroups.find(
                    (entry) => entry.device === expandedTerminalDevice,
                  )?.events ?? []
                ).map((event) => (
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
        ) : null}
      </section>
    </PlatformShell>
  )
}

function getLevelBadgeClassName(level: EventLevel) {
  if (level === 'ERROR') {
    return 'bg-rose-500/15 text-rose-700'
  }

  if (level === 'WARN') {
    return 'bg-amber-500/15 text-amber-700'
  }

  return 'bg-sky-500/15 text-sky-700'
}

function DeviceTerminal({
  device,
  events,
  onExpand,
}: {
  device: string
  events: LogEvent[]
  onExpand: () => void
}) {
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
    </div>
  )
}

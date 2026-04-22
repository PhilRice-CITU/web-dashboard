import { AlertTriangle, Download } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { PlatformShell } from '#/components/layout/PlatformShell'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

import { useLogsData } from '#/features/logs/hooks/useLogsData'
import { useLogsFilter } from '#/features/logs/hooks/useLogsFilter'
import { LogsToolbar } from '#/features/logs/components/LogsToolbar'
import { LogListView } from '#/features/logs/components/LogListView'
import { LogGridView } from '#/features/logs/components/LogGridView'
import { ExpandedTerminalDialog } from '#/features/logs/components/ExpandedTerminalDialog'

export function LogsPage() {
  const { liveEvents, isEventsLoading, eventsError, refetch } = useLogsData()
  const {
    search,
    setSearch,
    viewMode,
    setViewMode,
    expandedTerminalDevice,
    setExpandedTerminalDevice,
    filteredEvents,
    deviceGroups,
  } = useLogsFilter(liveEvents)

  const expandedDeviceEvents =
    deviceGroups.find((g) => g.device === expandedTerminalDevice)?.events ?? []

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
            Polling-based event stream from edge devices and backend services.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Stream: polling (15s)
          </p>
        </div>

        <div className="p-4 md:p-5">
          <LogsToolbar
            search={search}
            onSearch={setSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onRefetch={refetch}
          />

          {eventsError && (
            <div className="mb-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Failed to load events from API.
            </div>
          )}
          {isEventsLoading && (
            <div className="mb-3 rounded-md border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
              Loading event stream...
            </div>
          )}

          {viewMode === 'list' ? (
            <LogListView events={filteredEvents} />
          ) : (
            <LogGridView
              groups={deviceGroups}
              onExpand={setExpandedTerminalDevice}
            />
          )}
        </div>

        <ExpandedTerminalDialog
          device={expandedTerminalDevice}
          events={expandedDeviceEvents}
          onClose={() => setExpandedTerminalDevice(null)}
        />
      </section>
    </PlatformShell>
  )
}

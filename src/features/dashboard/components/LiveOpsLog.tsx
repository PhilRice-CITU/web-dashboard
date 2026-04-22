import type { LiveSignal } from '../types/dashboard.types'
import { getSignalBadgeClass } from '../mappers/dashboard.mappers'

type Props = {
  signals: LiveSignal[]
}

function SignalRow({ signal }: { signal: LiveSignal }) {
  return (
    <div className="space-y-0 border-b border-border py-3 last:border-b-0 px-5">
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className={getSignalBadgeClass(signal.level)}>
          {signal.level.toUpperCase()}
        </div>
        <p className="text-xs text-muted-foreground">{signal.timestamp}</p>
      </div>
      <p className="text-lg font-semibold tracking-tight text-foreground">
        {signal.title}
      </p>
      <p className="text-sm text-muted-foreground">{signal.detail}</p>
    </div>
  )
}

export function LiveOpsLog({ signals }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border px-6 py-4 md:px-5">
        <h2 className="text-base font-semibold">Live operations log</h2>
        <p className="text-sm text-muted-foreground">Real-time</p>
      </div>
      <div className="hide-scrollbar h-full overflow-y-auto">
        <div className="space-y-1 py-2">
          {signals.length > 0 ? (
            signals.map((signal) => (
              <SignalRow
                key={`${signal.title}-${signal.timestamp}`}
                signal={signal}
              />
            ))
          ) : (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              No live events yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

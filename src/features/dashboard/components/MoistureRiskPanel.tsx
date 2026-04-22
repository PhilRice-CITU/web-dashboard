import type { MoistureEntry } from '../types/dashboard.types'

type Props = {
  entries: MoistureEntry[]
}

function MoistureRow({ site, moisture, delta, severity }: MoistureEntry) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-medium text-foreground">{site}</p>
        <div className="flex items-center gap-3">
          <p className="font-mono text-base font-semibold text-foreground">
            {moisture}
          </p>
          <p
            className={`w-14 text-right text-sm ${
              severity === 'warn' ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {delta}
          </p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-muted">
        <div
          className={
            severity === 'warn'
              ? 'h-full bg-rose-500/70'
              : 'h-full bg-emerald-600/70'
          }
          style={{
            width: `${Math.min(Math.round(Number.parseFloat(moisture) * 6), 100)}%`,
          }}
        />
      </div>
    </div>
  )
}

export function MoistureRiskPanel({ entries }: Props) {
  return (
    <div className="p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Moisture risk watch</h2>
        <p className="text-sm text-muted-foreground">SLO 14.0%</p>
      </div>
      <div className="space-y-3">
        {entries.length > 0 ? (
          entries.map((item) => <MoistureRow key={item.site} {...item} />)
        ) : (
          <p className="text-sm text-muted-foreground">
            No moisture trend data available yet.
          </p>
        )}
      </div>
    </div>
  )
}

import { PNS_GRADE_ORDER, pnsGradeShortLabel } from '#/shared/lib/pnsGrade'
import { useDeviceAnalytics } from '../hooks/useDeviceAnalytics'

type Props = { deviceId: string; lastScanAt: string | null }

export function DeviceStatsRow({ deviceId, lastScanAt }: Props) {
  const { data, isLoading } = useDeviceAnalytics(deviceId)

  const total = data?.total_samples ?? 0
  const counts = data?.grade_counts ?? {}
  const grades = PNS_GRADE_ORDER.map((grade) => ({
    label: pnsGradeShortLabel(grade),
    count: counts[grade] ?? 0,
  }))

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <StatCard label="Total Scans" value={isLoading ? '—' : String(total)} />
      <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-5">
        <span className="text-sm text-muted-foreground">
          Grade Distribution
        </span>
        <div className="flex items-end justify-between gap-2 pt-1">
          {grades.map((g) => (
            <div key={g.label} className="flex flex-col items-center">
              <span className="font-mono text-xl font-semibold">
                {isLoading ? '—' : g.count}
              </span>
              <span className="text-xs text-muted-foreground">{g.label}</span>
            </div>
          ))}
        </div>
      </div>
      <StatCard
        label="Last Scan"
        value={lastScanAt ? new Date(lastScanAt).toLocaleString() : 'Never'}
      />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold">{value}</p>
    </div>
  )
}

import { Badge } from '#/shared/components/ui/badge'
import type { ApiResult } from '#/shared/api/contracts'

type Props = { result: ApiResult }

export function GradingBreakdown({ result }: Props) {
  const m = result.metrics
  const params = m.parameters ?? {}

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {m.rawGrade ?? '—'}
          </h2>
          {m.qualityGrade && (
            <Badge variant="secondary">Quality {m.qualityGrade}</Badge>
          )}
          {m.gradeOverridden && <Badge variant="destructive">Overridden</Badge>}
          {result.stub_mode && <Badge variant="outline">Stub model</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          Limiting factor:{' '}
          <span className="font-mono">{m.limitingFactor ?? '—'}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Total grains: {m.totalGrains ?? 0} • Size class:{' '}
          <span className="font-mono">{m.grainSizeClass ?? '—'}</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {(m.foreignCount ?? 0) > 0 && (
            <Badge variant="outline">
              Foreign objects detected: {m.foreignCount}
            </Badge>
          )}
          {(m.paddyCount ?? 0) > 0 && (
            <Badge variant="outline">
              Paddy grains detected: {m.paddyCount}
            </Badge>
          )}
        </div>
      </header>

      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="py-1 font-medium">Parameter</th>
            <th className="py-1 text-right font-medium">Value</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {Object.entries(params).map(([key, value]) => (
            <tr key={key} className="border-t border-border/50">
              <td className="py-1">{key}</td>
              <td className="py-1 text-right">
                {typeof value === 'number'
                  ? `${value.toFixed(2)}%`
                  : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

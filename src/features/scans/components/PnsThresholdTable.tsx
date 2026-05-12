import { cn } from '#/shared/lib/utils'
import type { ApiResultMetrics, PnsGradeName } from '#/shared/api/contracts'
import {
  PARAMETER_ORDER,
  GRADE_THRESHOLDS,
  PARAM_LABEL,
  PARAM_KEY,
} from '../constants/pns-thresholds'

type Props = {
  metrics: ApiResultMetrics
}

export function PnsThresholdTable({ metrics }: Props) {
  const qualityGrade = (metrics.qualityGrade ?? metrics.rawGrade) as
    | PnsGradeName
    | undefined
  const limitingFactor = metrics.limitingFactor ?? ''

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">PNS/BAFS 290:2025 thresholds</h3>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Parameter</th>
              <th className="px-3 py-2 text-right font-medium">Your value</th>
              <th className="px-3 py-2 text-right font-medium">Premium ≤</th>
              <th className="px-3 py-2 text-right font-medium">Grade 1 ≤</th>
              <th className="px-3 py-2 text-right font-medium">Grade 2 ≤</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PARAMETER_ORDER.map((param) => {
              const metricKey = PARAM_KEY[param] as keyof ApiResultMetrics
              const value = metrics[metricKey] as number | undefined
              const isLimiting = limitingFactor.toLowerCase().includes(param)
              const exceedsPremium =
                value !== undefined &&
                value > GRADE_THRESHOLDS['Premium'][param]

              return (
                <tr
                  key={param}
                  className={cn(isLimiting && 'bg-destructive/5')}
                >
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        'font-medium',
                        isLimiting && 'text-destructive',
                      )}
                    >
                      {PARAM_LABEL[param]}
                    </span>
                    {isLimiting && (
                      <span className="ml-1 text-[10px] text-destructive">
                        ← limiting
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      'px-3 py-2 text-right font-mono',
                      exceedsPremium
                        ? 'font-semibold text-destructive'
                        : 'text-foreground',
                    )}
                  >
                    {value !== undefined ? `${value.toFixed(2)}%` : '—'}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                    {GRADE_THRESHOLDS['Premium'][param]}%
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                    {GRADE_THRESHOLDS['Grade no. 1'][param]}%
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                    {GRADE_THRESHOLDS['Grade no. 2'][param]}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {qualityGrade && (
        <p className="text-xs text-muted-foreground">
          Assigned grade: <span className="font-semibold">{qualityGrade}</span>
        </p>
      )}
    </div>
  )
}

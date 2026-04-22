import type { RiceGrade } from '../types/dashboard.types'

type Props = {
  grades: RiceGrade[]
}

function RiceRow({ name, value, share, status }: RiceGrade) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-base font-medium text-foreground">{name}</p>
        <div className="flex items-center gap-3">
          <p className="font-mono text-base font-semibold text-foreground">
            {value}
          </p>
          <p className="w-14 text-right text-sm text-muted-foreground">
            {share}%
          </p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-muted">
        <div
          className={`h-full ${
            status === 'positive' ? 'bg-emerald-600/70' : 'bg-amber-500/70'
          }`}
          style={{ width: `${share}%` }}
        />
      </div>
    </div>
  )
}

export function RiceGradePanel({ grades }: Props) {
  return (
    <div className="border-b border-border p-4 md:p-5 xl:border-r xl:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Rice grade distribution</h2>
        <p className="text-sm text-muted-foreground">Top lots</p>
      </div>
      <div className="space-y-3">
        {grades.map((grade) => (
          <RiceRow key={grade.name} {...grade} />
        ))}
      </div>
    </div>
  )
}

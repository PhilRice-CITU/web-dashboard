import { Badge } from '#/shared/components/ui/badge'
import type { PnsGradeName } from '#/shared/api/contracts'

const GRADE_VARIANT: Record<
  PnsGradeName,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  Premium: 'default',
  'Grade no. 1': 'secondary',
  'Grade no. 2': 'secondary',
  'Grade no. 3': 'outline',
  'Grade no. 4': 'outline',
  'Grade no. 5': 'outline',
  'Off-Grade': 'destructive',
}

type Props = {
  grade: string | undefined | null
  overridden?: boolean
}

export function GradeBadge({ grade, overridden }: Props) {
  if (!grade) return <Badge variant="outline">—</Badge>
  const variant =
    (GRADE_VARIANT as Record<string, (typeof GRADE_VARIANT)[PnsGradeName]>)[
      grade
    ] ?? 'outline'
  return (
    <span className="flex items-center gap-1">
      <Badge variant={variant}>{grade}</Badge>
      {overridden && (
        <Badge variant="destructive" className="text-[10px]">
          overridden
        </Badge>
      )}
    </span>
  )
}

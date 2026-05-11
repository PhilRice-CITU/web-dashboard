import type { PnsGradeName } from '#/shared/api/contracts'

export const PNS_GRADE_ORDER: PnsGradeName[] = [
  'Premium',
  'Grade no. 1',
  'Grade no. 2',
  'Grade no. 3',
  'Grade no. 4',
  'Grade no. 5',
  'Off-Grade',
]

const POSITIVE_GRADES = new Set<PnsGradeName>([
  'Premium',
  'Grade no. 1',
  'Grade no. 2',
])

/** Short display label: 'Premium' | '1' | '2' | '3' | '4' | '5' | 'Off-Grade'. */
export function pnsGradeShortLabel(grade: string): string {
  if (grade === 'Premium' || grade === 'Off-Grade') return grade
  const match = /^Grade no\.\s*(\d+)$/.exec(grade)
  return match ? match[1] : grade
}

export function isPositivePnsGrade(grade: string): boolean {
  return POSITIVE_GRADES.has(grade as PnsGradeName)
}

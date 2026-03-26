export type RiceGrade = 'A' | 'B' | 'C' | 'D'

export type GrainLengthClass = 'short' | 'medium' | 'long' | 'very-long'

export interface RiceQualityInput {
  brokenGrainsPercentage: number
  foreignMatterPercentage: number
  chalkinessPercentage: number
  discolorationPercentage: number
  moisturePercentage: number
  grainLengthClass: GrainLengthClass
  grainLengthMm?: number
}

export interface RiceQualityScore {
  totalScore: number
  grade: RiceGrade
  normalized: {
    broken: number
    foreignMatter: number
    chalkiness: number
    discoloration: number
    moisture: number
    length: number
  }
}

const WEIGHTS = {
  chalkiness: 0.35,
  broken: 0.3,
  foreignMatter: 0.2,
  length: 0.15,
} as const

const MAX_PENALTIES = {
  moisture: 8,
  discoloration: 6,
} as const

function clamp(value: number, min = 0, max = 100) {
  if (!Number.isFinite(value)) {
    return min
  }

  return Math.min(Math.max(value, min), max)
}

function inverseNormalize(value: number, ideal: number, worst: number) {
  const safeValue = Number.isFinite(value) ? value : worst

  if (safeValue <= ideal) {
    return 100
  }

  if (safeValue >= worst) {
    return 0
  }

  const ratio = (safeValue - ideal) / (worst - ideal)
  return clamp((1 - ratio) * 100)
}

function getLengthClassScore(lengthClass: GrainLengthClass) {
  switch (lengthClass) {
    case 'very-long':
      return 100
    case 'long':
      return 92
    case 'medium':
      return 78
    case 'short':
      return 62
    default:
      return 62
  }
}

function moisturePenalty(moisturePercentage: number) {
  if (!Number.isFinite(moisturePercentage)) {
    return MAX_PENALTIES.moisture
  }

  if (moisturePercentage <= 14 && moisturePercentage >= 11) {
    return 0
  }

  if (moisturePercentage > 14) {
    return clamp((moisturePercentage - 14) * 3.2, 0, MAX_PENALTIES.moisture)
  }

  return clamp((11 - moisturePercentage) * 1.4, 0, 4)
}

function discolorationPenalty(discolorationPercentage: number) {
  if (!Number.isFinite(discolorationPercentage)) {
    return MAX_PENALTIES.discoloration
  }

  if (discolorationPercentage <= 1) {
    return 0
  }

  return clamp(
    (discolorationPercentage - 1) * 0.9,
    0,
    MAX_PENALTIES.discoloration,
  )
}

export function getGradeFromScore(score: number): RiceGrade {
  if (score >= 85) {
    return 'A'
  }

  if (score >= 70) {
    return 'B'
  }

  if (score >= 55) {
    return 'C'
  }

  return 'D'
}

export function computeRiceQualityScore(
  input: RiceQualityInput,
): RiceQualityScore {
  const normalized = {
    broken: inverseNormalize(input.brokenGrainsPercentage, 5, 40),
    foreignMatter: inverseNormalize(input.foreignMatterPercentage, 0.2, 2),
    chalkiness: inverseNormalize(input.chalkinessPercentage, 5, 30),
    discoloration: inverseNormalize(input.discolorationPercentage, 1, 12),
    moisture: inverseNormalize(Math.abs(input.moisturePercentage - 12.5), 0, 4),
    length: getLengthClassScore(input.grainLengthClass),
  }

  const weightedBaseScore =
    normalized.chalkiness * WEIGHTS.chalkiness +
    normalized.broken * WEIGHTS.broken +
    normalized.foreignMatter * WEIGHTS.foreignMatter +
    normalized.length * WEIGHTS.length

  const scoreAfterPenalties =
    weightedBaseScore -
    moisturePenalty(input.moisturePercentage) -
    discolorationPenalty(input.discolorationPercentage)

  const totalScore = Number(clamp(scoreAfterPenalties).toFixed(2))

  return {
    totalScore,
    grade: getGradeFromScore(totalScore),
    normalized,
  }
}

export function getLengthContribution(lengthClass: GrainLengthClass) {
  return getLengthClassScore(lengthClass)
}

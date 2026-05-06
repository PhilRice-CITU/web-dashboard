import { describe, expect, it } from 'vitest'

import {
  computeRiceQualityScore,
  getGradeFromScore,
  getLengthContribution,
} from '#/shared/lib/scoring/riceQuality'

describe('rice quality scoring', () => {
  it('returns an A score for strong quality metrics', () => {
    const result = computeRiceQualityScore({
      brokenGrainsPercentage: 4,
      foreignMatterPercentage: 0.1,
      chalkinessPercentage: 3,
      discolorationPercentage: 0.9,
      moisturePercentage: 12.8,
      grainLengthClass: 'very-long',
      grainLengthMm: 7.5,
    })

    expect(result.totalScore).toBeGreaterThanOrEqual(85)
    expect(result.grade).toBe('A')
  })

  it('returns a D score when all key defects are severe', () => {
    const result = computeRiceQualityScore({
      brokenGrainsPercentage: 41,
      foreignMatterPercentage: 2.3,
      chalkinessPercentage: 32,
      discolorationPercentage: 13,
      moisturePercentage: 16.2,
      grainLengthClass: 'short',
      grainLengthMm: 5.3,
    })

    expect(result.totalScore).toBeLessThan(55)
    expect(result.grade).toBe('D')
  })

  it('applies moisture penalties outside the acceptable range', () => {
    const baseline = computeRiceQualityScore({
      brokenGrainsPercentage: 10,
      foreignMatterPercentage: 0.3,
      chalkinessPercentage: 8,
      discolorationPercentage: 1.2,
      moisturePercentage: 12.5,
      grainLengthClass: 'long',
    })

    const withHighMoisture = computeRiceQualityScore({
      brokenGrainsPercentage: 10,
      foreignMatterPercentage: 0.3,
      chalkinessPercentage: 8,
      discolorationPercentage: 1.2,
      moisturePercentage: 15.4,
      grainLengthClass: 'long',
    })

    expect(withHighMoisture.totalScore).toBeLessThan(baseline.totalScore)
  })

  it('maps grade boundaries deterministically', () => {
    expect(getGradeFromScore(85)).toBe('A')
    expect(getGradeFromScore(84.99)).toBe('B')
    expect(getGradeFromScore(70)).toBe('B')
    expect(getGradeFromScore(69.99)).toBe('C')
    expect(getGradeFromScore(55)).toBe('C')
    expect(getGradeFromScore(54.99)).toBe('D')
  })

  it('handles non-finite inputs by clamping score safely', () => {
    const result = computeRiceQualityScore({
      brokenGrainsPercentage: Number.NaN,
      foreignMatterPercentage: Number.POSITIVE_INFINITY,
      chalkinessPercentage: Number.NaN,
      discolorationPercentage: Number.NaN,
      moisturePercentage: Number.NaN,
      grainLengthClass: 'medium',
    })

    expect(result.totalScore).toBeGreaterThanOrEqual(0)
    expect(result.totalScore).toBeLessThanOrEqual(100)
  })

  it('keeps grain length contribution order predictable', () => {
    expect(getLengthContribution('very-long')).toBeGreaterThan(
      getLengthContribution('long'),
    )
    expect(getLengthContribution('long')).toBeGreaterThan(
      getLengthContribution('medium'),
    )
    expect(getLengthContribution('medium')).toBeGreaterThan(
      getLengthContribution('short'),
    )
  })
})

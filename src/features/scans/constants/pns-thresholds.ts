import type { PnsGradeName } from '#/shared/api/contracts'

export const PARAMETER_ORDER = [
  'broken',
  'brewers',
  'discolored',
  'chalky',
  'red',
] as const

export type GradeParameter = (typeof PARAMETER_ORDER)[number]

export const GRADE_ORDER: PnsGradeName[] = [
  'Premium',
  'Grade no. 1',
  'Grade no. 2',
  'Grade no. 3',
  'Grade no. 4',
  'Grade no. 5',
]

export const GRADE_THRESHOLDS: Record<
  PnsGradeName,
  Record<GradeParameter, number>
> = {
  Premium: {
    broken: 5.0,
    brewers: 0.1,
    discolored: 0.5,
    chalky: 4.0,
    red: 1.0,
  },
  'Grade no. 1': {
    broken: 10.0,
    brewers: 0.2,
    discolored: 0.7,
    chalky: 5.0,
    red: 2.0,
  },
  'Grade no. 2': {
    broken: 15.0,
    brewers: 0.4,
    discolored: 1.0,
    chalky: 7.0,
    red: 4.0,
  },
  'Grade no. 3': {
    broken: 25.0,
    brewers: 0.6,
    discolored: 3.0,
    chalky: 9.0,
    red: 5.0,
  },
  'Grade no. 4': {
    broken: 35.0,
    brewers: 1.0,
    discolored: 5.0,
    chalky: 12.0,
    red: 6.0,
  },
  'Grade no. 5': {
    broken: 45.0,
    brewers: 2.0,
    discolored: 8.0,
    chalky: 15.0,
    red: 7.0,
  },
  'Off-Grade': {
    broken: Infinity,
    brewers: Infinity,
    discolored: Infinity,
    chalky: Infinity,
    red: Infinity,
  },
}

export const PARAM_LABEL: Record<GradeParameter, string> = {
  broken: 'Broken grains',
  brewers: "Brewer's",
  discolored: 'Discolored',
  chalky: 'Chalky',
  red: 'Red kernels',
}

export const PARAM_KEY: Record<GradeParameter, string> = {
  broken: 'brokenGrains',
  brewers: 'brewers',
  discolored: 'discolorationPercentage',
  chalky: 'chalkinessPercentage',
  red: 'redKernelPercentage',
}

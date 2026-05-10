export const GRAIN_CLASSES = [
  'whole_clear',
  'chalky',
  'broken',
  'brewer',
  'damaged',
  'discolored',
  'immature',
  'red_kernel',
  'foreign_matter',
] as const

export type GrainClass = (typeof GRAIN_CLASSES)[number]

export const PNS_GRADES = [
  'Premium',
  'Grade No. 1',
  'Grade No. 2',
  'Grade No. 3',
  'Grade No. 4',
  'Grade No. 5',
  'Off-Grade',
] as const

export type PnsGrade = (typeof PNS_GRADES)[number]

// Hex colors matching the BGR overlay defined in api-server/grading_service.py.
export const CLASS_COLORS: Record<string, string> = {
  whole_clear: '#00C800',
  chalky: '#FFFF00',
  broken: '#FF0000',
  brewer: '#FF6400',
  damaged: '#FFA500',
  discolored: '#B400B4',
  immature: '#C8C8C8',
  red_kernel: '#C80000',
  foreign_matter: '#FFFF00',
}

export const DEFAULT_CLASS_COLOR = '#FFFFFF'

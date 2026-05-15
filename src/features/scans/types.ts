export const VISUAL_CLASSES = [
  'clear',
  'chalky',
  'discolored',
  'red',
  'foreign',
  'paddy',
] as const

export type VisualClass = (typeof VISUAL_CLASSES)[number]

export const DIMENSIONAL_CLASSES = ['whole', 'broken', 'brewers'] as const

export type DimensionalClass = (typeof DIMENSIONAL_CLASSES)[number]

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
export const CLASS_COLORS: Partial<Record<string, string>> = {
  clear: '#3CB371',
  chalky: '#FFAA00',
  broken: '#F44336',
  brewers: '#B45ADC',
  discolored: '#1E965A',
  red: '#DC3C3C',
  paddy: '#13458B',
  foreign: '#808080',
}

export const DEFAULT_CLASS_COLOR = '#FFFFFF'

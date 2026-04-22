import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Deterministic integer in [min, max) derived from a string seed. */
export function seededNumber(seed: string, min: number, max: number): number {
  const hash = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return min + (hash % Math.max(max - min + 1, 1))
}

/** Deterministic lat/lng coordinate derived from a string seed + offset. */
export function seededCoordinate(
  seed: string,
  min: number,
  max: number,
  offset = 0,
): number {
  const value = seededNumber(`${seed}-${offset}`, 0, 10_000)
  const normalized = value / 10_000
  return Number((min + (max - min) * normalized).toFixed(6))
}

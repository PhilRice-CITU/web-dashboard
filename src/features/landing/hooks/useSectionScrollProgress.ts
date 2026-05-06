import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function useSectionScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) {
      return
    }

    let rafId = 0

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.scrollY || window.pageYOffset
      const sectionTop = rect.top + scrollTop
      const sectionBottom = sectionTop + rect.height

      const start = sectionTop - window.innerHeight
      const end = sectionBottom
      const next = (scrollTop - start) / Math.max(1, end - start)

      setProgress(clamp01(next))
    }

    const requestMeasure = () => {
      if (rafId !== 0) {
        return
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        measure()
      })
    }

    measure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
    }
  }, [sectionRef])

  return progress
}

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

type DeviceDisassemblySectionProps = {
  sectionLabel?: string
}

export function DeviceDisassemblySection({
  sectionLabel = 'Temporary 3D Placeholder',
}: DeviceDisassemblySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const progress = useSpring(
    useTransform(scrollYProgress, [0.18, 0.9], [0, 1], { clamp: true }),
    {
      stiffness: 220,
      damping: 30,
      mass: 0.35,
    },
  )

  const easedProgress = useTransform(progress, (value) =>
    reducedMotion ? 0 : clamp01(value),
  )

  const progressLabel = useTransform(easedProgress, (v) => Math.round(v * 100))

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()

    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-[180svh] bg-[#090909] text-white"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6 py-12">
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">
              {sectionLabel}
            </p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Scroll-Linked Device Disassembly Sequence
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              This panel is a placeholder shell prepared for upcoming 3D device
              integration. As scroll progresses, parts separate to simulate an
              exploded view that will later map to real model components.
            </p>
            <motion.p className="text-sm text-white/70">
              Progress: <motion.span>{progressLabel}</motion.span>%
            </motion.p>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative flex h-72">
              <img
                src="/box.png"
                alt="Device placeholder box"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

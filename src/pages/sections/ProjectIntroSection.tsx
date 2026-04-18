import { Suspense, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Clone, Environment, useGLTF } from '@react-three/drei'
import { MathUtils } from 'three'
import type { Group, Material, Mesh, Color } from 'three'

function CursorPlantModel({ scrollProgress }: { scrollProgress: number }) {
  const { scene } = useGLTF('/assets/rice_plant.glb')
  const groupRef = useRef<Group>(null)
  const cursorRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    scene.traverse((object) => {
      const maybeMesh = object as Mesh
      const material = maybeMesh.material as
        | (Material & {
            map?: unknown
            color?: Color
            metalness?: number
            roughness?: number
          })
        | undefined

      if (!material || Array.isArray(material)) {
        return
      }

      if (typeof material.metalness === 'number') {
        material.metalness = 0.06
      }
      if (typeof material.roughness === 'number') {
        material.roughness = 0.86
      }
    })
  }, [scene])

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      cursorRef.current = { x, y }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return
    }

    const targetX = cursorRef.current.x
    const targetY = cursorRef.current.y

    groupRef.current.position.x = MathUtils.damp(
      groupRef.current.position.x,
      1.3 + targetX * 0.35,
      3.6,
      delta,
    )
    groupRef.current.position.y = MathUtils.damp(
      groupRef.current.position.y,
      -2.5 - targetY * 0.22,
      3.6,
      delta,
    )

    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      targetX * 0.45 + (scrollProgress - 0.5) * 0.45,
      3.8,
      delta,
    )
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x,
      0.16 - targetY * 0.12 + scrollProgress * 0.08,
      3.8,
      delta,
    )
  })

  return (
    <group ref={groupRef} scale={0.07}>
      <Clone object={scene} />
    </group>
  )
}

useGLTF.preload('/assets/rice_plant.glb')

export function ProjectIntroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [sectionProgress, setSectionProgress] = useState(0)
  const leftInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const wordSlides = [
    {
      words: 'Real-Time Fleet Status',
      description:
        'Monitor analyzer heartbeat, queue depth, and online status in one clear view.',
    },
    {
      words: 'Standards-Aligned Grading',
      description:
        'Keep output aligned with consistent grading workflows for reliable quality checks.',
    },
    {
      words: 'Auditable Scan Flow',
      description:
        'Trace each scan from capture to result with transparent and reviewable records.',
    },
    {
      words: 'Cross-Site Analytics',
      description:
        'Compare trends between facilities to guide operations, storage, and planning decisions.',
    },
  ]

  const pinnedScreens = wordSlides.length + 1
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const transitionStart = 0.1
  const transitionEnd = 0.9
  const indexProgress = useTransform(
    scrollYProgress,
    [transitionStart, transitionEnd],
    [0, wordSlides.length - 1],
    {
      clamp: true,
    },
  )

  useMotionValueEvent(indexProgress, 'change', (latest) => {
    const next = Math.min(
      wordSlides.length - 1,
      Math.max(0, Math.round(latest)),
    )
    setActiveIndex(next)
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setSectionProgress(Math.min(1, Math.max(0, latest)))
  })

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="relative z-20 bg-white px-6 py-0 text-foreground lg:px-12"
      style={{ minHeight: `${pinnedScreens * 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh items-center">
        <div className="pointer-events-none absolute inset-0">
          <Canvas camera={{ position: [0, 0.2, 5], fov: 42 }}>
            <ambientLight intensity={0.92} />
            <hemisphereLight
              args={['#f8fff0', '#d8e3cf', 0.42]}
              position={[0, 1, 0]}
            />
            <directionalLight position={[4, 6, 3]} intensity={1.1} />
            <directionalLight position={[-3, 4, -2]} intensity={0.42} />
            <Environment preset="sunset" />
            <Suspense fallback={null}>
              <CursorPlantModel scrollProgress={sectionProgress} />
            </Suspense>
          </Canvas>
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-8 pt-24 lg:grid-cols-[1fr_1fr] lg:pt-0">
          <motion.div
            className="flex items-center pt-2 lg:pt-0"
            initial={{ opacity: 0 }}
            animate={leftInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="relative h-70 w-full max-w-2xl sm:h-75">
              <AnimatePresence mode="wait">
                <motion.div
                  key={wordSlides[activeIndex].words}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="absolute inset-0 z-10 flex flex-col items-start justify-center"
                >
                  <h3 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[#0f172a] sm:text-6xl">
                    {wordSlides[activeIndex].words}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {wordSlides[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
}

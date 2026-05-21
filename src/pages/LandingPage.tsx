import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'
import { useSession } from '#/features/auth/hooks/useAuth'
import { HeroRevealSection } from '#/features/landing/sections/HeroRevealSection'
import { ProjectIntroSection } from '#/features/landing/sections/ProjectIntroSection'

export function LandingPage() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const isAuthenticated = !!session
  const [viewportHeight, setViewportHeight] = useState(900)
  const [isTransformed, setIsTransformed] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const syncViewport = () => {
      setViewportHeight(window.innerHeight)
    }

    syncViewport()
    window.addEventListener('resize', syncViewport)
    return () => {
      window.removeEventListener('resize', syncViewport)
    }
  }, [])

  const transformStart = viewportHeight * 0.72
  const transformEnd = viewportHeight * 0.9
  const navSlideProgress = useSpring(
    useTransform(scrollY, [transformStart, transformEnd], [0, 1], {
      clamp: true,
    }),
    {
      stiffness: 260,
      damping: 34,
      mass: 0.3,
    },
  )
  const navRevealProgress = useTransform(navSlideProgress, [0, 1], [1, 0])
  const brandX = useTransform(navSlideProgress, [0, 1], [0, -18])
  const navX = useTransform(navSlideProgress, [0, 1], [0, -88])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsTransformed(latest >= transformEnd)
  })

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    navigate({ to: '/dashboard' })
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-70 p-4 lg:p-6">
        <div className="pointer-events-auto flex items-center justify-between gap-4 lg:w-1/2 p-2 w-1/2">
          {!isTransformed ? (
            <>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-left text-lg font-bold text-primary"
              >
                <span className="inline-flex size-7 items-center justify-center">
                  <img
                    src="/logo-icon.svg"
                    alt="hum.ai logo"
                    className="size-7"
                  />
                </span>
                <span style={{ opacity: navRevealProgress, x: brandX }}>
                  hum.ai
                </span>
              </button>

              <motion.nav
                className="flex items-center gap-5 text-sm [&_a]:text-foreground [&_a]:no-underline [&_a:hover]:text-foreground/70 pr-4"
                style={{ opacity: navRevealProgress, x: navX }}
              >
                <a href="/docs/getting-started/introduction">Documentation</a>
                <a href="https://github.com/One-Team-One-Goal">GitHub</a>
                <a href="/about">About Us</a>
              </motion.nav>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open navigation menu"
                    className="inline-flex items-center justify-center gap-2 bg-transparent p-0 text-primary shadow-none transition"
                  />
                }
              >
                <img src="/logo-icon.svg" alt="hum.ai" className="size-7" />
                <span className="text-lg font-bold text-primary">hum.ai</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-52"
                sideOffset={10}
                align="start"
              >
                <DropdownMenuItem onClick={() => window.location.assign('#')}>
                  Documentation
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      'https://github.com/One-Team-One-Goal',
                      '_blank',
                    )
                  }
                >
                  GitHub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/about' })}>
                  About Us
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <HeroRevealSection onGetStarted={() => navigate({ to: '/login' })} />
      <ProjectIntroSection />
      {/* <DeviceDisassemblySection /> */}

      <section className="relative z-40 bg-[#ededed] text-[#0a0a0a] flex flex-col justify-between">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 pt-64 mt-12 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <p className="text-sm text-black/75">+63 (2) 123-4567</p>
              <a
                href="mailto:yo@hum.ai"
                className="mt-4 block text-4xl font-semibold tracking-tight text-black no-underline hover:text-black/70"
              >
                @hum.ai
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="mb-4 text-black/45">Navigate</p>
                <div className="space-y-2 font-semibold">
                  <a
                    href="#"
                    className="block no-underline hover:text-black/70"
                  >
                    Home
                  </a>
                  <a
                    href="#intro"
                    className="block no-underline hover:text-black/70"
                  >
                    Introduction
                  </a>
                  <a
                    href="#"
                    className="block no-underline hover:text-black/70"
                  >
                    Projects
                  </a>
                  <a
                    href="#"
                    className="block no-underline hover:text-black/70"
                  >
                    Pricing
                  </a>
                  <a
                    href="/login"
                    className="block no-underline hover:text-black/70"
                  >
                    Login
                  </a>
                </div>
              </div>

              <div>
                <p className="mb-4 text-black/45">Social</p>
                <div className="space-y-2 font-semibold">
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block no-underline hover:text-black/70"
                  >
                    Linkedin
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block no-underline hover:text-black/70"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block no-underline hover:text-black/70"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex items-end justify-between gap-6">
            <div className="flex items-center gap-4 pb-2 sm:gap-6">
              <img
                src="/philrice.jpg"
                alt="PhilRice"
                className="h-10 w-auto sm:h-30"
              />
              <img
                src="/cit-logo.png"
                alt="CIT"
                className="h-10 w-auto sm:h-30"
              />
            </div>

            <h2 className="text-right text-6xl font-semibold leading-none tracking-tight text-[#05070d] sm:text-8xl lg:text-[9rem]">
              hum.ai®
            </h2>
          </div>
        </div>

        <footer className="bg-[#05070d] text-white/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-12">
            <p>2026 hum.ai All rights reserved</p>
            <div className="flex items-center gap-8">
              <a href="#" className="no-underline hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="no-underline hover:text-white">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}

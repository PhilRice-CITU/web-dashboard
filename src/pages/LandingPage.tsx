import { useNavigate } from '@tanstack/react-router'
import { useAppStore } from '#/store/appStore'
import { Button } from '#/components/ui/button'
import { DitherVideoBackground } from '#/components/DitherVideoBackground'
import { Separator } from '#/components/ui/separator'

export function LandingPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    navigate({ to: '/dashboard' })
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="flex min-h-screen flex-col bg-[#f6f8fa]">
          <header className="p-6">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="inline-flex items-center gap-2 text-left text-lg font-bold text-primary"
              >
                <img
                  src="/logo-icon.svg"
                  alt="hum.ai logo"
                  className="size-7"
                />
                <span>hum.ai</span>
              </button>

              <nav className="flex items-center gap-5 text-sm [&_a]:text-foreground [&_a]:no-underline [&_a:hover]:text-foreground/70">
                <a href="#">Documentation</a>
                <a href="https://github.com/One-Team-One-Goal">GitHub</a>
                <a href="/about">About Us</a>
              </nav>
            </div>
          </header>

          <div className="flex flex-1 flex-col px-6 pb-10 pt-16 lg:px-10 lg:pt-24">
            <div className="max-w-xl">
              <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-[#0f172a] sm:text-6xl">
                AI-Powered Automated Rice Quality Analysis
              </h1>
              <Separator className="mt-8 mb-6 bg-transparent" />
              <Button
                size="lg"
                variant={'outline'}
                onClick={() => navigate({ to: '/register' })}
                className="rounded-md"
              >
                Get Started
              </Button>
            </div>

            <div className="mt-auto space-y-2 pt-10 text-sm">
              <p className="font-medium text-muted-foreground">
                Powered by PhilRice & CIT
              </p>
              <p className="max-w-md text-muted-foreground">
                Real-time grain quality evaluation across multiple devices.
                Monitor chalkiness, breakage, foreign matter, and grain
                classification with instant analytics and comprehensive reports.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <img
                  src="/philrice.jpg"
                  alt="PhilRice"
                  className="h-12 w-auto"
                />
                <img src="/cit-logo.png" alt="CIT" className="h-12 w-auto" />
              </div>
            </div>
          </div>
        </section>

        <section className="hidden bg-[#d9d9d9] lg:block" aria-hidden="true">
          <DitherVideoBackground />
        </section>
      </div>
    </div>
  )
}

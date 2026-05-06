import { Button } from '#/shared/components/ui/button'
import { DitherVideoBackground } from '#/features/landing/components/DitherVideoBackground'
import { Separator } from '#/shared/components/ui/separator'

type HeroRevealSectionProps = {
  onGetStarted: () => void
}

export function HeroRevealSection({ onGetStarted }: HeroRevealSectionProps) {
  return (
    <section className="sticky top-0 h-svh bg-background text-foreground">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        <section className="flex h-full flex-col bg-[#f6f8fa]">
          <div className="flex flex-1 flex-col px-6 pb-10 pt-28 lg:px-10 lg:pt-44">
            <div className="max-w-xl">
              <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-[#0f172a] sm:text-6xl">
                AI-Powered Automated Rice Quality Analysis
              </h1>
              <Separator className="mt-8 mb-6 bg-transparent" />
              <Button
                size="lg"
                variant={'outline'}
                onClick={onGetStarted}
                className="rounded-md"
              >
                Get Started
              </Button>
            </div>

            <div className="mt-auto space-y-2 pt-10 text-sm">
              <p className="font-medium text-muted-foreground">
                Powered by PhilRice & CIT-U
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
    </section>
  )
}

import { DitherVideoBackground } from '#/components/DitherVideoBackground'
import { Button } from '#/components/ui/button'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

const teamMembers = [
  {
    name: 'Val Mykel Bolante',
    role: 'Researcher',
    link: 'https://www.linkedin.com/in/valceven/',
  },
  {
    name: 'Mars Benitez',
    role: 'Researcher',
    link: 'https://www.linkedin.com/in/mars-benitez-28781a2b9/',
  },
  {
    name: 'Keiru Vent Cabili',
    role: 'Researcher',
    link: 'https://www.linkedin.com/in/keirucabili/',
  },
  {
    name: 'Kyle Angela Mar',
    role: 'Researcher',
    link: 'https://www.linkedin.com/in/kyle-angela-mar-405aa3159/',
  },
]

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#0a0a0a] lg:pt-20">
      <Button
        variant={'ghost'}
        className="flex absolute top-4 left-4 h-10 w-10 "
        onClick={() => window.history.back()}
      >
        <ArrowLeft />
      </Button>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 bg-[#f6f8fa] px-6 py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 lg:px-10">
        <aside className="h-fit lg:sticky lg:top-8">
          <a
            href="/"
            className="group inline-flex items-center gap-3 text-left no-underline"
          >
            <img
              src="/logo-icon.svg"
              alt="hum.ai logo"
              className="size-14 rounded-xl"
            />
            <div>
              <p className="text-xl font-semibold leading-tight text-[#0a0a0a]">
                hum.ai
              </p>
              <p className="text-sm text-[#4a4a4a]">
                AI-Powered Rice Quality Analytics
              </p>
            </div>
          </a>

          <a
            href="mailto:valmykelceven.bolante@cit.edu"
            className="mt-10 inline-block border-b border-[#202020]/25 pb-1 text-2xl leading-none tracking-tight text-[#151515] transition-colors hover:text-black"
          >
            <div className="flex gap-1">
              Contact Us
              <ArrowUpRight size="20" />
            </div>
          </a>
        </aside>

        <main className="space-y-14">
          <section className="max-w-4xl">
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
              About Us
            </h1>
            <p className="mt-8 max-w-4xl text-2xl leading-snug text-[#111]">
              We are a product and research team building practical AI systems
              for rice quality analysis. Our mission is to make grain evaluation
              faster, transparent, and accessible across labs and field
              operations.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 md:gap-10">
            <h2 className="text-4xl font-medium tracking-tight">
              Collaborator
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-[#333]">
              Henry Corpuz, Senior Science Research Specialist, Rice Chemistry
              and Food Science Division, Department of Agriculture-Philippine
              Rice Research Institute.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 md:gap-10">
            <h2 className="text-4xl font-medium tracking-tight">Adviser</h2>
            <p className="max-w-xl text-lg leading-relaxed text-[#333]">
              Eugene Busico, Doctor in Information Technology, Associate
              Professor at Cebu Institute of Technology University
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 md:gap-10">
            <h2 className="text-4xl font-medium tracking-tight">
              Core Philosophy
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-[#333]">
              We believe high-impact technology should be understandable and
              usable by real operators. Every feature we ship is designed around
              reliability, clear outputs, and measurable value for
              decision-makers.
            </p>
          </section>

          <section className="relative isolate overflow-hidden rounded-3xl border border-black/10 bg-[#d9d9d9]">
            <div className="absolute inset-0">
              <DitherVideoBackground pixelSize={4} />
            </div>
            <div className="relative z-10 flex min-h-72 items-end bg-linear-to-t sm:min-h-96"></div>
          </section>

          <section>
            <h2 className="text-4xl font-medium tracking-tight">Our Team</h2>
            <ul className="mt-6">
              {teamMembers.map((member, index) => (
                <li
                  key={member.name}
                  className="grid grid-cols-[50px_minmax(0,1fr)_minmax(120px,220px)] items-center gap-4 border-b border-black/10 py-5"
                >
                  <span className="text-sm tabular-nums text-[#777]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-2xl leading-tight sm:text-2xl">
                    <a
                      href={member.link}
                      className="text-primary hover:text-blue-800"
                    >
                      {member.name}
                    </a>
                  </span>
                  <span className="text-right text-sm text-[#6c6c6c] sm:text-base">
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <p className="text-md">
              We build computer vision tools for real-world grain analysis,
              helping teams move from manual checks to fast, consistent data.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

import { Button } from '#/shared/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#0a0a0a]">
      <Button
        variant={'ghost'}
        className="flex absolute top-4 left-4 h-10 w-10"
        onClick={() => window.history.back()}
      >
        <ArrowLeft />
      </Button>

      <main className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
        <header className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-sm text-[#606670]">
            Effective date: March 20, 2026
          </p>
        </header>

        <div className="space-y-10 text-[#1b1f24]">
          <section id="overview" className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Platform Overview</h2>
            <p className="leading-relaxed text-[#333a45]">
              The hum.ai platform is designed for AI-assisted rice grain quality
              analysis. Core functions include onboarding for authorized users,
              account-based access control, device registration and grouping,
              and dashboard views of grain results, analytics, and history.
            </p>
          </section>

          <section id="terms" className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Access and Onboarding</h2>
            <p className="leading-relaxed text-[#333a45]">
              Access to the platform requires account authentication through
              registration and login. Principal Investigator (PI) onboarding may
              require a predefined access key, which is managed by the platform
              administrators.
            </p>
            <p className="leading-relaxed text-[#333a45]">
              You are responsible for maintaining the confidentiality of your
              credentials and for all activities performed under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">
              3. Device and Office Usage
            </h2>
            <p className="leading-relaxed text-[#333a45]">
              Login and registration are mandatory to separate dashboards and
              data context by account and organization. A dashboard may be
              shared by an office or authorized team. Users may be prompted to
              register one or more devices, and devices can be grouped to
              support unified data gathering and monitoring.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Data and Analytics</h2>
            <p className="leading-relaxed text-[#333a45]">
              The dashboard may display rice grain analysis outputs including
              quality results, historical records, and analytics. These outputs
              are intended to support research and operational decision-making.
              You acknowledge that automated analysis should be interpreted by
              qualified personnel before final field or policy decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Acceptable Use</h2>
            <p className="leading-relaxed text-[#333a45]">
              You agree not to misuse the service, attempt unauthorized access,
              interfere with device communications, or upload harmful data. Any
              abuse may result in temporary suspension or permanent account
              termination.
            </p>
          </section>

          <section id="privacy" className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Privacy Policy</h2>
            <p className="leading-relaxed text-[#333a45]">
              We collect only the data necessary to provide authentication,
              device management, and analytics features. This may include user
              profile details, device identifiers, captured analysis metadata,
              and usage logs.
            </p>
            <p className="leading-relaxed text-[#333a45]">
              Data is used to operate, secure, and improve the platform. Access
              to data is limited to authorized users and administrators within
              defined roles. By using the platform, you consent to this data
              handling for legitimate research and operations purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">
              7. Changes to These Terms
            </h2>
            <p className="leading-relaxed text-[#333a45]">
              We may update these Terms and Privacy Policy from time to time.
              Continued use of the platform after updates means you accept the
              revised terms.
            </p>
          </section>

          <section className="space-y-3 border-t border-black/10 pt-8">
            <h2 className="text-2xl font-semibold">8. Contact</h2>
            <p className="leading-relaxed text-[#333a45]">
              For questions regarding these terms, contact the hum.ai project
              administrators or your assigned PI/office coordinator.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

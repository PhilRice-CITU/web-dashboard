import { createFileRoute, Link } from '@tanstack/react-router'
import { getDoc } from '#/features/docs/lib/docs-registry'
import { DocsPager } from '#/features/docs/components/DocsPager'

export const Route = createFileRoute('/docs/$')({
  head: ({ params }) => {
    const doc = getDoc(params._splat ?? '')
    return {
      meta: [{ title: `hum.ai | ${doc?.title ?? 'Documentation'}` }],
    }
  },
  component: DocPage,
})

function DocPage() {
  const { _splat } = Route.useParams()
  const slug = _splat ?? ''
  const doc = getDoc(slug)

  if (!doc) {
    return (
      <div className="py-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mb-4 text-muted-foreground">
          No documentation page exists at this address.
        </p>
        <Link
          to="/docs"
          className="text-sm font-medium text-foreground underline underline-offset-2"
        >
          ← Back to documentation
        </Link>
      </div>
    )
  }

  const { Component } = doc
  return (
    <article>
      <Component />
      <DocsPager slug={slug} />
    </article>
  )
}

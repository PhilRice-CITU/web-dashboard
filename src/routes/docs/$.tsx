import { createFileRoute } from '@tanstack/react-router'

// Skeleton splat route — replaced with the real doc-page component in Task 17.
export const Route = createFileRoute('/docs/$')({
  component: () => null,
})

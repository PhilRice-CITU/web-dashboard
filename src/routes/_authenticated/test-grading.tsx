import { createFileRoute } from '@tanstack/react-router'
import { TestGradingPage } from '#/pages/TestGradingPage'

export const Route = createFileRoute('/_authenticated/test-grading')({
  head: () => ({
    meta: [{ title: 'hum.ai | Test Grading' }],
  }),
  component: TestGradingPage,
})

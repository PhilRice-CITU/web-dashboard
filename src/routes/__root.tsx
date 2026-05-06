import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Button } from '#/shared/components/ui/button'
import { QueryProvider } from '#/app/providers/QueryProvider'
import { AuthProvider } from '#/app/providers/AuthProvider'
import appCss from '../app/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'hum.ai | Rice Quality Platform',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: '/favicon/favicon.ico',
        sizes: 'any',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon/favicon-96x96.png',
        sizes: '96x96',
      },
      {
        rel: 'apple-touch-icon',
        href: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest',
      },
    ],
  }),
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
})

function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <Button render={<Link to="/dashboard" />}>Go to Dashboard</Button>
          <Button variant="outline" render={<Link to="/devices" />}>
            Open Devices
          </Button>
        </div>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="m-0 p-0 wrap-anywhere font-sans antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

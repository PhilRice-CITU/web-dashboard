import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryProvider } from '#/providers/QueryProvider'
import appCss from '../styles.css?url'

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
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="m-0 p-0 wrap-anywhere font-sans antialiased">
        <QueryProvider>
          {children}
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

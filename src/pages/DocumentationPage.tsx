import { ExternalLink, FileText } from 'lucide-react'

import { PlatformShell } from '#/shared/components/layout/PlatformShell'
import { Button } from '#/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'

const docs = [
  {
    title: 'API Server Architecture',
    description:
      'Per-layer file map (routers → services → repositories) and request flow.',
    href: '/docs-and-architecture/api-server/architecture.md',
  },
  {
    title: 'Database Schema',
    description: 'ER diagram, table reference, and Supabase setup guide.',
    href: '/docs-and-architecture/api-server/database-schema.md',
  },
  {
    title: 'Grading Pipeline',
    description:
      'How app/grading/ turns raw + IR images into a PNS/BAFS 290:2025 grade.',
    href: '/docs-and-architecture/api-server/grading-pipeline.md',
  },
  {
    title: 'Metrics Contract',
    description:
      'Canonical metrics JSONB schema bridging vision-model output to analytics queries.',
    href: '/docs-and-architecture/api-server/metrics-contract.md',
  },
]

export function DocumentationPage() {
  return (
    <PlatformShell
      title="Documentation"
      description="Operational and architecture references for the PhilRice deployment."
      actions={
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-2 size-4" />
          Open Docs Folder
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {docs.map((doc) => (
          <Card key={doc.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4" />
                {doc.title}
              </CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={doc.href} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  Read Document
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </PlatformShell>
  )
}

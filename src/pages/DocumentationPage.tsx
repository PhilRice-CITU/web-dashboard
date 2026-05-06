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
    title: 'Edge Client Specification',
    description:
      'Boot, capture, kiosk, uploader, heartbeat, and systemd contract.',
    href: '/docs-and-architecture/edge.client.md',
  },
  {
    title: 'Project Planner',
    description:
      'Execution plan with milestones for edge, API, model, and dashboard.',
    href: '/docs-and-architecture/planner-pt-2.md',
  },
  {
    title: 'Technical Master Plan',
    description:
      'Full architecture and model training strategy with risk register.',
    href: '/docs-and-architecture/Planner.md',
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

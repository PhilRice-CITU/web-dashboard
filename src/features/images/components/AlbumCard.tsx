import { Badge } from '#/components/ui/badge'

type Props = {
  title: string
  count: number
  onClick: () => void
}

export function AlbumCard({ title, count, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left transition hover:-translate-y-0.5"
    >
      <article className="relative h-40 pt-4">
        <div className="absolute left-0 top-4 bg-gray-50 h-5 w-[calc(100%-2rem)] rounded-t-lg border border-border border-b-none" />
        <div className="absolute inset-x-0 top-6 bottom-0 rounded-xl border border-border bg-card p-4 shadow-sm transition group-hover:border-primary/40 group-hover:shadow-md">
          <div className="flex h-full flex-col justify-between">
            <Badge variant="outline" className="w-fit bg-background/80">
              Folder
            </Badge>
            <div className="space-y-1">
              <p className="truncate text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{count} images</p>
            </div>
          </div>
        </div>
      </article>
    </button>
  )
}

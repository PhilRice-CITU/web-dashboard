import { LayoutGrid, List, Search } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'

type Props = {
  search: string
  onSearch: (value: string) => void
  viewMode: 'list' | 'grid'
  onViewModeChange: (mode: 'list' | 'grid') => void
  onRefetch: () => void
}

export function LogsToolbar({
  search,
  onSearch,
  viewMode,
  onViewModeChange,
  onRefetch,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <Input
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search by device, level, or message..."
        className="min-w-56 flex-1"
      />
      <Button variant="outline" size="sm" className="h-8.5" onClick={onRefetch}>
        <Search className="mr-2 size-4" />
        Search
      </Button>
      <div className="ml-auto inline-flex rounded-md border border-border bg-background p-0.5">
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="h-7"
        >
          <List className="mr-2 size-4" />
          List
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="h-7"
        >
          <LayoutGrid className="mr-2 size-4" />
          Grid
        </Button>
      </div>
    </div>
  )
}

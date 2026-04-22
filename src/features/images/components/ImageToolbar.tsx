import { ArrowLeft, RefreshCw, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import { Label } from '#/components/ui/label'
import { Separator } from '#/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { ImageKind, SortOrder, ViewMode } from '../types/images.types'

type Props = {
  albumTitle: string
  searchText: string
  onSearch: (value: string) => void
  kindFilter: 'all' | ImageKind
  onKindFilter: (filter: 'all' | ImageKind) => void
  sortOrder: SortOrder
  onSortOrder: (order: SortOrder) => void
  viewMode: ViewMode
  onViewMode: (mode: ViewMode) => void
  groupByDevice: boolean
  onGroupByDevice: (group: boolean) => void
  onBack: () => void
  onRefetch: () => void
  isDeviceAlbum: boolean
  isLoading: boolean
}

export function ImageToolbar({
  albumTitle,
  searchText,
  onSearch,
  kindFilter,
  onKindFilter,
  sortOrder,
  onSortOrder,
  viewMode,
  onViewMode,
  groupByDevice,
  onGroupByDevice,
  onBack,
  onRefetch,
  isDeviceAlbum,
  isLoading,
}: Props) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 px-0"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h2 className="text-sm font-semibold">{albumTitle}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="mr-2 text-xs text-muted-foreground">
              Refreshing...
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            className="h-8"
          >
            <RefreshCw className="mr-2 size-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-2 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search images..."
              className="h-9 w-[220px] pl-9"
              value={searchText}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Select
            value={kindFilter}
            onValueChange={(val) => onKindFilter(val as 'all' | ImageKind)}
          >
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="All kinds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="ir">IR</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="raw">Raw</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(val) => onSortOrder(val as SortOrder)}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {!isDeviceAlbum && viewMode !== 'list' && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Switch
                  id="group-view"
                  checked={groupByDevice}
                  onCheckedChange={onGroupByDevice}
                />
                <Label htmlFor="group-view" className="text-xs">
                  Group by device
                </Label>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onValueChange={(val) => onViewMode(val as ViewMode)}
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="list">List view</SelectItem>
              <SelectItem value="sm">Small grid</SelectItem>
              <SelectItem value="md">Medium grid</SelectItem>
              <SelectItem value="lg">Large grid</SelectItem>
              <SelectItem value="xl">Extra large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}

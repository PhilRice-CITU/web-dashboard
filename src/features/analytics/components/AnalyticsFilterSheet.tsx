import { SlidersHorizontal } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

type Props = {
  startDate: string
  onStartDate: (v: string) => void
  endDate: string
  onEndDate: (v: string) => void
  stationFilter: string
  onStationFilter: (v: string) => void
  gradeFilter: string
  onGradeFilter: (v: string) => void
}

export function AnalyticsFilterSheet({
  startDate,
  onStartDate,
  endDate,
  onEndDate,
  stationFilter,
  onStationFilter,
  gradeFilter,
  onGradeFilter,
}: Props) {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="h-9" />}
      >
        <SlidersHorizontal className="mr-2 size-4" />
        Filter Range
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Analytics</SheetTitle>
          <SheetDescription>
            Configure date, station, and grade filters for this view.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="date-start">Start date</Label>
            <Input
              id="date-start"
              type="date"
              value={startDate}
              onChange={(e) => onStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date-end">End date</Label>
            <Input
              id="date-end"
              type="date"
              value={endDate}
              onChange={(e) => onEndDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="station">Station</Label>
            <Input
              id="station"
              placeholder="PhilRice CES"
              value={stationFilter}
              onChange={(e) => onStationFilter(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="grade">Grade focus</Label>
            <Input
              id="grade"
              placeholder="all, A, B, C, D"
              value={gradeFilter}
              onChange={(e) => onGradeFilter(e.target.value || 'all')}
            />
          </div>
        </div>
        <SheetFooter>
          <Button>Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

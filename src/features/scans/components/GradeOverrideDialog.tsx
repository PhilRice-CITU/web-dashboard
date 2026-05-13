import { useState } from 'react'

import { useOverrideGrade } from '#/features/scans/hooks/useScanDetail'
import { PNS_GRADES } from '#/features/scans/types'
import type { PnsGrade } from '#/features/scans/types'
import { axiosErrorDetail } from '#/features/scans/utils'
import { Button, buttonVariants } from '#/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/shared/components/ui/dialog'
import { Label } from '#/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'

type Props = {
  resultId: string
  currentGrade: string | undefined
}

function isPnsGrade(value: string | undefined): value is PnsGrade {
  return (
    value !== undefined && (PNS_GRADES as readonly string[]).includes(value)
  )
}

export function GradeOverrideDialog({ resultId, currentGrade }: Props) {
  const [open, setOpen] = useState(false)
  const [grade, setGrade] = useState<PnsGrade>(
    isPnsGrade(currentGrade) ? currentGrade : 'Grade No. 1',
  )
  const [reason, setReason] = useState('')
  const override = useOverrideGrade(resultId)

  const handleSubmit = () => {
    if (!reason.trim()) return
    override.mutate(
      { to_grade: grade, reason: reason.trim() },
      {
        onSuccess: () => {
          setOpen(false)
          setReason('')
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          />
        }
      >
        Override grade
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Override final grade</DialogTitle>
          <DialogDescription>
            Use this when the AI grade is wrong despite the per-grain
            classifications. Audited.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="override-grade">New grade</Label>
            <Select
              value={grade}
              onValueChange={(value) => setGrade(value as PnsGrade)}
            >
              <SelectTrigger id="override-grade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PNS_GRADES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="override-reason">Reason</Label>
            <textarea
              id="override-reason"
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is the AI grade incorrect?"
            />
          </div>

          {override.error && (
            <p className="text-xs text-destructive">
              {axiosErrorDetail(override.error, 'Failed to override grade')}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={override.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!reason.trim() || override.isPending}
          >
            {override.isPending ? 'Saving…' : 'Override'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

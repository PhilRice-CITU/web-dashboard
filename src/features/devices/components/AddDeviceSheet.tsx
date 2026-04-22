import { Plus } from 'lucide-react'
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
  open: boolean
  onOpenChange: (open: boolean) => void
  deviceCode: string
  onDeviceCodeChange: (code: string) => void
  onSave: () => void
  isPending: boolean
}

export function AddDeviceSheet({
  open,
  onOpenChange,
  deviceCode,
  onDeviceCodeChange,
  onSave,
  isPending,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger render={<Button size="sm" />} className="h-9 bg-logo-color">
        <Plus className="mr-2 size-4" />
        Add Device
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Connect Device</SheetTitle>
          <SheetDescription>
            Link an existing edge device by its Device ID.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="device-id">Device ID</Label>
            <Input
              id="device-id"
              placeholder="UUID"
              value={deviceCode}
              onChange={(event) => onDeviceCodeChange(event.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={onSave} disabled={isPending || !deviceCode.trim()}>
            Connect Device
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

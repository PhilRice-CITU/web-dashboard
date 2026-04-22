import { Send } from 'lucide-react'
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
import type { FleetDevice } from '../types/devices.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDevice: FleetDevice | undefined
  commandName: string
  onCommandNameChange: (name: string) => void
  onQueue: () => void
  isPending: boolean
}

export function SendCommandSheet({
  open,
  onOpenChange,
  selectedDevice,
  commandName,
  onCommandNameChange,
  onQueue,
  isPending,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="h-9" />}
      >
        <Send className="mr-2 size-4" />
        Send Command
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Remote Command</SheetTitle>
          <SheetDescription>
            Queue a command for one or more online devices.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="device-target">Target device</Label>
            <Input
              id="device-target"
              placeholder="NE-01 or Group: Isabela"
              value={selectedDevice?.id ?? ''}
              readOnly
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="command-name">Command</Label>
            <Input
              id="command-name"
              placeholder="restart_capture_service"
              value={commandName}
              onChange={(event) => onCommandNameChange(event.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={onQueue} disabled={!selectedDevice || isPending}>
            Queue Command
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

import { useEffect, useMemo } from 'react'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { cn } from '#/shared/lib/utils'
import type { UploadPair } from '../types'

type Props = {
  pairs: UploadPair[]
  onChange: (pairs: UploadPair[]) => void
  disabled?: boolean
}

export function PairUploadList({ pairs, onChange, disabled }: Props) {
  const addPair = () => {
    onChange([...pairs, makeEmptyPair()])
  }

  const removePair = (id: string) => {
    if (pairs.length === 1) return
    onChange(pairs.filter((p) => p.id !== id))
  }

  const setFile = (id: string, key: 'raw' | 'ir', file: File | null) => {
    onChange(pairs.map((p) => (p.id === id ? { ...p, [key]: file } : p)))
  }

  return (
    <div className="space-y-3">
      {pairs.map((pair, index) => (
        <PairRow
          key={pair.id}
          index={index}
          pair={pair}
          onFile={(key, file) => setFile(pair.id, key, file)}
          onRemove={() => removePair(pair.id)}
          canRemove={pairs.length > 1 && !disabled}
          disabled={disabled}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addPair}
        disabled={disabled}
      >
        <PlusIcon className="size-4" />
        Add another pair
      </Button>
    </div>
  )
}

type RowProps = {
  index: number
  pair: UploadPair
  onFile: (key: 'raw' | 'ir', file: File | null) => void
  onRemove: () => void
  canRemove: boolean
  disabled?: boolean
}

function PairRow({
  index,
  pair,
  onFile,
  onRemove,
  canRemove,
  disabled,
}: RowProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Pair {index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Remove pair ${index + 1}`}
          >
            <Trash2Icon className="size-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FileSlot
          label="White-LED (raw)"
          file={pair.raw}
          onChange={(f) => onFile('raw', f)}
          disabled={disabled}
        />
        <FileSlot
          label="IR (NoIR)"
          file={pair.ir}
          onChange={(f) => onFile('ir', f)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

type SlotProps = {
  label: string
  file: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
}

function FileSlot({ label, file, onChange, disabled }: SlotProps) {
  const previewUrl = useObjectUrl(file)

  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input p-2 text-sm transition',
        !disabled && 'hover:border-primary',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        disabled={disabled}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={label}
          className="size-12 rounded object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground">
          No file
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-foreground">{label}</div>
        <div className="truncate text-xs text-muted-foreground">
          {file ? file.name : 'Click to choose…'}
        </div>
      </div>
    </label>
  )
}

function useObjectUrl(file: File | null): string | null {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])
  return url
}

let pairCounter = 0
export function makeEmptyPair(): UploadPair {
  pairCounter += 1
  return {
    id: `pair-${Date.now()}-${pairCounter}`,
    raw: null,
    ir: null,
  }
}

export function allPairsComplete(pairs: UploadPair[]): boolean {
  return pairs.length > 0 && pairs.every((p) => p.raw && p.ir)
}

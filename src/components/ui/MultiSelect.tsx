import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export interface MultiSelectOption {
  id: string
  name: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Choose from Drop-down',
  disabled,
  invalid,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedNames = options
    .filter((o) => value.includes(o.id))
    .map((o) => o.name)

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex w-full items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-left text-sm disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-500',
          invalid ? 'border-rose-400' : 'border-ink-300/60',
        )}
      >
        <span
          className={clsx(
            'truncate',
            selectedNames.length === 0 && 'text-ink-500/70',
          )}
        >
          {selectedNames.length > 0 ? selectedNames.join(', ') : placeholder}
        </span>
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-ink-500">
          <path d="M5.5 7.5L10 12l4.5-4.5H5.5z" />
        </svg>
      </button>
      {open && !disabled && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-ink-300/60 bg-white p-1.5 shadow-lg">
          {options.length === 0 && (
            <p className="px-3 py-2 text-sm text-ink-500">No options</p>
          )}
          {options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-muted"
            >
              <input
                type="checkbox"
                checked={value.includes(option.id)}
                onChange={() => toggle(option.id)}
                className="h-4 w-4 rounded border-ink-300 text-primary-500 focus:ring-primary-400"
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

import clsx from 'clsx'
import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  error?: string
  children: ReactNode
  className?: string
}

export function Field({ label, error, children, className }: FieldProps) {
  return (
    <label className={clsx('flex flex-col gap-2', className)}>
      <span className="text-sm font-medium text-ink-900">{label}</span>
      {children}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  )
}

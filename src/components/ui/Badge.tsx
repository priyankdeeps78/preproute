import clsx from 'clsx'
import type { ReactNode } from 'react'

type Tone = 'navy' | 'teal' | 'amber' | 'grey' | 'green'

const toneClasses: Record<Tone, string> = {
  navy: 'bg-ink-900 text-white',
  teal: 'bg-accent-teal-500 text-white',
  amber: 'bg-accent-amber-100 text-accent-amber-700 border border-accent-amber-600/40',
  grey: 'bg-surface-muted text-ink-700 border border-ink-300/60',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-300',
}

export function Badge({
  tone = 'grey',
  children,
  className,
  icon,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
  icon?: ReactNode
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

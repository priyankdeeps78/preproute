import clsx from 'clsx'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-1.5 select-none', className)}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
        P
      </span>
      <span className="text-xl font-bold tracking-tight text-primary-600">
        Prep<span className="text-ink-900">Route</span>
      </span>
    </div>
  )
}

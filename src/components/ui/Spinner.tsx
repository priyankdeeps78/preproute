import clsx from 'clsx'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500',
        className,
      )}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

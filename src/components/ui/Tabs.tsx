import clsx from 'clsx'

export interface TabOption<T extends string> {
  value: T
  label: string
}

interface TabsProps<T extends string> {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={clsx(
        'inline-flex rounded-xl border border-ink-300/60 bg-white p-1',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            'rounded-lg px-5 py-2 text-sm font-medium transition-colors',
            value === option.value
              ? 'bg-primary-50 text-primary-600'
              : 'text-ink-500 hover:text-ink-900',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

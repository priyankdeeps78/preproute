import clsx from 'clsx'

export interface RadioOption<T extends string> {
  value: T
  label: string
}

interface RadioGroupProps<T extends string> {
  name: string
  options: RadioOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  columns?: number
}

export function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
  className,
  columns = 3,
}: RadioGroupProps<T>) {
  return (
    <div
      className={clsx('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2 text-sm text-ink-900"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 text-primary-500 focus:ring-primary-400"
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}

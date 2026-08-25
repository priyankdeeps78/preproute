import clsx from 'clsx'
import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, invalid, placeholder, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={clsx(
          'w-full appearance-none rounded-xl border bg-white bg-[url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236b7280%22><path d=%22M5.5 7.5L10 12l4.5-4.5H5.5z%22/></svg>\')] bg-[right_0.9rem_center] bg-no-repeat px-4 py-2.5 pr-9 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-primary-400/40',
          invalid ? 'border-rose-400' : 'border-ink-300/60 focus:border-primary-400',
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    )
  },
)

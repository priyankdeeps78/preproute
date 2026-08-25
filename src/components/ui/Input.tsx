import clsx from 'clsx'
import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500/70 focus:outline-none focus:ring-2 focus:ring-primary-400/40',
        invalid ? 'border-rose-400' : 'border-ink-300/60 focus:border-primary-400',
        className,
      )}
      {...rest}
    />
  )
})

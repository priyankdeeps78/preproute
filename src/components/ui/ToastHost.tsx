import clsx from 'clsx'

import { useToastStore } from '@/store/toastStore'

const toneClasses = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  error: 'bg-rose-50 text-rose-700 border-rose-300',
  info: 'bg-primary-50 text-primary-700 border-primary-200',
}

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismiss(toast.id)}
          className={clsx(
            'rounded-xl border px-4 py-3 text-left text-sm shadow-lg',
            toneClasses[toast.tone],
          )}
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}

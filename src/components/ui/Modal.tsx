import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  widthClassName?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  widthClassName = 'max-w-3xl',
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/40 p-6 backdrop-blur-sm">
      <div
        className={`w-full ${widthClassName} rounded-2xl bg-white p-8 shadow-xl`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-ink-500 hover:bg-surface-muted"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
              <path d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

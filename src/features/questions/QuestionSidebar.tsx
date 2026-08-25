import clsx from 'clsx'

import { type DraftQuestion, isQuestionComplete } from '@/store/questionDraftStore'

interface QuestionSidebarProps {
  questions: DraftQuestion[]
  activeLocalId: string | null
  totalQuestions: number
  onSelect: (localId: string) => void
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function QuestionSidebar({
  questions,
  activeLocalId,
  totalQuestions,
  onSelect,
  collapsed,
  onToggleCollapsed,
}: QuestionSidebarProps) {
  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapsed}
        className="h-fit rounded-xl border border-ink-300/40 bg-white p-2 text-ink-500 hover:bg-surface-muted"
        aria-label="Expand question list"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
          <path d="M7.5 5.5L12 10l-4.5 4.5L6 13l3-3-3-3z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="w-64 shrink-0 rounded-2xl border border-ink-300/40 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Question creation</h3>
        <button
          onClick={onToggleCollapsed}
          className="rounded-full p-1 text-ink-500 hover:bg-surface-muted"
          aria-label="Collapse question list"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
            <path d="M12.5 5.5L8 10l4.5 4.5L14 13l-3-3 3-3z" />
          </svg>
        </button>
      </div>
      <p className="mb-3 text-xs text-ink-500">
        Total Questions . {totalQuestions}
      </p>
      <div className="flex flex-col gap-2">
        {questions.map((q, index) => {
          const complete = isQuestionComplete(q.data)
          const active = q.localId === activeLocalId
          return (
            <button
              key={q.localId}
              onClick={() => onSelect(q.localId)}
              className={clsx(
                'flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-primary-400 bg-primary-50 text-primary-700'
                  : complete
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700'
                    : 'border-ink-300/50 text-ink-500',
              )}
            >
              <span className="flex items-center gap-2">
                {complete ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                    ✓
                  </span>
                ) : (
                  <span className="h-4 w-4 rounded-full border-2 border-ink-300" />
                )}
                Question {index + 1}
              </span>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current opacity-60">
                <path d="M7.5 5.5L12 10l-4.5 4.5L6 13l3-3-3-3z" />
              </svg>
            </button>
          )
        })}
      </div>
    </div>
  )
}

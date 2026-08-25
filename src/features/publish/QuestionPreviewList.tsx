import { useState } from 'react'

import { FullPageSpinner } from '@/components/ui/Spinner'
import { useFetchBulkQuestions } from '@/hooks/useQuestions'

const optionKeys = ['option1', 'option2', 'option3', 'option4'] as const

export function QuestionPreviewList({
  questionIds,
  onEditQuestions,
}: {
  questionIds: string[]
  onEditQuestions: () => void
}) {
  const [open, setOpen] = useState(false)
  const query = useFetchBulkQuestions(open ? questionIds : [])

  return (
    <div className="rounded-2xl border border-ink-300/40 bg-white p-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold text-ink-900">
          Preview questions ({questionIds.length})
        </span>
        <span className="text-ink-500">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={onEditQuestions}
              className="text-sm text-primary-600 hover:underline"
            >
              Edit questions
            </button>
          </div>

          {query.isLoading && <FullPageSpinner />}

          {query.data?.map((question, index) => (
            <div
              key={question.id}
              className="rounded-xl border border-ink-300/40 p-4"
            >
              <p className="mb-3 text-sm font-medium text-ink-900">
                Q{index + 1}.{' '}
                <span
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {optionKeys.map((key) => (
                  <div
                    key={key}
                    className={
                      question.correct_option === key
                        ? 'rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800'
                        : 'rounded-lg border border-ink-300/40 px-3 py-2 text-sm text-ink-700'
                    }
                  >
                    {question[key]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

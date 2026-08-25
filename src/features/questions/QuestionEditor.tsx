import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { Select } from '@/components/ui/Select'
import { CsvImportButton } from '@/features/questions/CsvImportButton'
import type { DraftQuestion } from '@/store/questionDraftStore'
import type { CorrectOption, DifficultyLevel, NewQuestion } from '@/types/api'

interface TaxonomyOption {
  id: string
  name: string
}

interface QuestionEditorProps {
  draft: DraftQuestion
  index: number
  total: number
  topics: TaxonomyOption[]
  subTopics: TaxonomyOption[]
  onChange: (patch: Partial<DraftQuestion['data']>) => void
  onDelete: () => void
  onPrev: () => void
  onNext: () => void
  onAddMcq: () => void
  onImportCsv: (questions: NewQuestion[]) => void
  onDeleteAll: () => void
}

const optionKeys: CorrectOption[] = ['option1', 'option2', 'option3', 'option4']

export function QuestionEditor({
  draft,
  index,
  total,
  topics,
  subTopics,
  onChange,
  onDelete,
  onPrev,
  onNext,
  onAddMcq,
  onImportCsv,
  onDeleteAll,
}: QuestionEditorProps) {
  const { data } = draft

  function onChangeOption(key: CorrectOption, value: string) {
    if (key === 'option1') onChange({ option1: value })
    else if (key === 'option2') onChange({ option2: value })
    else if (key === 'option3') onChange({ option3: value })
    else onChange({ option4: value })
  }

  return (
    <div className="flex-1 rounded-2xl border border-ink-300/40 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink-900">
          Question {index + 1}/{total}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddMcq}
            className="flex items-center gap-1 rounded-lg border border-ink-300/60 px-3 py-1.5 text-sm text-ink-700 hover:bg-surface-muted"
          >
            + MCQ
          </button>
          <CsvImportButton onImport={onImportCsv} />
        </div>
      </div>

      <button
        onClick={onDeleteAll}
        className="mb-3 flex items-center gap-1.5 text-sm text-rose-600 hover:underline"
      >
        🗑 Delete All Edits
      </button>

      <RichTextEditor
        value={data.question}
        onChange={(html) => onChange({ question: html })}
        placeholder="Type here"
        onDelete={onDelete}
      />

      <p className="mb-2 mt-6 text-sm font-semibold text-ink-900">
        Type the options below
      </p>
      <div className="flex flex-col gap-3">
        {optionKeys.map((key) => (
          <div key={key} className="flex items-center gap-3">
            <input
              type="radio"
              name={`correct-${draft.localId}`}
              checked={data.correct_option === key}
              onChange={() => onChange({ correct_option: key })}
              className="h-4 w-4 text-primary-500"
              aria-label={`Mark ${key} as correct`}
            />
            <input
              value={data[key]}
              onChange={(e) => onChangeOption(key, e.target.value)}
              placeholder="Type Option here"
              className="flex-1 rounded-xl border border-ink-300/60 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400/40"
            />
            <button
              onClick={() => onChangeOption(key, '')}
              className="rounded-lg p-2 text-ink-500 hover:bg-rose-50 hover:text-rose-600"
              aria-label={`Clear ${key}`}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                <path d="M7 3h6l1 2h4v2H2V5h4l1-2zm-2 6h2v8H5V9zm4 0h2v8H9V9zm4 0h2v8h-2V9z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-6 text-sm font-semibold text-ink-900">Add Solution</p>
      <RichTextEditor
        value={data.explanation ?? ''}
        onChange={(html) => onChange({ explanation: html })}
        placeholder="Type here"
      />

      <div className="my-6 flex items-center justify-center gap-6 text-ink-500">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-full p-2 hover:bg-surface-muted disabled:opacity-30"
          aria-label="Previous question"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="rounded-full p-2 hover:bg-surface-muted disabled:opacity-30"
          aria-label="Next question"
        >
          ›
        </button>
      </div>

      <h4 className="mb-4 text-sm font-semibold text-ink-900">Question settings</h4>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-sm font-medium text-ink-900">Level of Difficulty</p>
          <Select
            placeholder="Select from Drop-down"
            value={data.difficulty ?? ''}
            onChange={(e) =>
              onChange({ difficulty: (e.target.value || undefined) as DifficultyLevel })
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="difficult">Difficult</option>
          </Select>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-ink-900">Topic</p>
          <Select
            placeholder="Select from Drop-down"
            value={data.topic ?? ''}
            onChange={(e) => onChange({ topic: e.target.value || undefined })}
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-ink-900">Sub-topic</p>
          <Select
            placeholder="Select from Drop-down"
            value={data.sub_topic ?? ''}
            onChange={(e) => onChange({ sub_topic: e.target.value || undefined })}
          >
            {subTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}

import Papa from 'papaparse'
import { useRef } from 'react'
import type { ChangeEvent } from 'react'

import { useToastStore } from '@/store/toastStore'
import type { CorrectOption, DifficultyLevel, NewQuestion } from '@/types/api'

interface CsvRow {
  question?: string
  option1?: string
  option2?: string
  option3?: string
  option4?: string
  correct_option?: string
  explanation?: string
  difficulty?: string
}

const validCorrectOptions: CorrectOption[] = [
  'option1',
  'option2',
  'option3',
  'option4',
]
const validDifficulties: DifficultyLevel[] = ['easy', 'medium', 'difficult']

export function CsvImportButton({
  onImport,
}: {
  onImport: (questions: NewQuestion[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pushToast = useToastStore((state) => state.push)

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const questions: NewQuestion[] = []
        for (const row of result.data) {
          if (!row.question || !row.option1 || !row.option2) continue
          const correctOption = validCorrectOptions.includes(
            row.correct_option as CorrectOption,
          )
            ? (row.correct_option as CorrectOption)
            : 'option1'
          const difficulty = validDifficulties.includes(
            row.difficulty as DifficultyLevel,
          )
            ? (row.difficulty as DifficultyLevel)
            : undefined
          questions.push({
            type: 'mcq',
            question: row.question,
            option1: row.option1 ?? '',
            option2: row.option2 ?? '',
            option3: row.option3 ?? '',
            option4: row.option4 ?? '',
            correct_option: correctOption,
            explanation: row.explanation ?? '',
            difficulty,
          })
        }
        if (questions.length === 0) {
          pushToast('No valid rows found in that CSV.', 'error')
          return
        }
        onImport(questions)
        pushToast(`Imported ${questions.length} question(s) from CSV.`, 'success')
      },
      error: () => pushToast('Could not parse that CSV file.', 'error'),
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-lg border border-ink-300/60 px-3 py-1.5 text-sm text-ink-700 hover:bg-surface-muted"
      >
        ↓ CSV
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFile}
      />
    </>
  )
}

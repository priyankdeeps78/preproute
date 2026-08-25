import { useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { EditTestModal } from '@/features/testForm/EditTestModal'
import type { Test } from '@/types/api'

const typeLabels: Record<Test['type'], string> = {
  chapterwise: 'Chapter Wise',
  pyq: 'PYQ',
  mocktest: 'Mock Test',
}

const difficultyLabels: Record<Test['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  difficult: 'Difficult',
}

export function TestInfoBar({ test }: { test: Test }) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-ink-300/40 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <Badge tone="navy">{typeLabels[test.type] ?? test.type}</Badge>
        <button
          onClick={() => setEditOpen(true)}
          className="rounded-full p-1.5 text-ink-500 hover:bg-surface-muted"
          aria-label="Edit test details"
        >
          <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 fill-current">
            <path d="M14.7 2.3a1 1 0 011.4 0l1.6 1.6a1 1 0 010 1.4L7 15.9l-3.6.7.7-3.6L14.7 2.3z" />
          </svg>
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">📦</span>
        <h2 className="text-lg font-semibold text-ink-900">Chapter 1</h2>
        <Badge tone="teal">{difficultyLabels[test.difficulty]}</Badge>
      </div>

      <dl className="mb-4 grid grid-cols-[100px_1fr] gap-y-2 text-sm">
        <dt className="text-ink-500">Subject</dt>
        <dd className="font-medium text-ink-900">: {test.subject}</dd>
        <dt className="text-ink-500">Topic</dt>
        <dd className="flex flex-wrap gap-1.5">
          :{' '}
          {test.topics.map((topic) => (
            <Badge key={topic} tone="amber">
              {topic}
            </Badge>
          ))}
        </dd>
        <dt className="text-ink-500">Sub Topic</dt>
        <dd className="flex flex-wrap gap-1.5">
          :{' '}
          {test.sub_topics.map((subTopic) => (
            <Badge key={subTopic} tone="amber">
              {subTopic}
            </Badge>
          ))}
        </dd>
      </dl>

      <div className="flex flex-wrap gap-6 border-t border-ink-300/30 pt-4 text-sm text-ink-700">
        <span>⏱ {test.total_time} Min</span>
        <span>📄 {test.total_questions} Q's</span>
        <span>📊 {test.total_marks} Marks</span>
      </div>

      <EditTestModal open={editOpen} onClose={() => setEditOpen(false)} test={test} />
    </div>
  )
}

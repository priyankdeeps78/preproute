import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { Tabs } from '@/components/ui/Tabs'
import { useTest, useUpdateTest } from '@/hooks/useTests'
import { useToastStore } from '@/store/toastStore'

import { LiveUntilSelector, type LiveUntilOption } from './LiveUntilSelector'
import { QuestionPreviewList } from './QuestionPreviewList'

const daysByOption: Partial<Record<LiveUntilOption, number>> = {
  '1_week': 7,
  '2_weeks': 14,
  '3_weeks': 21,
  '1_month': 30,
}

function computeLiveUntil(
  option: LiveUntilOption,
  customDate: string,
  customTime: string,
): string | null {
  if (option === 'always') return null
  if (option === 'custom') {
    if (!customDate) return null
    return new Date(`${customDate}T${customTime || '23:59'}`).toISOString()
  }
  const days = daysByOption[option] ?? 7
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

export function PublishPage() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const pushToast = useToastStore((state) => state.push)
  const testQuery = useTest(testId)
  const updateTest = useUpdateTest(testId)

  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [liveUntil, setLiveUntil] = useState<LiveUntilOption>('always')
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')

  if (!testId) return null

  if (testQuery.isLoading || !testQuery.data) {
    return (
      <AppShell breadcrumb="Test Creation">
        <FullPageSpinner />
      </AppShell>
    )
  }

  const test = testQuery.data
  const questionIds = test.questions ?? []
  const allQuestionsDone = questionIds.length >= test.total_questions

  async function handleConfirm() {
    const live_until = computeLiveUntil(liveUntil, customDate, customTime)
    const scheduled_at =
      publishMode === 'schedule' && scheduleDate
        ? new Date(`${scheduleDate}T${scheduleTime || '00:00'}`).toISOString()
        : null

    try {
      await updateTest.mutateAsync({
        status: 'live',
        live_until,
        scheduled_at,
      })
      pushToast('Test published successfully!', 'success')
      navigate('/dashboard')
    } catch {
      pushToast('Could not publish the test. Please try again.', 'error')
    }
  }

  return (
    <AppShell breadcrumb="Test Creation">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Test creation</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-ink-900">Test created</span>
          <Badge tone={allQuestionsDone ? 'green' : 'amber'}>
            {allQuestionsDone
              ? `All ${test.total_questions} Questions done`
              : `${questionIds.length} of ${test.total_questions} questions added`}
          </Badge>
        </div>

        <div className="rounded-2xl border border-ink-300/40 bg-white p-6">
          <Badge tone="navy" className="mb-4">
            {test.type === 'chapterwise'
              ? 'Chapter Wise'
              : test.type === 'pyq'
                ? 'PYQ'
                : 'Mock Test'}
          </Badge>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-ink-900">{test.name}</h2>
            <Badge tone="teal">{test.difficulty}</Badge>
          </div>
          <dl className="mb-4 grid grid-cols-[100px_1fr] gap-y-2 text-sm">
            <dt className="text-ink-500">Subject</dt>
            <dd className="font-medium text-ink-900">: {test.subject}</dd>
            <dt className="text-ink-500">Topic</dt>
            <dd>
              :{' '}
              {test.topics.map((t) => (
                <Badge key={t} tone="amber" className="mr-1.5">
                  {t}
                </Badge>
              ))}
            </dd>
          </dl>
          <div className="flex gap-6 border-t border-ink-300/30 pt-4 text-sm text-ink-700">
            <span>⏱ {test.total_time} Min</span>
            <span>📄 {test.total_questions} Q's</span>
            <span>📊 {test.total_marks} Marks</span>
          </div>
        </div>

        <QuestionPreviewList
          questionIds={questionIds}
          onEditQuestions={() => navigate(`/tests/${testId}/questions`)}
        />

        <Tabs
          value={publishMode}
          onChange={setPublishMode}
          options={[
            { value: 'now', label: 'Publish Now' },
            { value: 'schedule', label: 'Schedule Publish' },
          ]}
        />

        {publishMode === 'schedule' && (
          <div>
            <h3 className="mb-3 text-base font-semibold text-ink-900">
              Select Date and Time
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>
        )}

        <LiveUntilSelector
          value={liveUntil}
          onChange={setLiveUntil}
          customDate={customDate}
          customTime={customTime}
          onCustomDateChange={setCustomDate}
          onCustomTimeChange={setCustomTime}
        />

        <div className="flex justify-end gap-3 pb-8">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} loading={updateTest.isPending}>
            Confirm
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

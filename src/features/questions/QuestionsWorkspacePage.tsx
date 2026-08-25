import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useBulkCreateQuestions, useFetchBulkQuestions } from '@/hooks/useQuestions'
import { useSubTopics, useSubjects, useTopics } from '@/hooks/useTaxonomy'
import { useTest, useUpdateTest } from '@/hooks/useTests'
import {
  isQuestionComplete,
  useQuestionDraftStore,
} from '@/store/questionDraftStore'
import { useToastStore } from '@/store/toastStore'
import type { NewQuestion } from '@/types/api'

import { QuestionEditor } from './QuestionEditor'
import { QuestionSidebar } from './QuestionSidebar'
import { TestInfoBar } from './TestInfoBar'

export function QuestionsWorkspacePage() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const pushToast = useToastStore((state) => state.push)

  const testQuery = useTest(testId)
  const questionIds = testQuery.data?.questions ?? []
  const fetchBulkQuery = useFetchBulkQuestions(questionIds)
  const bulkCreate = useBulkCreateQuestions()
  const updateTest = useUpdateTest(testId)

  const hydrateFromServer = useQuestionDraftStore((s) => s.hydrateFromServer)
  const addBlank = useQuestionDraftStore((s) => s.addBlank)
  const addMany = useQuestionDraftStore((s) => s.addMany)
  const updateQuestion = useQuestionDraftStore((s) => s.update)
  const removeQuestion = useQuestionDraftStore((s) => s.remove)
  const setActive = useQuestionDraftStore((s) => s.setActive)
  const markSaved = useQuestionDraftStore((s) => s.markSaved)
  const draft = useQuestionDraftStore((s) =>
    testId ? s.draftsByTest[testId] : undefined,
  )

  const subjectsQuery = useSubjects()
  const resolvedSubjectId = testQuery.data
    ? (subjectsQuery.data?.find(
        (s) =>
          s.id === testQuery.data!.subject ||
          s.name.toLowerCase() === testQuery.data!.subject.toLowerCase(),
      )?.id ?? undefined)
    : undefined
  const topicsQuery = useTopics(resolvedSubjectId)
  const subTopicsQuery = useSubTopics(
    topicsQuery.data?.map((t) => t.id) ?? [],
  )

  const [collapsed, setCollapsed] = useState(false)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (testId && fetchBulkQuery.data) {
      hydrateFromServer(testId, fetchBulkQuery.data)
    }
  }, [testId, fetchBulkQuery.data, hydrateFromServer])

  useEffect(() => {
    if (!testId || questionIds.length > 0) return
    const current = useQuestionDraftStore.getState().draftsByTest[testId]
    if (!current || current.questions.length === 0) {
      addBlank(testId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, questionIds.length])

  if (!testId) return null

  if (testQuery.isLoading || (questionIds.length > 0 && fetchBulkQuery.isLoading)) {
    return (
      <AppShell breadcrumb="Test Creation / Create Test">
        <FullPageSpinner />
      </AppShell>
    )
  }

  if (testQuery.isError || !testQuery.data) {
    return (
      <AppShell breadcrumb="Test Creation / Create Test">
        <p className="text-sm text-rose-600">Could not load this test.</p>
      </AppShell>
    )
  }

  const test = testQuery.data
  const questions = draft?.questions ?? []
  const activeLocalId = draft?.activeLocalId ?? questions[0]?.localId ?? null
  const activeIndex = questions.findIndex((q) => q.localId === activeLocalId)
  const activeDraft = activeIndex >= 0 ? questions[activeIndex] : undefined
  const completedCount = questions.filter((q) => isQuestionComplete(q.data)).length

  function handleAddMcq() {
    addBlank(testId!)
  }

  function handleImportCsv(imported: NewQuestion[]) {
    addMany(testId!, imported)
  }

  function handleDeleteAll() {
    for (const q of questions) removeQuestion(testId!, q.localId)
    addBlank(testId!)
    setConfirmDeleteAll(false)
  }

  async function handleNext() {
    if (completedCount === 0) {
      pushToast('Add at least one complete question before continuing.', 'error')
      return
    }
    setSaving(true)
    try {
      const dirty = questions.filter(
        (q) => q.dirty && isQuestionComplete(q.data),
      )
      let newlyCreatedIds: { localId: string; serverId: string }[] = []
      if (dirty.length > 0) {
        const created = await bulkCreate.mutateAsync(
          dirty.map((q) => ({ ...q.data, test_id: testId })),
        )
        newlyCreatedIds = dirty.map((q, i) => ({
          localId: q.localId,
          serverId: created[i]?.id,
        }))
        markSaved(testId!, newlyCreatedIds)
      }

      const savedIdByLocal = new Map(
        newlyCreatedIds.map((n) => [n.localId, n.serverId]),
      )
      const allQuestionIds = questions
        .filter((q) => isQuestionComplete(q.data))
        .map((q) => q.serverId ?? savedIdByLocal.get(q.localId))
        .filter((id): id is string => Boolean(id))

      await updateTest.mutateAsync({
        questions: allQuestionIds,
        total_questions: allQuestionIds.length,
        total_marks: allQuestionIds.length * test.correct_marks,
      })

      navigate(`/tests/${testId}/publish`)
    } catch {
      pushToast('Could not save questions. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell
      breadcrumb="Test Creation / Create Test / Chapter Wise"
      actions={
        <Button onClick={handleNext} loading={saving}>
          Publish
        </Button>
      }
    >
      <div className="flex gap-6">
        <QuestionSidebar
          questions={questions}
          activeLocalId={activeLocalId}
          totalQuestions={test.total_questions}
          onSelect={(localId) => setActive(testId, localId)}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />

        <div className="flex flex-1 flex-col gap-6">
          <TestInfoBar test={test} />

          {activeDraft && (
            <QuestionEditor
              draft={activeDraft}
              index={activeIndex}
              total={questions.length}
              topics={topicsQuery.data ?? []}
              subTopics={subTopicsQuery.data ?? []}
              onChange={(patch) => updateQuestion(testId, activeDraft.localId, patch)}
              onDelete={() => removeQuestion(testId, activeDraft.localId)}
              onPrev={() => {
                const prev = questions[activeIndex - 1]
                if (prev) setActive(testId, prev.localId)
              }}
              onNext={() => {
                const next = questions[activeIndex + 1]
                if (next) setActive(testId, next.localId)
              }}
              onAddMcq={handleAddMcq}
              onImportCsv={handleImportCsv}
              onDeleteAll={() => setConfirmDeleteAll(true)}
            />
          )}

          <div className="flex justify-between">
            <Button variant="danger" onClick={() => navigate('/dashboard')}>
              Exit Test Creation
            </Button>
            <Button onClick={handleNext} loading={saving}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteAll}
        title="Delete all edits"
        description="This clears every question you've added for this test and starts a fresh, blank question. This cannot be undone."
        confirmLabel="Delete all"
        danger
        onConfirm={handleDeleteAll}
        onCancel={() => setConfirmDeleteAll(false)}
      />
    </AppShell>
  )
}

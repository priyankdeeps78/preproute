import { useNavigate } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { useCreateTest } from '@/hooks/useTests'
import { useToastStore } from '@/store/toastStore'

import { TestForm } from './TestForm'
import type { TestFormValues } from './testForm.schema'

export function CreateTestPage() {
  const navigate = useNavigate()
  const createTest = useCreateTest()
  const pushToast = useToastStore((state) => state.push)

  function handleSubmit(values: TestFormValues) {
    createTest.mutate(
      {
        ...values,
        total_marks: values.correct_marks * values.total_questions,
        status: 'draft',
      },
      {
        onSuccess: (test) => {
          pushToast('Test details saved. Now add questions.', 'success')
          navigate(`/tests/${test.id}/questions`)
        },
        onError: () => {
          pushToast('Could not create the test. Please try again.', 'error')
        },
      },
    )
  }

  return (
    <AppShell breadcrumb="Test Creation / Create Test">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-ink-900">
          Create a new test
        </h1>
        <TestForm
          submitLabel="Next: Add Questions"
          submitting={createTest.isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
        />
      </div>
    </AppShell>
  )
}

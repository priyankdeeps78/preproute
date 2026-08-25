import { Modal } from '@/components/ui/Modal'
import { useUpdateTest } from '@/hooks/useTests'
import { useToastStore } from '@/store/toastStore'
import type { Test } from '@/types/api'

import { TestForm } from './TestForm'
import type { TestFormValues } from './testForm.schema'

interface EditTestModalProps {
  open: boolean
  onClose: () => void
  test: Test
}

export function EditTestModal({ open, onClose, test }: EditTestModalProps) {
  const updateTest = useUpdateTest(test.id)
  const pushToast = useToastStore((state) => state.push)

  function handleSubmit(values: TestFormValues) {
    updateTest.mutate(
      {
        ...values,
        total_marks: values.correct_marks * values.total_questions,
      },
      {
        onSuccess: () => {
          pushToast('Test details updated.', 'success')
          onClose()
        },
        onError: () => {
          pushToast('Could not update the test.', 'error')
        },
      },
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Test creation" widthClassName="max-w-4xl">
      <TestForm
        initialTest={test}
        submitLabel="Save"
        submitting={updateTest.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}

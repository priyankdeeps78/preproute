import { useMutation, useQuery } from '@tanstack/react-query'

import { bulkCreateQuestions, fetchBulkQuestions } from '@/api/questions'
import type { NewQuestion } from '@/types/api'

export function useFetchBulkQuestions(questionIds: string[]) {
  return useQuery({
    queryKey: ['questions', 'bulk', questionIds],
    queryFn: () => fetchBulkQuestions(questionIds),
    enabled: questionIds.length > 0,
  })
}

export function useBulkCreateQuestions() {
  return useMutation({
    mutationFn: (questions: NewQuestion[]) => bulkCreateQuestions(questions),
  })
}

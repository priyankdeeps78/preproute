import { apiClient } from '@/api/client'
import type { ApiResponse, NewQuestion, Question } from '@/types/api'

export async function bulkCreateQuestions(questions: NewQuestion[]) {
  const { data } = await apiClient.post<ApiResponse<Question[]>>(
    '/questions/bulk',
    { questions },
  )
  return data.data
}

export async function fetchBulkQuestions(questionIds: string[]) {
  if (questionIds.length === 0) return []
  const { data } = await apiClient.post<ApiResponse<Question[]>>(
    '/questions/fetchBulk',
    { question_ids: questionIds },
  )
  return data.data
}

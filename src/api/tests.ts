import { apiClient } from '@/api/client'
import type { ApiResponse, Test } from '@/types/api'

export type CreateTestPayload = Omit<Test, 'id' | 'created_at' | 'questions'>
export type UpdateTestPayload = Partial<Omit<Test, 'id' | 'created_at'>>

export async function fetchTests() {
  const { data } = await apiClient.get<ApiResponse<Test[]>>('/tests')
  return data.data
}

export async function fetchTestById(id: string) {
  const { data } = await apiClient.get<ApiResponse<Test>>(`/tests/${id}`)
  return data.data
}

export async function createTest(payload: CreateTestPayload) {
  const { data } = await apiClient.post<ApiResponse<Test>>('/tests', payload)
  return data.data
}

export async function updateTest(id: string, payload: UpdateTestPayload) {
  const { data } = await apiClient.put<ApiResponse<Test>>(
    `/tests/${id}`,
    payload,
  )
  return data.data
}

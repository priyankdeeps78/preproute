import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  type CreateTestPayload,
  type UpdateTestPayload,
  createTest,
  fetchTestById,
  fetchTests,
  updateTest,
} from '@/api/tests'

export function useTests() {
  return useQuery({
    queryKey: ['tests'],
    queryFn: fetchTests,
  })
}

export function useTest(id: string | undefined) {
  return useQuery({
    queryKey: ['tests', id],
    queryFn: () => fetchTestById(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTestPayload) => createTest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] })
    },
  })
}

export function useUpdateTest(id: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateTestPayload) =>
      updateTest(id as string, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tests'] })
      queryClient.setQueryData(['tests', id], data)
    },
  })
}

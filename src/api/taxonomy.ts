import { apiClient } from '@/api/client'
import type { ApiResponse, SubTopic, Subject, Topic } from '@/types/api'

export async function fetchSubjects() {
  const { data } = await apiClient.get<ApiResponse<Subject[]>>('/subjects')
  return data.data
}

export async function fetchTopicsBySubject(subjectId: string) {
  const { data } = await apiClient.get<ApiResponse<Topic[]>>(
    `/topics/subject/${subjectId}`,
  )
  return data.data
}

export async function fetchSubTopicsByTopic(topicId: string) {
  const { data } = await apiClient.get<ApiResponse<SubTopic[]>>(
    `/sub-topics/topic/${topicId}`,
  )
  return data.data
}

export async function fetchSubTopicsByTopics(topicIds: string[]) {
  const { data } = await apiClient.post<ApiResponse<SubTopic[]>>(
    '/sub-topics/multi-topics',
    { topicIds },
  )
  return data.data
}

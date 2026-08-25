import { useQuery } from '@tanstack/react-query'

import {
  fetchSubTopicsByTopics,
  fetchSubjects,
  fetchTopicsBySubject,
} from '@/api/taxonomy'

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  })
}

export function useTopics(subjectId: string | undefined) {
  return useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => fetchTopicsBySubject(subjectId as string),
    enabled: Boolean(subjectId),
  })
}

export function useSubTopics(topicIds: string[]) {
  return useQuery({
    queryKey: ['sub-topics', topicIds],
    queryFn: () => fetchSubTopicsByTopics(topicIds),
    enabled: topicIds.length > 0,
  })
}

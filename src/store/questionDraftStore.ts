import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { NewQuestion, Question } from '@/types/api'

export interface DraftQuestion {
  localId: string
  serverId?: string
  dirty: boolean
  data: NewQuestion
}

interface TestDraft {
  questions: DraftQuestion[]
  activeLocalId: string | null
}

interface QuestionDraftState {
  draftsByTest: Record<string, TestDraft>
  hydrateFromServer: (testId: string, questions: Question[]) => void
  addBlank: (testId: string) => string
  addMany: (testId: string, questions: NewQuestion[]) => void
  update: (testId: string, localId: string, patch: Partial<NewQuestion>) => void
  remove: (testId: string, localId: string) => void
  setActive: (testId: string, localId: string) => void
  markSaved: (
    testId: string,
    saved: { localId: string; serverId: string }[],
  ) => void
  clearTest: (testId: string) => void
}

function blankQuestion(): NewQuestion {
  return {
    type: 'mcq',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_option: 'option1',
    explanation: '',
    difficulty: undefined,
    topic: undefined,
    sub_topic: undefined,
    media_url: undefined,
  }
}

function makeLocalId() {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function isQuestionComplete(data: NewQuestion) {
  return Boolean(
    data.question.trim() &&
      data.option1.trim() &&
      data.option2.trim() &&
      data.option3.trim() &&
      data.option4.trim() &&
      data.correct_option,
  )
}

export const useQuestionDraftStore = create<QuestionDraftState>()(
  persist(
    (set, get) => ({
      draftsByTest: {},

      hydrateFromServer: (testId, questions) => {
        const existing = get().draftsByTest[testId]
        if (existing && existing.questions.length > 0) return
        const drafts: DraftQuestion[] = questions.map((q) => ({
          localId: makeLocalId(),
          serverId: q.id,
          dirty: false,
          data: {
            type: 'mcq',
            question: q.question,
            option1: q.option1,
            option2: q.option2,
            option3: q.option3,
            option4: q.option4,
            correct_option: q.correct_option,
            explanation: q.explanation ?? '',
            difficulty: q.difficulty,
            topic: q.topic,
            sub_topic: q.sub_topic,
            media_url: q.media_url,
          },
        }))
        set((state) => ({
          draftsByTest: {
            ...state.draftsByTest,
            [testId]: {
              questions: drafts,
              activeLocalId: drafts[0]?.localId ?? null,
            },
          },
        }))
      },

      addBlank: (testId) => {
        const localId = makeLocalId()
        set((state) => {
          const current = state.draftsByTest[testId] ?? {
            questions: [],
            activeLocalId: null,
          }
          return {
            draftsByTest: {
              ...state.draftsByTest,
              [testId]: {
                questions: [
                  ...current.questions,
                  { localId, dirty: true, data: blankQuestion() },
                ],
                activeLocalId: localId,
              },
            },
          }
        })
        return localId
      },

      addMany: (testId, questions) => {
        set((state) => {
          const current = state.draftsByTest[testId] ?? {
            questions: [],
            activeLocalId: null,
          }
          const newDrafts: DraftQuestion[] = questions.map((data) => ({
            localId: makeLocalId(),
            dirty: true,
            data,
          }))
          return {
            draftsByTest: {
              ...state.draftsByTest,
              [testId]: {
                questions: [...current.questions, ...newDrafts],
                activeLocalId:
                  current.activeLocalId ?? newDrafts[0]?.localId ?? null,
              },
            },
          }
        })
      },

      update: (testId, localId, patch) => {
        set((state) => {
          const current = state.draftsByTest[testId]
          if (!current) return state
          return {
            draftsByTest: {
              ...state.draftsByTest,
              [testId]: {
                ...current,
                questions: current.questions.map((q) =>
                  q.localId === localId
                    ? { ...q, dirty: true, data: { ...q.data, ...patch } }
                    : q,
                ),
              },
            },
          }
        })
      },

      remove: (testId, localId) => {
        set((state) => {
          const current = state.draftsByTest[testId]
          if (!current) return state
          const remaining = current.questions.filter(
            (q) => q.localId !== localId,
          )
          return {
            draftsByTest: {
              ...state.draftsByTest,
              [testId]: {
                questions: remaining,
                activeLocalId:
                  current.activeLocalId === localId
                    ? (remaining[0]?.localId ?? null)
                    : current.activeLocalId,
              },
            },
          }
        })
      },

      setActive: (testId, localId) => {
        set((state) => {
          const current = state.draftsByTest[testId]
          if (!current) return state
          return {
            draftsByTest: {
              ...state.draftsByTest,
              [testId]: { ...current, activeLocalId: localId },
            },
          }
        })
      },

      markSaved: (testId, saved) => {
        set((state) => {
          const current = state.draftsByTest[testId]
          if (!current) return state
          const savedMap = new Map(saved.map((s) => [s.localId, s.serverId]))
          return {
            draftsByTest: {
              ...state.draftsByTest,
              [testId]: {
                ...current,
                questions: current.questions.map((q) =>
                  savedMap.has(q.localId)
                    ? { ...q, serverId: savedMap.get(q.localId), dirty: false }
                    : q,
                ),
              },
            },
          }
        })
      },

      clearTest: (testId) => {
        set((state) => {
          const rest = { ...state.draftsByTest }
          delete rest[testId]
          return { draftsByTest: rest }
        })
      },
    }),
    { name: 'preproute-question-drafts' },
  ),
)

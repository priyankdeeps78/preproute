// The task doc documents `{ success: boolean, data }`, but the live API actually
// responds with `{ status: "success" | "error", data }`. Every api/* module only
// reads `.data`, so this is deliberately typed loose enough to cover both shapes
// rather than assuming either is exact. See TECHNICAL_DECISIONS.md.
export interface ApiResponse<T> {
  success?: boolean
  status?: string
  data: T
  message?: string
}

export interface Subject {
  id: string
  name: string
}

export interface Topic {
  id: string
  name: string
  subject_id: string
}

export interface SubTopic {
  id: string
  name: string
  topic_id: string
}

export type TestType = 'chapterwise' | 'pyq' | 'mocktest'
export type DifficultyLevel = 'easy' | 'medium' | 'difficult'
export type TestStatus = 'draft' | 'live' | 'scheduled' | null

export interface Test {
  id: string
  name: string
  type: TestType
  subject: string
  topics: string[]
  sub_topics: string[]
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: DifficultyLevel
  total_time: number
  total_marks: number
  total_questions: number
  status: TestStatus
  questions?: string[] | null
  created_at?: string
  live_until?: string | null
  scheduled_at?: string | null
}

export type CorrectOption = 'option1' | 'option2' | 'option3' | 'option4'

export interface Question {
  id: string
  type: 'mcq'
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: CorrectOption
  explanation?: string
  difficulty?: DifficultyLevel
  topic?: string
  sub_topic?: string
  media_url?: string
  test_id?: string
}

export type NewQuestion = Omit<Question, 'id'>

export interface LoginPayload {
  userId: string
  password: string
}

export interface AuthUser {
  id?: string
  userId?: string
  name?: string
  role?: string
  [key: string]: unknown
}

export interface LoginResponseData {
  token: string
  user: AuthUser
}

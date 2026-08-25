import { z } from 'zod'

export const testFormSchema = z.object({
  type: z.enum(['chapterwise', 'pyq', 'mocktest']),
  name: z.string().min(1, 'Name of test is required'),
  subject: z.string().min(1, 'Subject is required'),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  sub_topics: z.array(z.string()),
  total_time: z.coerce.number().int().min(1, 'Enter duration in minutes'),
  difficulty: z.enum(['easy', 'medium', 'difficult']),
  wrong_marks: z.coerce.number(),
  unattempt_marks: z.coerce.number(),
  correct_marks: z.coerce.number(),
  total_questions: z.coerce.number().int().min(1, 'Enter number of questions'),
})

export type TestFormValues = z.output<typeof testFormSchema>
export type TestFormInput = z.input<typeof testFormSchema>

export const testFormDefaults: TestFormInput = {
  type: 'chapterwise',
  name: '',
  subject: '',
  topics: [],
  sub_topics: [],
  total_time: 60,
  difficulty: 'easy',
  wrong_marks: -1,
  unattempt_marks: 0,
  correct_marks: 5,
  total_questions: 1,
}

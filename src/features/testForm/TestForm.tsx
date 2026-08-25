import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { MultiSelect } from '@/components/ui/MultiSelect'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { useSubTopics, useSubjects, useTopics } from '@/hooks/useTaxonomy'
import type { Test } from '@/types/api'

import {
  type TestFormInput,
  type TestFormValues,
  testFormDefaults,
  testFormSchema,
} from './testForm.schema'

interface NamedEntity {
  id: string
  name: string
}

function resolveIds(values: string[], options: NamedEntity[]): string[] {
  if (values.length === 0 || options.length === 0) return []
  return values
    .map((value) => {
      const byId = options.find((o) => o.id === value)
      if (byId) return byId.id
      const byName = options.find(
        (o) => o.name.toLowerCase() === value.toLowerCase(),
      )
      return byName?.id
    })
    .filter((v): v is string => Boolean(v))
}

interface TestFormProps {
  initialTest?: Test
  submitLabel: string
  submitting?: boolean
  onSubmit: (values: TestFormValues) => void
  onCancel?: () => void
}

export function TestForm({
  initialTest,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: TestFormProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestFormInput, unknown, TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: testFormDefaults,
  })

  const subjectId = watch('subject')
  const topicIds = watch('topics')
  const correctMarks = Number(watch('correct_marks')) || 0
  const totalQuestions = Number(watch('total_questions')) || 0

  const subjectsQuery = useSubjects()
  const topicsQuery = useTopics(subjectId || undefined)
  const subTopicsQuery = useSubTopics(topicIds)

  const prefilledRef = useRef<string | null>(null)

  useEffect(() => {
    if (!initialTest) return
    if (prefilledRef.current === initialTest.id) return
    if (!subjectsQuery.data) return

    const [subjectResolved] = resolveIds(
      [initialTest.subject],
      subjectsQuery.data,
    )
    setValue('type', initialTest.type ?? 'chapterwise')
    setValue('name', initialTest.name ?? '')
    setValue('total_time', initialTest.total_time ?? 60)
    setValue('difficulty', initialTest.difficulty ?? 'easy')
    setValue('wrong_marks', initialTest.wrong_marks ?? -1)
    setValue('unattempt_marks', initialTest.unattempt_marks ?? 0)
    setValue('correct_marks', initialTest.correct_marks ?? 5)
    setValue('total_questions', initialTest.total_questions ?? 1)
    if (subjectResolved) {
      setValue('subject', subjectResolved)
    }
    prefilledRef.current = initialTest.id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTest, subjectsQuery.data])

  useEffect(() => {
    if (!initialTest || prefilledRef.current !== initialTest.id) return
    if (!topicsQuery.data || topicsQuery.data.length === 0) return
    if (topicIds.length > 0) return
    const resolved = resolveIds(initialTest.topics ?? [], topicsQuery.data)
    if (resolved.length > 0) setValue('topics', resolved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTest, topicsQuery.data])

  useEffect(() => {
    if (!initialTest || prefilledRef.current !== initialTest.id) return
    if (!subTopicsQuery.data || subTopicsQuery.data.length === 0) return
    const resolved = resolveIds(
      initialTest.sub_topics ?? [],
      subTopicsQuery.data,
    )
    if (resolved.length > 0) setValue('sub_topics', resolved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTest, subTopicsQuery.data])

  const computedTotalMarks = useMemo(
    () => (correctMarks || 0) * (totalQuestions || 0),
    [correctMarks, totalQuestions],
  )

  function submitHandler(values: TestFormValues) {
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-6">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Tabs
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: 'chapterwise', label: 'Chapter Wise' },
              { value: 'pyq', label: 'PYQ' },
              { value: 'mocktest', label: 'Mock Test' },
            ]}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
        <Field label="Subject" error={errors.subject?.message}>
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <Select
                placeholder="Choose from Drop-down"
                value={field.value}
                invalid={Boolean(errors.subject)}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  setValue('topics', [])
                  setValue('sub_topics', [])
                }}
              >
                {subjectsQuery.data?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </Field>

        <Field label="Name of Test" error={errors.name?.message}>
          <Input placeholder="Enter name of Test" {...register('name')} />
        </Field>

        <Field label="Topic" error={errors.topics?.message}>
          <Controller
            control={control}
            name="topics"
            render={({ field }) => (
              <MultiSelect
                options={topicsQuery.data ?? []}
                value={field.value}
                onChange={(next) => {
                  field.onChange(next)
                  setValue('sub_topics', [])
                }}
                disabled={!subjectId}
                invalid={Boolean(errors.topics)}
              />
            )}
          />
        </Field>

        <Field label="Sub Topic">
          <Controller
            control={control}
            name="sub_topics"
            render={({ field }) => (
              <MultiSelect
                options={subTopicsQuery.data ?? []}
                value={field.value}
                onChange={field.onChange}
                disabled={topicIds.length === 0}
              />
            )}
          />
        </Field>

        <Field label="Duration (Minutes)" error={errors.total_time?.message}>
          <Input
            type="number"
            placeholder="Enter the time"
            {...register('total_time')}
          />
        </Field>

        <Field label="Test Difficulty Level">
          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <RadioGroup
                name="difficulty"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'difficult', label: 'Difficult' },
                ]}
              />
            )}
          />
        </Field>
      </div>

      <div>
        <span className="text-sm font-medium text-ink-900">Marking Scheme:</span>
        <div className="mt-3 grid grid-cols-2 gap-5 sm:grid-cols-5">
          <Field label="Wrong Answer">
            <Input type="number" {...register('wrong_marks')} />
          </Field>
          <Field label="Unattempted">
            <Input type="number" {...register('unattempt_marks')} />
          </Field>
          <Field label="Correct Answer">
            <Input type="number" {...register('correct_marks')} />
          </Field>
          <Field label="No of Questions" error={errors.total_questions?.message}>
            <Input
              type="number"
              placeholder="Ex: 50"
              {...register('total_questions')}
            />
          </Field>
          <Field label="Total Marks">
            <Input
              readOnly
              value={computedTotalMarks || ''}
              placeholder="Ex:250 Marks"
              className="bg-surface-muted text-ink-500"
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

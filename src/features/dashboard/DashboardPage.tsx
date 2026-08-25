import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useTests } from '@/hooks/useTests'
import type { Test } from '@/types/api'

type StatusFilter = 'all' | 'draft' | 'live' | 'scheduled'

import { StatusBadge } from './StatusBadge'

const typeLabels: Record<Test['type'], string> = {
  chapterwise: 'Chapter Wise',
  pyq: 'PYQ',
  mocktest: 'Mock Test',
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function DashboardPage() {
  const navigate = useNavigate()
  const testsQuery = useTests()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = useMemo(() => {
    const tests = testsQuery.data ?? []
    return tests.filter((test) => {
      const matchesSearch =
        search.trim().length === 0 ||
        test.name.toLowerCase().includes(search.toLowerCase()) ||
        test.subject?.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || (test.status ?? 'draft') === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [testsQuery.data, search, statusFilter])

  function openTest(test: Test) {
    if (test.status === 'live') {
      navigate(`/tests/${test.id}/publish`)
    } else {
      navigate(`/tests/${test.id}/questions`)
    }
  }

  return (
    <AppShell breadcrumb="Dashboard">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Tests</h1>
          <p className="text-sm text-ink-500">
            Create, edit and publish tests for your students.
          </p>
        </div>
        <Button onClick={() => navigate('/tests/new')}>+ Create New Test</Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by test name or subject"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="max-w-[180px]"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="live">Live</option>
          <option value="scheduled">Scheduled</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-300/40 bg-white shadow-sm">
        {testsQuery.isLoading && <FullPageSpinner />}

        {testsQuery.isError && (
          <div className="p-8 text-center text-sm text-rose-600">
            Could not load tests. This backend is known to be unreachable on
            some networks (e.g. Jio), try again on a different connection.
          </div>
        )}

        {testsQuery.data && filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-ink-500">
            No tests match your filters yet.
          </div>
        )}

        {filtered.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Subject</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Questions</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-300/30">
              {filtered.map((test) => (
                <tr key={test.id} className="hover:bg-surface-muted/60">
                  <td className="px-6 py-4 font-medium text-ink-900">
                    {test.name}
                  </td>
                  <td className="px-6 py-4 text-ink-700">{test.subject}</td>
                  <td className="px-6 py-4">
                    <Badge tone="navy">{typeLabels[test.type] ?? test.type}</Badge>
                  </td>
                  <td className="px-6 py-4 text-ink-700">
                    {test.questions?.length ?? 0}/{test.total_questions}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={test.status} />
                  </td>
                  <td className="px-6 py-4 text-ink-500">
                    {formatDate(test.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        className="px-3 py-1.5"
                        onClick={() => openTest(test)}
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-3 py-1.5"
                        onClick={() => navigate(`/tests/${test.id}/questions`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        disabled
                        title="Deleting a test isn't supported by the current API"
                        className="px-3 py-1.5"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  )
}

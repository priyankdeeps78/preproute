import { Badge } from '@/components/ui/Badge'
import type { TestStatus } from '@/types/api'

export function StatusBadge({ status }: { status: TestStatus }) {
  if (status === 'live') return <Badge tone="green">Live</Badge>
  if (status === 'scheduled') return <Badge tone="amber">Scheduled</Badge>
  return <Badge tone="grey">Draft</Badge>
}

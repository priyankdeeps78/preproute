import { Input } from '@/components/ui/Input'
import { RadioGroup } from '@/components/ui/RadioGroup'

export type LiveUntilOption =
  | 'always'
  | '1_week'
  | '2_weeks'
  | '3_weeks'
  | '1_month'
  | 'custom'

interface LiveUntilSelectorProps {
  value: LiveUntilOption
  onChange: (value: LiveUntilOption) => void
  customDate: string
  customTime: string
  onCustomDateChange: (value: string) => void
  onCustomTimeChange: (value: string) => void
}

export function LiveUntilSelector({
  value,
  onChange,
  customDate,
  customTime,
  onCustomDateChange,
  onCustomTimeChange,
}: LiveUntilSelectorProps) {
  return (
    <div>
      <h3 className="mb-1 text-base font-semibold text-ink-900">Live Until</h3>
      <p className="mb-4 text-sm text-ink-500">
        Choose how long this test should remain available on the platform.
      </p>
      <RadioGroup
        name="live-until"
        value={value}
        onChange={onChange}
        columns={2}
        className="gap-y-4"
        options={[
          { value: 'always', label: 'Always Available' },
          { value: '3_weeks', label: '3 Weeks' },
          { value: '1_week', label: '1 Week' },
          { value: '1_month', label: '1 Month' },
          { value: '2_weeks', label: '2 Weeks' },
          { value: 'custom', label: 'Custom Duration' },
        ]}
      />
      {value === 'custom' && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            type="date"
            value={customDate}
            onChange={(e) => onCustomDateChange(e.target.value)}
          />
          <Input
            type="time"
            value={customTime}
            onChange={(e) => onCustomTimeChange(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}

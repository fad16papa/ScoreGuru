import type { ScoreSegment } from '../../features/scores/sportsUtils'

const segments: { id: ScoreSegment; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'finished', label: 'Finished' },
]

type ScoreFilterBarProps = {
  active: ScoreSegment
  onChange: (segment: ScoreSegment) => void
  dateLabel?: string
}

export function ScoreFilterBar({ active, onChange, dateLabel }: ScoreFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1 rounded-lg border border-cr-border-light bg-cr-surface-light p-1 dark:border-cr-border-dark dark:bg-cr-surface-dark">
        {segments.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={[
              'min-h-9 rounded-md px-3 font-inter text-xs font-semibold transition-colors',
              active === s.id
                ? 'bg-cr-purple text-cr-primary-fg-on-primary'
                : 'text-cr-muted hover:text-cr-text-dark dark:text-cr-muted-dark dark:hover:text-cr-text-light',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>
      {dateLabel ? (
        <span className="font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
          {dateLabel}
        </span>
      ) : null}
    </div>
  )
}

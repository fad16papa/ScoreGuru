import type { GameEventDto } from '../../services/types/sportsTypes'
import { Card } from '../shared/Card'
import { EmptyState } from '../shared/EmptyState'

type GameTimelineProps = {
  events: GameEventDto[]
}

export function GameTimeline({ events }: GameTimelineProps) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No match events"
        description="Goals, cards, and substitutions will appear here when available."
      />
    )
  }

  const sorted = [...events].sort(
    (a, b) => (a.timeElapsed ?? 0) - (b.timeElapsed ?? 0),
  )

  return (
    <Card className="divide-y divide-cr-border-light p-0 dark:divide-cr-border-dark">
      {sorted.map((event, index) => (
        <div key={`${event.timeElapsed}-${event.type}-${index}`} className="flex gap-3 px-4 py-3">
          <span className="w-8 shrink-0 font-jakarta text-sm font-bold tabular-nums text-cr-muted dark:text-cr-muted-dark">
            {event.timeElapsed != null ? `${event.timeElapsed}'` : '–'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-inter text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
              {[event.type, event.detail].filter(Boolean).join(' · ')}
            </p>
            {event.playerName ? (
              <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
                {event.playerName}
                {event.teamName ? ` (${event.teamName})` : ''}
                {event.assistName ? ` · Assist: ${event.assistName}` : ''}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </Card>
  )
}

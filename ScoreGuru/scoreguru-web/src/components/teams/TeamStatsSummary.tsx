import { Card } from '../shared/Card'
import type { TeamRecordFromGames } from '../../features/teams/teamUtils'

type TeamStatsSummaryProps = {
  record: TeamRecordFromGames
}

export function TeamStatsSummary({ record }: TeamStatsSummaryProps) {
  const cards = [
    { label: 'Matches', value: record.matches },
    { label: 'Wins', value: record.wins },
    { label: 'Draws', value: record.draws },
    { label: 'Losses', value: record.losses },
  ]

  return (
    <div className="space-y-2">
      <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
        MVP placeholder — counts are derived from loaded finished fixtures only, not full season
        stats.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} padding="sm" className="text-center">
            <p className="font-jakarta text-2xl font-bold tabular-nums text-cr-purple dark:text-cr-text-light">
              {c.value}
            </p>
            <p className="mt-1 font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
              {c.label}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}

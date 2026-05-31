import { Card } from '../shared/Card'
import { EmptyState } from '../shared/EmptyState'
import { GameScoreCard } from '../scores/GameScoreCard'
import type { GameSummaryDto } from '../../services/types/sportsTypes'

type TeamRecentGamesProps = {
  games: GameSummaryDto[]
  teamName: string
}

export function TeamRecentGames({ games, teamName }: TeamRecentGamesProps) {
  if (games.length === 0) {
    return (
      <EmptyState
        title="No recent games"
        description={`No fixtures for ${teamName} in the loaded schedule for this league and date.`}
      />
    )
  }

  return (
    <Card padding="sm" className="overflow-hidden p-0">
      <div className="border-b border-cr-border-light px-4 py-3 dark:border-cr-border-dark">
        <h3 className="font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
          Recent & upcoming
        </h3>
        <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
          From today&apos;s loaded scores for the selected league.
        </p>
      </div>
      <div className="divide-y divide-cr-border-light dark:divide-cr-border-dark">
        {games.slice(0, 10).map((game) => (
          <GameScoreCard key={game.id} game={game} />
        ))}
      </div>
    </Card>
  )
}

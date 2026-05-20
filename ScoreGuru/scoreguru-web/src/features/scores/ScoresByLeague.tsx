import { Card } from '../../components/shared/Card'
import { GameScoreCard } from '../../components/scores/GameScoreCard'
import { LeagueGroupHeader } from '../../components/scores/LeagueGroupHeader'
import type { GameSummaryDto } from '../../services/types/sportsTypes'
import { groupGamesByLeague } from './sportsUtils'

type ScoresByLeagueProps = {
  games: GameSummaryDto[]
}

export function ScoresByLeague({ games }: ScoresByLeagueProps) {
  const groups = groupGamesByLeague(games)

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <Card key={group.leagueId} padding="sm" className="overflow-hidden p-0">
          <LeagueGroupHeader
            leagueId={group.leagueId}
            leagueName={group.leagueName}
            leagueLogoUrl={group.leagueLogoUrl}
            gameCount={group.games.length}
          />
          <div className="divide-y divide-cr-border-light dark:divide-cr-border-dark">
            {group.games.map((game) => (
              <GameScoreCard key={game.id} game={game} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

import { Card } from '../shared/Card'
import { EmptyState } from '../shared/EmptyState'

type PlayerRecentGamesProps = {
  playerName: string
}

export function PlayerRecentGames({ playerName }: PlayerRecentGamesProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
        Recent appearances
      </h3>
      <Card>
        <EmptyState
          title="Not available in MVP"
          description={`Recent match appearances for ${playerName} will appear here once player game history is connected.`}
        />
      </Card>
    </div>
  )
}

import type { PlayerDto } from '../../services/types/sportsTypes'
import { PlayerCard } from '../players/PlayerCard'
import { Card } from '../shared/Card'
import { EmptyState } from '../shared/EmptyState'
import { Skeleton } from '../shared/Skeleton'

type TeamRosterSectionProps = {
  players: PlayerDto[] | undefined
  teamId: number
  leagueId?: number
  season?: number
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export function TeamRosterSection({
  players,
  teamId,
  leagueId,
  season,
  isLoading,
  isError,
  onRetry,
}: TeamRosterSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
        Team roster
      </h3>
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <Card>
          <EmptyState
            title="Could not load roster"
            description="The squad list could not be loaded from the API."
            actionLabel="Try again"
            onAction={onRetry}
          />
        </Card>
      ) : !players?.length ? (
        <Card>
          <EmptyState
            title="No roster data"
            description="No players were returned for this team and season."
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              linkContext={{ teamId, leagueId, season }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

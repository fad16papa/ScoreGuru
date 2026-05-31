import { Link } from 'react-router-dom'
import type { PlayerLinkContext } from '../../features/players/playerLinkUtils'
import { buildPlayerDetailsPath } from '../../features/players/playerLinkUtils'
import type { PlayerDto } from '../../services/types/sportsTypes'
import { Badge } from '../shared/Badge'
import { Card } from '../shared/Card'

type PlayerCardProps = {
  player: PlayerDto
  linkContext?: PlayerLinkContext
}

export function PlayerCard({ player, linkContext }: PlayerCardProps) {
  const context: PlayerLinkContext = {
    teamId: linkContext?.teamId ?? player.teamId ?? undefined,
    leagueId: linkContext?.leagueId,
    season: linkContext?.season,
  }

  return (
    <Link
      to={buildPlayerDetailsPath(player.id, context)}
      className="block transition-opacity hover:opacity-90"
    >
      <Card padding="sm" className="flex items-center gap-3">
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cr-border-light/60 font-jakarta text-sm font-bold text-cr-muted dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark">
            {player.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
            {player.name}
          </p>
          <p className="mt-0.5 truncate font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
            {[player.teamName, player.position].filter(Boolean).join(' · ') || '—'}
          </p>
        </div>
        {player.number !== null ? (
          <Badge variant="muted" className="shrink-0 tabular-nums">
            #{player.number}
          </Badge>
        ) : null}
      </Card>
    </Link>
  )
}

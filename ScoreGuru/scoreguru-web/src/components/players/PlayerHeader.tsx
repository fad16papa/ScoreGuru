import { Link } from 'react-router-dom'
import type { PlayerDto } from '../../services/types/sportsTypes'
import { Badge } from '../shared/Badge'

type PlayerHeaderProps = {
  player: PlayerDto
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-cr-border-light bg-cr-surface-light p-4 dark:border-cr-border-dark dark:bg-cr-surface-dark">
      {player.photoUrl ? (
        <img
          src={player.photoUrl}
          alt=""
          className="h-20 w-20 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-cr-border-light/60 font-jakarta text-xl font-bold text-cr-muted dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark">
          {player.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="font-jakarta text-xl font-bold text-cr-text-dark dark:text-cr-text-light">
          {player.name}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {player.position ? <Badge>{player.position}</Badge> : null}
          {player.number !== null ? (
            <Badge variant="muted">#{player.number}</Badge>
          ) : null}
          {player.nationality ? (
            <Badge variant="highlight">{player.nationality}</Badge>
          ) : null}
        </div>
        {player.teamId && player.teamName ? (
          <Link
            to={`/teams/${player.teamId}`}
            className="mt-2 inline-flex items-center gap-2 font-inter text-sm text-cr-purple hover:text-cr-purple-dark dark:text-cr-text-light dark:hover:text-cr-purple"
          >
            {player.teamLogoUrl ? (
              <img src={player.teamLogoUrl} alt="" className="h-5 w-5 object-contain" />
            ) : null}
            {player.teamName}
          </Link>
        ) : player.teamName ? (
          <p className="mt-2 font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
            {player.teamName}
          </p>
        ) : null}
      </div>
    </div>
  )
}

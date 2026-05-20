import type { GameDetailsDto } from '../../services/types/sportsTypes'
import { formatScore, isLiveStatus } from '../../features/scores/sportsUtils'
import { LiveBadge } from '../scores/LiveBadge'
import { StatusBadge } from '../scores/StatusBadge'

type GameHeaderProps = {
  game: GameDetailsDto
}

export function GameHeader({ game }: GameHeaderProps) {
  const live = isLiveStatus(game.statusShort)

  return (
    <div className="rounded-xl border border-cr-border-light bg-cr-surface-light p-4 dark:border-cr-border-dark dark:bg-cr-surface-dark">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {game.leagueLogoUrl ? (
          <img src={game.leagueLogoUrl} alt="" className="h-5 w-5 object-contain" />
        ) : null}
        <span className="font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
          {game.leagueName}
          {game.season ? ` · ${game.season}` : ''}
        </span>
        {live ? (
          <LiveBadge elapsed={game.elapsed} />
        ) : (
          <StatusBadge
            status={game.status}
            statusShort={game.statusShort}
            elapsed={game.elapsed}
          />
        )}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <TeamBlock name={game.homeTeamName} logoUrl={game.homeTeamLogoUrl} align="end" />
        <div className="text-center">
          <p
            className={[
              'font-jakarta text-3xl font-bold tabular-nums tracking-tight md:text-4xl',
              live ? 'text-cr-orange' : 'text-cr-text-dark dark:text-cr-text-light',
            ].join(' ')}
          >
            {formatScore(game.homeScore, game.awayScore)}
          </p>
          {game.venueName ? (
            <p className="mt-1 font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
              {game.venueName}
              {game.venueCity ? `, ${game.venueCity}` : ''}
            </p>
          ) : null}
        </div>
        <TeamBlock name={game.awayTeamName} logoUrl={game.awayTeamLogoUrl} align="start" />
      </div>
    </div>
  )
}

function TeamBlock({
  name,
  logoUrl,
  align,
}: {
  name: string
  logoUrl: string | null
  align: 'start' | 'end'
}) {
  return (
    <div className={['flex flex-col gap-2', align === 'end' ? 'items-end text-right' : 'items-start'].join(' ')}>
      {logoUrl ? (
        <img src={logoUrl} alt="" className="h-12 w-12 object-contain" loading="lazy" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cr-border-light/60 font-jakarta text-sm font-bold text-cr-muted dark:bg-cr-surface-dark-2">
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span className="font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
        {name}
      </span>
    </div>
  )
}

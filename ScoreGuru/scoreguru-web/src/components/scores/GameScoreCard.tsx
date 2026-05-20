import { Link } from 'react-router-dom'
import type { GameSummaryDto } from '../../services/types/sportsTypes'
import { formatKickoff, formatScore, isLiveStatus } from '../../features/scores/sportsUtils'
import { StatusBadge } from './StatusBadge'

type GameScoreCardProps = {
  game: GameSummaryDto
}

export function GameScoreCard({ game }: GameScoreCardProps) {
  const live = isLiveStatus(game.statusShort)
  const score = formatScore(game.homeScore, game.awayScore)

  return (
    <Link
      to={`/games/${game.id}`}
      className={[
        'flex items-center gap-3 px-4 py-3 transition-colors',
        'hover:bg-cr-bg-light dark:hover:bg-cr-surface-dark-2',
        live ? 'border-l-2 border-l-cr-orange' : '',
      ].join(' ')}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <TeamLine name={game.homeTeamName} logoUrl={game.homeTeamLogoUrl} align="end" />
        <div className="flex shrink-0 flex-col items-center px-2 sm:min-w-[72px]">
          <span
            className={[
              'font-jakarta text-lg font-bold tabular-nums tracking-tight',
              live ? 'text-cr-orange' : 'text-cr-text-dark dark:text-cr-text-light',
            ].join(' ')}
          >
            {score}
          </span>
          <span className="font-inter text-[10px] text-cr-muted dark:text-cr-muted-dark">
            {live ? null : formatKickoff(game.dateUtc)}
          </span>
        </div>
        <TeamLine name={game.awayTeamName} logoUrl={game.awayTeamLogoUrl} align="start" />
      </div>
      <StatusBadge
        status={game.status}
        statusShort={game.statusShort}
        elapsed={game.elapsed}
      />
    </Link>
  )
}

function TeamLine({
  name,
  logoUrl,
  align,
}: {
  name: string
  logoUrl: string | null
  align: 'start' | 'end'
}) {
  return (
    <div
      className={[
        'flex min-w-0 flex-1 items-center gap-2',
        align === 'end' ? 'sm:justify-end sm:text-right' : 'sm:justify-start',
      ].join(' ')}
    >
      {align === 'end' ? (
        <>
          <span className="truncate font-inter text-sm font-medium text-cr-text-dark dark:text-cr-text-light">
            {name}
          </span>
          <TeamLogo logoUrl={logoUrl} name={name} />
        </>
      ) : (
        <>
          <TeamLogo logoUrl={logoUrl} name={name} />
          <span className="truncate font-inter text-sm font-medium text-cr-text-dark dark:text-cr-text-light">
            {name}
          </span>
        </>
      )}
    </div>
  )
}

function TeamLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (logoUrl) {
    return <img src={logoUrl} alt="" className="h-7 w-7 shrink-0 object-contain" loading="lazy" />
  }
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cr-border-light/60 font-inter text-[9px] font-bold text-cr-muted dark:bg-cr-surface-dark-2">
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

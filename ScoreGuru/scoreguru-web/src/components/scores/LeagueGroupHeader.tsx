import { Link } from 'react-router-dom'

type LeagueGroupHeaderProps = {
  leagueId: number
  leagueName: string
  leagueLogoUrl?: string | null
  gameCount: number
}

export function LeagueGroupHeader({
  leagueId,
  leagueName,
  leagueLogoUrl,
  gameCount,
}: LeagueGroupHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-cr-border-light px-4 py-3 dark:border-cr-border-dark">
      {leagueLogoUrl ? (
        <img
          src={leagueLogoUrl}
          alt=""
          className="h-6 w-6 object-contain"
          loading="lazy"
        />
      ) : (
        <div className="flex h-6 w-6 items-center justify-center rounded bg-cr-border-light/50 font-inter text-[10px] font-bold text-cr-muted dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark">
          {leagueName.slice(0, 2).toUpperCase()}
        </div>
      )}
      <Link
        to={`/leagues/${leagueId}`}
        className="font-jakarta text-sm font-semibold text-cr-text-dark hover:text-cr-purple dark:text-cr-text-light dark:hover:text-cr-purple"
      >
        {leagueName}
      </Link>
      <span className="ml-auto font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
        {gameCount} {gameCount === 1 ? 'game' : 'games'}
      </span>
    </div>
  )
}

import type { TeamDto } from '../../services/types/sportsTypes'

type TeamHeaderProps = {
  team: TeamDto
  leagueId: number
  season: number
  leagueLabel?: string
}

export function TeamHeader({ team, leagueId, season, leagueLabel }: TeamHeaderProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-cr-border-light bg-cr-surface-light p-4 dark:border-cr-border-dark dark:bg-cr-surface-dark">
      {team.logoUrl ? (
        <img src={team.logoUrl} alt="" className="h-16 w-16 object-contain" loading="lazy" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cr-border-light/60 font-jakarta text-lg font-bold text-cr-muted dark:bg-cr-surface-dark-2">
          {team.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <h2 className="font-jakarta text-xl font-bold text-cr-text-dark dark:text-cr-text-light">
          {team.name}
        </h2>
        {team.country ? (
          <p className="mt-0.5 font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
            {team.country}
          </p>
        ) : null}
        <p className="mt-1 font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
          {leagueLabel ?? `League ${leagueId}`} · Season {season}
        </p>
      </div>
    </div>
  )
}

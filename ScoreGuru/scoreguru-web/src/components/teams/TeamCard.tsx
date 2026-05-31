import { Link } from 'react-router-dom'
import type { TeamDto } from '../../services/types/sportsTypes'
import { Card } from '../shared/Card'

type TeamCardProps = {
  team: TeamDto
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link to={`/teams/${team.id}`} className="block transition-opacity hover:opacity-90">
      <Card padding="sm" className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-3">
          {team.logoUrl ? (
            <img
              src={team.logoUrl}
              alt=""
              className="h-12 w-12 object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cr-border-light/60 font-jakarta text-sm font-bold text-cr-muted dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark">
              {team.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
              {team.name}
            </p>
            {team.country ? (
              <p className="mt-0.5 truncate font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
                {team.country}
              </p>
            ) : null}
          </div>
        </div>
        <span className="font-inter text-xs font-medium text-cr-purple dark:text-cr-text-light">
          View team →
        </span>
      </Card>
    </Link>
  )
}

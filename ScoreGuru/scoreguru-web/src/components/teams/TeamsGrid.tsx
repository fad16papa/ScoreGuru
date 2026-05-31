import type { TeamDto } from '../../services/types/sportsTypes'
import { TeamCard } from './TeamCard'

type TeamsGridProps = {
  teams: TeamDto[]
}

export function TeamsGrid({ teams }: TeamsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  )
}

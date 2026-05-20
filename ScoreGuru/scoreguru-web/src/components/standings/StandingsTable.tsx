import { Link } from 'react-router-dom'
import type { StandingRowDto } from '../../services/types/sportsTypes'
import { FormIndicatorChips } from './FormIndicatorChips'

type StandingsTableProps = {
  rows: StandingRowDto[]
}

export function StandingsTable({ rows }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-cr-border-light dark:border-cr-border-dark">
      <table className="w-full min-w-[720px] border-collapse font-inter text-sm">
        <thead>
          <tr className="border-b border-cr-border-light bg-cr-bg-light text-left text-xs font-semibold uppercase tracking-wide text-cr-muted dark:border-cr-border-dark dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark">
            <th className="px-3 py-3">Pos</th>
            <th className="px-3 py-3">Team</th>
            <th className="px-3 py-3 text-center">P</th>
            <th className="px-3 py-3 text-center">W</th>
            <th className="px-3 py-3 text-center">D</th>
            <th className="px-3 py-3 text-center">L</th>
            <th className="px-3 py-3 text-center">GF</th>
            <th className="px-3 py-3 text-center">GA</th>
            <th className="px-3 py-3 text-center">GD</th>
            <th className="px-3 py-3 text-center">Pts</th>
            <th className="px-3 py-3">Form</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.teamId}
              className="border-b border-cr-border-light/80 last:border-0 dark:border-cr-border-dark/80"
            >
              <td className="px-3 py-3 font-jakarta font-bold tabular-nums text-cr-text-dark dark:text-cr-text-light">
                {row.rank}
              </td>
              <td className="px-3 py-3">
                <Link
                  to={`/teams/${row.teamId}`}
                  className="flex items-center gap-2 font-medium text-cr-text-dark hover:text-cr-purple dark:text-cr-text-light"
                >
                  {row.teamLogoUrl ? (
                    <img src={row.teamLogoUrl} alt="" className="h-6 w-6 object-contain" />
                  ) : null}
                  {row.teamName}
                </Link>
              </td>
              <td className="px-3 py-3 text-center tabular-nums">{row.played}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.wins}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.draws}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.losses}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.goalsFor}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.goalsAgainst}</td>
              <td className="px-3 py-3 text-center tabular-nums">{row.goalDifference}</td>
              <td className="px-3 py-3 text-center font-jakarta font-bold tabular-nums text-cr-purple dark:text-cr-text-light">
                {row.points}
              </td>
              <td className="px-3 py-3">
                <FormIndicatorChips form={row.form} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

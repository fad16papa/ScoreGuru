import { Link } from 'react-router-dom'
import type { StandingRowDto } from '../../services/types/sportsTypes'
import { Card } from '../shared/Card'
import { FormIndicatorChips } from './FormIndicatorChips'

type MobileStandingsTableProps = {
  rows: StandingRowDto[]
}

export function MobileStandingsTable({ rows }: MobileStandingsTableProps) {
  return (
    <div className="space-y-2 md:hidden">
      {rows.map((row) => (
        <Card key={row.teamId} padding="sm" className="flex items-center gap-3">
          <span className="w-6 font-jakarta text-sm font-bold tabular-nums text-cr-muted dark:text-cr-muted-dark">
            {row.rank}
          </span>
          <div className="min-w-0 flex-1">
            <Link
              to={`/teams/${row.teamId}`}
              className="truncate font-inter text-sm font-semibold text-cr-text-dark dark:text-cr-text-light"
            >
              {row.teamName}
            </Link>
            <p className="mt-0.5 font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
              P {row.played} · W{row.wins} D{row.draws} L{row.losses} · GD {row.goalDifference}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-jakarta text-base font-bold tabular-nums text-cr-purple dark:text-cr-text-light">
              {row.points}
            </span>
            <FormIndicatorChips form={row.form} />
          </div>
        </Card>
      ))}
    </div>
  )
}

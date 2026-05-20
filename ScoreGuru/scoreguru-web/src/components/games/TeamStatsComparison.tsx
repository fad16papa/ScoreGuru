import type { GameDetailsDto, GameStatisticDto } from '../../services/types/sportsTypes'
import { Card } from '../shared/Card'
import { EmptyState } from '../shared/EmptyState'

type TeamStatsComparisonProps = {
  game: GameDetailsDto
  statistics: GameStatisticDto[]
}

export function TeamStatsComparison({ game, statistics }: TeamStatsComparisonProps) {
  if (statistics.length === 0) {
    return (
      <EmptyState
        title="No statistics yet"
        description="Match statistics will appear when the provider supplies them."
      />
    )
  }

  return (
    <Card className="space-y-4">
      <div className="flex justify-between font-jakarta text-xs font-semibold uppercase tracking-wide text-cr-muted dark:text-cr-muted-dark">
        <span className="max-w-[40%] truncate">{game.homeTeamName}</span>
        <span className="max-w-[40%] truncate text-right">{game.awayTeamName}</span>
      </div>
      <div className="space-y-3">
        {statistics.map((stat) => (
          <StatRow key={stat.label} stat={stat} />
        ))}
      </div>
    </Card>
  )
}

function StatRow({ stat }: { stat: GameStatisticDto }) {
  const homeNum = parsePercentOrNumber(stat.homeValue)
  const awayNum = parsePercentOrNumber(stat.awayValue)
  const total = homeNum + awayNum || 1
  const homePct = (homeNum / total) * 100

  return (
    <div>
      <div className="mb-1 flex justify-between font-inter text-xs tabular-nums text-cr-text-dark dark:text-cr-text-light">
        <span>{stat.homeValue ?? '–'}</span>
        <span className="font-medium text-cr-muted dark:text-cr-muted-dark">{stat.label}</span>
        <span>{stat.awayValue ?? '–'}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-cr-border-light dark:bg-cr-surface-dark-2">
        <div className="bg-cr-purple transition-all" style={{ width: `${homePct}%` }} />
        <div className="bg-cr-orange/80 transition-all" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  )
}

function parsePercentOrNumber(value: string | null): number {
  if (!value) return 0
  const cleaned = value.replace('%', '').trim()
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n : 0
}

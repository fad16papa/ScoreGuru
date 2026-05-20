import type { GameDetailsDto } from '../../services/types/sportsTypes'
import { Card } from '../shared/Card'
import { formatKickoff, isLiveStatus } from '../../features/scores/sportsUtils'

type GameDetailsPanelProps = {
  game: GameDetailsDto
}

export function GameDetailsPanel({ game }: GameDetailsPanelProps) {
  const kickoff = formatKickoff(game.dateUtc)
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(game.dateUtc))

  return (
    <Card className="space-y-3">
      <h3 className="font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
        Match information
      </h3>
      <dl className="grid gap-2 font-inter text-sm sm:grid-cols-2">
        <DetailRow label="Status" value={game.status} />
        <DetailRow label="Kickoff" value={`${date} · ${kickoff}`} />
        <DetailRow label="League" value={game.leagueName} />
        <DetailRow label="Season" value={game.season?.toString() ?? '—'} />
        <DetailRow label="Venue" value={game.venueName ?? '—'} />
        <DetailRow label="City" value={game.venueCity ?? '—'} />
        <DetailRow
          label="Lineups"
          value={game.lineups ? 'Available' : 'Not available (MVP)'}
        />
        <DetailRow
          label="Live"
          value={isLiveStatus(game.statusShort) ? 'Yes' : 'No'}
        />
      </dl>
    </Card>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-cr-muted dark:text-cr-muted-dark">{label}</dt>
      <dd className="font-medium text-cr-text-dark dark:text-cr-text-light">{value}</dd>
    </div>
  )
}

import type { PlayerDto } from '../../services/types/sportsTypes'
import { Card } from '../shared/Card'

type PlayerStatCardsProps = {
  player: PlayerDto
}

export function PlayerStatCards({ player }: PlayerStatCardsProps) {
  const profileCards = [
    { label: 'Age', value: player.age !== null ? String(player.age) : '—' },
    { label: 'Nationality', value: player.nationality ?? '—' },
    { label: 'Height', value: player.height ?? '—' },
    { label: 'Weight', value: player.weight ?? '—' },
  ]

  const mvpPlaceholders = [
    { label: 'Appearances', value: '—' },
    { label: 'Goals', value: '—' },
    { label: 'Assists', value: '—' },
    { label: 'Minutes', value: '—' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
          Profile
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {profileCards.map((c) => (
            <Card key={c.label} padding="sm" className="text-center">
              <p className="font-jakarta text-lg font-bold tabular-nums text-cr-purple dark:text-cr-text-light">
                {c.value}
              </p>
              <p className="mt-1 font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
                {c.label}
              </p>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
          Season statistics are not wired in MVP — placeholders below until Phase 2.
        </p>
        <h3 className="mb-2 font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
          Season stats (MVP)
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {mvpPlaceholders.map((c) => (
            <Card key={c.label} padding="sm" className="text-center opacity-70">
              <p className="font-jakarta text-lg font-bold tabular-nums text-cr-muted dark:text-cr-muted-dark">
                {c.value}
              </p>
              <p className="mt-1 font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
                {c.label}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

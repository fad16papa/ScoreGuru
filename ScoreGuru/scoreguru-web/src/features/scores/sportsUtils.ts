import type { GameSummaryDto } from '../../services/types/sportsTypes'

const LIVE_STATUS = new Set(['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT'])
const FINISHED_STATUS = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO', 'ABD', 'CANC'])
const UPCOMING_STATUS = new Set(['NS', 'TBD', 'PST'])

export type ScoreSegment = 'all' | 'live' | 'upcoming' | 'finished'

export function todayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isLiveStatus(statusShort: string): boolean {
  return LIVE_STATUS.has(statusShort.toUpperCase())
}

export function isFinishedStatus(statusShort: string): boolean {
  return FINISHED_STATUS.has(statusShort.toUpperCase())
}

export function isUpcomingStatus(statusShort: string): boolean {
  const s = statusShort.toUpperCase()
  return UPCOMING_STATUS.has(s) || (!isLiveStatus(s) && !isFinishedStatus(s))
}

export function filterGamesBySegment(
  games: GameSummaryDto[],
  segment: ScoreSegment,
): GameSummaryDto[] {
  switch (segment) {
    case 'live':
      return games.filter((g) => isLiveStatus(g.statusShort))
    case 'upcoming':
      return games.filter((g) => isUpcomingStatus(g.statusShort))
    case 'finished':
      return games.filter((g) => isFinishedStatus(g.statusShort))
    default:
      return games
  }
}

export type LeagueGameGroup = {
  leagueId: number
  leagueName: string
  leagueLogoUrl: string | null
  games: GameSummaryDto[]
}

export function groupGamesByLeague(games: GameSummaryDto[]): LeagueGameGroup[] {
  const map = new Map<number, LeagueGameGroup>()

  for (const game of games) {
    const existing = map.get(game.leagueId)
    if (existing) {
      existing.games.push(game)
    } else {
      map.set(game.leagueId, {
        leagueId: game.leagueId,
        leagueName: game.leagueName,
        leagueLogoUrl: game.leagueLogoUrl,
        games: [game],
      })
    }
  }

  return [...map.values()].sort((a, b) => a.leagueName.localeCompare(b.leagueName))
}

export function formatScore(home: number | null, away: number | null): string {
  if (home === null || away === null) {
    return '–'
  }
  return `${home} – ${away}`
}

export function formatKickoff(dateUtc: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateUtc))
  } catch {
    return ''
  }
}

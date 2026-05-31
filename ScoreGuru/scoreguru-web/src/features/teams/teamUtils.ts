import type { GameSummaryDto } from '../../services/types/sportsTypes'
import { isFinishedStatus } from '../scores/sportsUtils'

export type TeamRecordFromGames = {
  matches: number
  wins: number
  draws: number
  losses: number
  form: string
  /** True when stats are computed only from loaded fixtures, not full season data. */
  isDerivedFromLoadedGames: boolean
}

export function gamesForTeam(games: GameSummaryDto[], teamId: number): GameSummaryDto[] {
  return games
    .filter((g) => g.homeTeamId === teamId || g.awayTeamId === teamId)
    .sort((a, b) => new Date(b.dateUtc).getTime() - new Date(a.dateUtc).getTime())
}

export function deriveTeamRecord(
  games: GameSummaryDto[],
  teamId: number,
): TeamRecordFromGames {
  const finished = gamesForTeam(games, teamId).filter((g) =>
    isFinishedStatus(g.statusShort),
  )

  let wins = 0
  let draws = 0
  let losses = 0
  const formChars: string[] = []

  for (const game of [...finished].reverse()) {
    const outcome = resultForTeam(game, teamId)
    if (outcome === 'W') wins += 1
    else if (outcome === 'D') draws += 1
    else if (outcome === 'L') losses += 1
    if (outcome) formChars.push(outcome)
  }

  return {
    matches: finished.length,
    wins,
    draws,
    losses,
    form: formChars.slice(-5).join(''),
    isDerivedFromLoadedGames: true,
  }
}

function resultForTeam(game: GameSummaryDto, teamId: number): 'W' | 'D' | 'L' | null {
  const home = game.homeScore
  const away = game.awayScore
  if (home === null || away === null) {
    return null
  }

  const isHome = game.homeTeamId === teamId
  const teamScore = isHome ? home : away
  const oppScore = isHome ? away : home

  if (teamScore > oppScore) return 'W'
  if (teamScore < oppScore) return 'L'
  return 'D'
}

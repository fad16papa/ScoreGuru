export type SportDto = {
  key: string
  name: string
}

export type LeagueDto = {
  id: number
  name: string
  logoUrl: string | null
  country: string | null
  season: number | null
  sportKey: string
}

export type TeamDto = {
  id: number
  name: string
  logoUrl: string | null
  country: string | null
}

export type GameSummaryDto = {
  id: number
  sportKey: string
  leagueId: number
  leagueName: string
  leagueLogoUrl: string | null
  season: number | null
  dateUtc: string
  status: string
  statusShort: string
  elapsed: number | null
  homeTeamId: number
  homeTeamName: string
  homeTeamLogoUrl: string | null
  awayTeamId: number
  awayTeamName: string
  awayTeamLogoUrl: string | null
  homeScore: number | null
  awayScore: number | null
  venueName: string | null
  venueCity: string | null
}

export type GameEventDto = {
  timeElapsed: number | null
  teamId: number | null
  teamName: string | null
  playerName: string | null
  assistName: string | null
  type: string | null
  detail: string | null
  comments: string | null
}

export type GameStatisticDto = {
  label: string
  homeValue: string | null
  awayValue: string | null
}

export type GameDetailsDto = {
  id: number
  sportKey: string
  leagueId: number
  leagueName: string
  leagueLogoUrl: string | null
  season: number | null
  dateUtc: string
  status: string
  statusShort: string
  elapsed: number | null
  homeTeamId: number
  homeTeamName: string
  homeTeamLogoUrl: string | null
  awayTeamId: number
  awayTeamName: string
  awayTeamLogoUrl: string | null
  homeScore: number | null
  awayScore: number | null
  venueName: string | null
  venueCity: string | null
  events: GameEventDto[]
  statistics: GameStatisticDto[]
  lineups: unknown | null
}

export type StandingRowDto = {
  rank: number
  teamId: number
  teamName: string
  teamLogoUrl: string | null
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string | null
  description: string | null
}

export type LeagueStandingsDto = {
  leagueId: number
  leagueName: string
  season: number
  rows: StandingRowDto[]
}

export type FootballLeaguesParams = {
  country?: string
  season?: number
}

export type TodayFootballScoresParams = {
  date?: string
  league?: number
  season?: number
}

export type FootballStandingsParams = {
  league: number
  season: number
}

export type FootballTeamsParams = {
  league?: number
  season?: number
  country?: string
}

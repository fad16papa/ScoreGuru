import {
  formatFootballSeasonLabel,
  getCurrentFootballSeasonYear,
} from './seasonUtils'

export const PREMIER_LEAGUE_ID = 39

export function getPremierLeaguePreset() {
  const season = getCurrentFootballSeasonYear()
  return {
    league: String(PREMIER_LEAGUE_ID),
    leagueId: PREMIER_LEAGUE_ID,
    leagueName: 'Premier League',
    country: 'England',
    season: String(season),
    seasonLabel: formatFootballSeasonLabel(season),
  } as const
}

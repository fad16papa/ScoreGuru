/** Calendar year (Jan–Dec). */
export function getCalendarYear(date: Date = new Date()): number {
  return date.getFullYear()
}

/**
 * API-FOOTBALL season starting year for European-style leagues.
 * Jul–Dec → current calendar year; Jan–Jun → previous calendar year.
 */
export function getCurrentFootballSeasonYear(date: Date = new Date()): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return month >= 7 ? year : year - 1
}

/** Display label for a football season starting year (e.g. 2025 → "2025/26"). */
export function formatFootballSeasonLabel(season: number): string {
  const suffix = String(season + 1).slice(-2)
  return `${season}/${suffix}`
}

export function getPreviousFootballSeasonYear(season: number): number {
  return season - 1
}

/** @deprecated Use getCurrentFootballSeasonYear for football API filters. */
export function getCurrentSeasonYear(): number {
  return getCurrentFootballSeasonYear()
}

export const SEASON_UNAVAILABLE_HINT =
  'Try a previous season if the latest season is not available yet.'

export const NO_LEAGUES_EMPTY_DESCRIPTION =
  `No leagues found for this season. ${SEASON_UNAVAILABLE_HINT}`

export const NO_TEAMS_EMPTY_DESCRIPTION =
  `No teams found for this league and season. ${SEASON_UNAVAILABLE_HINT}`

export function getFootballSeasonOptions(
  range = 4,
  baseYear?: number,
): Array<{ value: number; label: string }> {
  const start = baseYear ?? getCurrentFootballSeasonYear()
  return Array.from({ length: range }, (_, i) => {
    const year = start - i
    return { value: year, label: formatFootballSeasonLabel(year) }
  })
}

/** @deprecated Use getFootballSeasonOptions */
export function buildFootballSeasonOptions(count = 4, baseYear?: number) {
  return getFootballSeasonOptions(count, baseYear).map((o) => ({
    value: String(o.value),
    label: o.label,
  }))
}

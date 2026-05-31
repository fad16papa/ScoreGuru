export type PlayerLinkContext = {
  teamId?: number
  leagueId?: number
  season?: number
}

export function buildPlayerDetailsPath(playerId: number, context?: PlayerLinkContext): string {
  const params = new URLSearchParams()
  if (context?.teamId !== undefined) {
    params.set('team', String(context.teamId))
  }
  if (context?.leagueId !== undefined) {
    params.set('league', String(context.leagueId))
  }
  if (context?.season !== undefined) {
    params.set('season', String(context.season))
  }
  const query = params.toString()
  return query ? `/players/${playerId}?${query}` : `/players/${playerId}`
}

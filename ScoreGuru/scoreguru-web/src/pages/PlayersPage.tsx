import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { PlayerCard } from '../components/players/PlayerCard'
import { Card } from '../components/shared/Card'
import { CountryLeagueSeasonSelector } from '../components/shared/CountryLeagueSeasonSelector'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { SearchInput } from '../components/shared/SearchInput'
import { Skeleton } from '../components/shared/Skeleton'
import { getPremierLeaguePreset } from '../features/scores/leaguePresets'
import { getScoreQueryOptions } from '../features/scores/queryOptions'
import { SEASON_UNAVAILABLE_HINT } from '../features/scores/seasonUtils'
import { useGetFootballPlayersQuery } from '../services/scoreGuruApi'

export function PlayersPage() {
  const preset = getPremierLeaguePreset()
  const [country, setCountry] = useState<string>(preset.country)
  const [leagueId, setLeagueId] = useState(preset.league)
  const [season, setSeason] = useState(preset.season)
  const [teamId, setTeamId] = useState('')
  const [search, setSearch] = useState('')

  const leagueNum = Number.parseInt(leagueId, 10)
  const seasonNum = Number.parseInt(season, 10)
  const teamNum = teamId.trim() ? Number.parseInt(teamId, 10) : undefined
  const validFilters = Number.isFinite(leagueNum) && Number.isFinite(seasonNum)
  const validTeam = teamNum === undefined || Number.isFinite(teamNum)

  const playersQuery = useGetFootballPlayersQuery(
    {
      league: leagueNum,
      season: seasonNum,
      team: validTeam && teamNum !== undefined ? teamNum : undefined,
      search: search.trim() || undefined,
    },
    getScoreQueryOptions(!validFilters || !validTeam),
  )

  const refresh = () => {
    void playersQuery.refetch()
  }

  const isLoading = playersQuery.isLoading && !playersQuery.data
  const players = playersQuery.data ?? []

  return (
    <PageContainer
      title="Players"
      description="Search and browse football players by country, league, and season."
      actions={
        validFilters ? (
          <RefreshControl
            onRefresh={refresh}
            isRefreshing={playersQuery.isFetching}
            lastUpdatedMs={playersQuery.fulfilledTimeStamp}
            helperText="Player list is cached on the server for several hours."
          />
        ) : undefined
      }
    >
      <div className="mb-6 space-y-4">
        <CountryLeagueSeasonSelector
          country={country}
          leagueId={leagueId}
          season={season}
          onCountryChange={setCountry}
          onLeagueIdChange={setLeagueId}
          onSeasonChange={setSeason}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            aria-label="Search players"
          />
          <label className="block">
            <span className="mb-1 block font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
              Team ID (optional)
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="e.g. 33"
              className="w-full rounded-lg border border-cr-border-light bg-cr-surface-light px-3 py-2 font-inter text-sm text-cr-text-dark outline-none focus:border-cr-purple dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light"
            />
          </label>
        </div>
      </div>

      {!validFilters || !validTeam ? (
        <EmptyState
          title="Invalid filters"
          description="Choose a country, league, and season, or use the Premier League preset."
        />
      ) : isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : playersQuery.isError ? (
        <Card>
          <EmptyState
            title="Could not load players"
            description="Check that the API is running and try again."
            actionLabel="Try again"
            onAction={refresh}
          />
        </Card>
      ) : players.length === 0 ? (
        <Card>
          <EmptyState
            title="No players found"
            description={`No players for this league and season. ${SEASON_UNAVAILABLE_HINT}`}
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              linkContext={{ leagueId: leagueNum, season: seasonNum }}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}

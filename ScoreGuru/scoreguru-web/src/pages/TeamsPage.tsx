import { useMemo, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { TeamsGrid } from '../components/teams/TeamsGrid'
import { Card } from '../components/shared/Card'
import { CountryLeagueSeasonSelector } from '../components/shared/CountryLeagueSeasonSelector'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { SearchInput } from '../components/shared/SearchInput'
import { Skeleton } from '../components/shared/Skeleton'
import { getPremierLeaguePreset } from '../features/scores/leaguePresets'
import {
  getPreviousFootballSeasonYear,
  NO_TEAMS_EMPTY_DESCRIPTION,
} from '../features/scores/seasonUtils'
import { getScoreQueryOptions } from '../features/scores/queryOptions'
import { useGetFootballTeamsQuery } from '../services/scoreGuruApi'

export function TeamsPage() {
  const preset = getPremierLeaguePreset()
  const [country, setCountry] = useState<string>(preset.country)
  const [leagueId, setLeagueId] = useState(preset.league)
  const [season, setSeason] = useState(preset.season)
  const [search, setSearch] = useState('')

  const leagueNum = Number.parseInt(leagueId, 10)
  const seasonNum = Number.parseInt(season, 10)
  const validFilters = Number.isFinite(leagueNum) && Number.isFinite(seasonNum)

  const teamsQuery = useGetFootballTeamsQuery(
    { league: leagueNum, season: seasonNum },
    getScoreQueryOptions(!validFilters),
  )

  const filteredTeams = useMemo(() => {
    const teams = teamsQuery.data ?? []
    const term = search.trim().toLowerCase()
    if (!term) return teams
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(term) ||
        team.country?.toLowerCase().includes(term),
    )
  }, [teamsQuery.data, search])

  const tryPreviousSeason = () => {
    if (!validFilters) return
    setSeason(String(getPreviousFootballSeasonYear(seasonNum)))
  }

  const refresh = () => {
    void teamsQuery.refetch()
  }

  const isLoading = teamsQuery.isLoading && !teamsQuery.data

  return (
    <PageContainer
      title="Teams"
      description="Browse football teams by country, league, and season."
      actions={
        validFilters ? (
          <RefreshControl
            onRefresh={refresh}
            isRefreshing={teamsQuery.isFetching}
            lastUpdatedMs={teamsQuery.fulfilledTimeStamp}
            helperText="Team list is cached on the server for several hours."
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
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by team name…"
          aria-label="Filter teams"
        />
      </div>

      {!validFilters ? (
        <EmptyState
          title="Invalid filters"
          description="Choose a country, league, and season, or use the Premier League preset."
        />
      ) : isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : teamsQuery.isError ? (
        <Card>
          <EmptyState
            title="Could not load teams"
            description="Check that the API is running and try again."
            actionLabel="Try again"
            onAction={refresh}
            secondaryActionLabel="Try previous season"
            onSecondaryAction={tryPreviousSeason}
          />
        </Card>
      ) : filteredTeams.length === 0 ? (
        <Card>
          <EmptyState
            title={teamsQuery.data?.length ? 'No matching teams' : 'No teams found'}
            description={
              teamsQuery.data?.length
                ? 'Try a different local search term.'
                : NO_TEAMS_EMPTY_DESCRIPTION
            }
            secondaryActionLabel={
              teamsQuery.data?.length ? undefined : 'Try previous season'
            }
            onSecondaryAction={teamsQuery.data?.length ? undefined : tryPreviousSeason}
          />
        </Card>
      ) : (
        <TeamsGrid teams={filteredTeams} />
      )}
    </PageContainer>
  )
}

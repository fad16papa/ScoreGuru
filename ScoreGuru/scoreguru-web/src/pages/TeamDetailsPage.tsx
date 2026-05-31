import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { CountryLeagueSeasonSelector } from '../components/shared/CountryLeagueSeasonSelector'
import { RefreshControl } from '../components/shared/RefreshControl'
import { EmptyState } from '../components/shared/EmptyState'
import { Skeleton } from '../components/shared/Skeleton'
import { TeamForm } from '../components/teams/TeamForm'
import { TeamHeader } from '../components/teams/TeamHeader'
import { TeamRecentGames } from '../components/teams/TeamRecentGames'
import { TeamStatsSummary } from '../components/teams/TeamStatsSummary'
import { TeamRosterSection } from '../components/teams/TeamRosterSection'
import { getPremierLeaguePreset } from '../features/scores/leaguePresets'
import { getScoreQueryOptions } from '../features/scores/queryOptions'
import { todayDateString } from '../features/scores/sportsUtils'
import { deriveTeamRecord, gamesForTeam } from '../features/teams/teamUtils'
import {
  useGetFootballTeamRosterQuery,
  useGetFootballTeamsQuery,
  useGetTodayFootballScoresQuery,
} from '../services/scoreGuruApi'

export function TeamDetailsPage() {
  const { teamId = '' } = useParams<{ teamId: string }>()
  const teamNum = Number.parseInt(teamId, 10)

  const preset = getPremierLeaguePreset()
  const [country, setCountry] = useState<string>(preset.country)
  const [leagueId, setLeagueId] = useState(preset.league)
  const [season, setSeason] = useState(preset.season)

  const leagueNum = Number.parseInt(leagueId, 10)
  const seasonNum = Number.parseInt(season, 10)
  const validFilters = Number.isFinite(leagueNum) && Number.isFinite(seasonNum)
  const validTeamId = Number.isFinite(teamNum)

  const teamsQuery = useGetFootballTeamsQuery(
    { league: leagueNum, season: seasonNum },
    getScoreQueryOptions(!validFilters),
  )

  const scoresQuery = useGetTodayFootballScoresQuery(
    {
      date: todayDateString(),
      league: leagueNum,
      season: seasonNum,
    },
    getScoreQueryOptions(!validFilters),
  )

  const rosterQuery = useGetFootballTeamRosterQuery(
    { teamId: teamNum, season: seasonNum },
    getScoreQueryOptions(!validFilters || !validTeamId),
  )

  const team = useMemo(
    () => teamsQuery.data?.find((t) => t.id === teamNum),
    [teamsQuery.data, teamNum],
  )

  const teamGames = useMemo(
    () => (validTeamId ? gamesForTeam(scoresQuery.data ?? [], teamNum) : []),
    [scoresQuery.data, teamNum, validTeamId],
  )

  const record = useMemo(
    () => (validTeamId ? deriveTeamRecord(scoresQuery.data ?? [], teamNum) : null),
    [scoresQuery.data, teamNum, validTeamId],
  )

  const refreshAll = () => {
    void teamsQuery.refetch()
    void scoresQuery.refetch()
    void rosterQuery.refetch()
  }

  const isLoading =
    (teamsQuery.isLoading && !teamsQuery.data) ||
    (scoresQuery.isLoading && !scoresQuery.data)
  const isError = teamsQuery.isError || scoresQuery.isError
  const lastUpdatedMs = Math.max(
    teamsQuery.fulfilledTimeStamp ?? 0,
    scoresQuery.fulfilledTimeStamp ?? 0,
    rosterQuery.fulfilledTimeStamp ?? 0,
  )

  if (!validTeamId) {
    return (
      <PageContainer title="Team">
        <EmptyState title="Invalid team" description="The team id in the URL is not valid." />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={team?.name ?? `Team ${teamId}`}
      description="Basic team profile from loaded league roster and today's fixtures."
      actions={
        validFilters ? (
          <RefreshControl
            onRefresh={refreshAll}
            isRefreshing={teamsQuery.isFetching || scoresQuery.isFetching || rosterQuery.isFetching}
            lastUpdatedMs={lastUpdatedMs || undefined}
            helperText="Roster and today's schedule for the selected league."
          />
        ) : undefined
      }
    >
      <div className="mb-6">
        <CountryLeagueSeasonSelector
          country={country}
          leagueId={leagueId}
          season={season}
          onCountryChange={setCountry}
          onLeagueIdChange={setLeagueId}
          onSeasonChange={setSeason}
        />
      </div>

      {!validFilters ? (
        <EmptyState
          title="Invalid filters"
          description="Choose a league and season, or use the Premier League preset."
        />
      ) : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load team"
          description="Check that the API is running and filters are valid."
          actionLabel="Try again"
          onAction={refreshAll}
        />
      ) : !team ? (
        <EmptyState
          title="Team not found"
          description="This team was not found for the selected league and season."
          actionLabel="Retry"
          onAction={refreshAll}
        />
      ) : (
        <div className="space-y-6">
          <TeamHeader team={team} leagueId={leagueNum} season={seasonNum} />
          {record ? <TeamStatsSummary record={record} /> : null}
          <TeamForm form={record?.form ?? ''} />
          <TeamRecentGames games={teamGames} teamName={team.name} />
          <TeamRosterSection
            players={rosterQuery.data?.players}
            teamId={teamNum}
            leagueId={leagueNum}
            season={seasonNum}
            isLoading={rosterQuery.isLoading && !rosterQuery.data}
            isError={rosterQuery.isError}
            onRetry={() => void rosterQuery.refetch()}
          />
        </div>
      )}
    </PageContainer>
  )
}

import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { ScoresByLeague } from '../features/scores/ScoresByLeague'
import { ScoresDataStates } from '../features/scores/ScoresDataStates'
import { getScoreQueryOptions } from '../features/scores/queryOptions'
import { todayDateString } from '../features/scores/sportsUtils'
import { Card } from '../components/shared/Card'
import { DateSelector } from '../components/shared/DateSelector'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { Tabs } from '../components/shared/Tabs'
import { MobileStandingsTable } from '../components/standings/MobileStandingsTable'
import { StandingsTable } from '../components/standings/StandingsTable'
import type { TeamDto } from '../services/types/sportsTypes'
import {
  useGetFootballLeaguesQuery,
  useGetFootballStandingsQuery,
  useGetFootballTeamsQuery,
  useGetTodayFootballScoresQuery,
} from '../services/scoreGuruApi'

import {
  formatFootballSeasonLabel,
  getCurrentFootballSeasonYear,
  getFootballSeasonOptions,
  SEASON_UNAVAILABLE_HINT,
} from '../features/scores/seasonUtils'

export function LeagueDetailsPage() {
  const defaultSeason = getCurrentFootballSeasonYear()
  const { leagueId = '' } = useParams<{ leagueId: string }>()
  const leagueNum = Number.parseInt(leagueId, 10)
  const [tab, setTab] = useState('games')
  const [season, setSeason] = useState(String(defaultSeason))
  const [selectedDate, setSelectedDate] = useState(todayDateString)
  const seasonNum = Number.parseInt(season, 10)

  const leaguesQuery = useGetFootballLeaguesQuery({ season: defaultSeason })
  const league = leaguesQuery.data?.find((l) => l.id === leagueNum)

  const todayQuery = useGetTodayFootballScoresQuery(
    {
      date: selectedDate,
      league: leagueNum,
      season: Number.isFinite(seasonNum) ? seasonNum : undefined,
    },
    getScoreQueryOptions(!Number.isFinite(leagueNum)),
  )

  const standingsQuery = useGetFootballStandingsQuery(
    { league: leagueNum, season: seasonNum },
    { skip: !Number.isFinite(leagueNum) || !Number.isFinite(seasonNum) || tab !== 'standings' },
  )

  const teamsQuery = useGetFootballTeamsQuery(
    { league: leagueNum, season: seasonNum },
    { skip: !Number.isFinite(leagueNum) || !Number.isFinite(seasonNum) || tab !== 'teams' },
  )

  const games = useMemo(() => todayQuery.data ?? [], [todayQuery.data])

  const tabItems = [
    {
      id: 'games',
      label: 'Games',
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <DateSelector value={selectedDate} onChange={setSelectedDate} />
            <RefreshControl
              onRefresh={() => void todayQuery.refetch()}
              isRefreshing={todayQuery.isFetching}
              lastUpdatedMs={todayQuery.fulfilledTimeStamp}
            />
          </div>
          <ScoresDataStates
            isLoading={todayQuery.isLoading && !todayQuery.data}
            isError={todayQuery.isError}
            isEmpty={!todayQuery.isLoading && games.length === 0}
            onRetry={() => void todayQuery.refetch()}
            emptyTitle="No games on this date"
            emptyDescription="No fixtures for this league on the selected date."
          >
            <ScoresByLeague games={games} />
          </ScoresDataStates>
        </div>
      ),
    },
    {
      id: 'standings',
      label: 'Standings',
      content: (
        <StandingsTab
          season={season}
          setSeason={setSeason}
          standingsQuery={standingsQuery}
        />
      ),
    },
    {
      id: 'teams',
      label: 'Teams',
      content: (
        <TeamsTab season={season} setSeason={setSeason} teamsQuery={teamsQuery} />
      ),
    },
  ]

  return (
    <PageContainer
      title={league?.name ?? `League ${leagueId}`}
      description={league?.country ?? 'Football league'}
    >
      <Card className="mb-6 flex items-center gap-4">
        {league?.logoUrl ? (
          <img src={league.logoUrl} alt="" className="h-14 w-14 object-contain" />
        ) : null}
        <div>
          <p className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
            {league?.country ?? 'Football'}
          </p>
          <p className="font-inter text-xs text-cr-muted">
            Season default: {formatFootballSeasonLabel(defaultSeason)}
          </p>
        </div>
      </Card>
      <Tabs items={tabItems} activeId={tab} onChange={setTab} />
    </PageContainer>
  )
}

function StandingsTab({
  season,
  setSeason,
  standingsQuery,
}: {
  season: string
  setSeason: (v: string) => void
  standingsQuery: ReturnType<typeof useGetFootballStandingsQuery>
}) {
  const seasonNum = Number.parseInt(season, 10)

  if (!season.trim() || !Number.isFinite(seasonNum)) {
    return (
      <EmptyState
        title="Season required"
        description="Enter a season year to load standings."
      />
    )
  }

  if (standingsQuery.isLoading) {
    return <Card>Loading standings…</Card>
  }

  if (standingsQuery.isError) {
    return (
      <EmptyState
        title="Could not load standings"
        actionLabel="Retry"
        onAction={standingsQuery.refetch}
      />
    )
  }

  if (!standingsQuery.data) {
    return <EmptyState title="No standings" description={`No table data for this league and season. ${SEASON_UNAVAILABLE_HINT}`} />
  }

  return (
    <div className="space-y-4">
      <SeasonFilter season={season} setSeason={setSeason} />
      <RefreshControl
        onRefresh={() => void standingsQuery.refetch()}
        isRefreshing={standingsQuery.isFetching}
        lastUpdatedMs={standingsQuery.fulfilledTimeStamp}
      />
      <div className="hidden md:block">
        <StandingsTable rows={standingsQuery.data.rows} />
      </div>
      <MobileStandingsTable rows={standingsQuery.data.rows} />
    </div>
  )
}

function TeamsTab({
  season,
  setSeason,
  teamsQuery,
}: {
  season: string
  setSeason: (v: string) => void
  teamsQuery: ReturnType<typeof useGetFootballTeamsQuery>
}) {
  const seasonNum = Number.parseInt(season, 10)

  if (!season.trim() || !Number.isFinite(seasonNum)) {
    return (
      <EmptyState title="Season required" description="Enter a season year to load teams." />
    )
  }

  if (teamsQuery.isLoading) {
    return <Card>Loading teams…</Card>
  }

  if (teamsQuery.isError) {
    return (
      <EmptyState
        title="Could not load teams"
        actionLabel="Retry"
        onAction={teamsQuery.refetch}
      />
    )
  }

  const teams = teamsQuery.data ?? []

  return (
    <div className="space-y-4">
      <SeasonFilter season={season} setSeason={setSeason} />
      <RefreshControl
        onRefresh={() => void teamsQuery.refetch()}
        isRefreshing={teamsQuery.isFetching}
        lastUpdatedMs={teamsQuery.fulfilledTimeStamp}
      />
      {teams.length === 0 ? (
        <EmptyState title="No teams" description={`No teams found for this league and season. ${SEASON_UNAVAILABLE_HINT}`} />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {teams.map((t: TeamDto) => (
            <Card key={t.id} padding="sm" className="flex items-center gap-3">
              {t.logoUrl ? (
                <img src={t.logoUrl} alt="" className="h-8 w-8 object-contain" />
              ) : null}
              <span className="font-inter text-sm font-medium text-cr-text-dark dark:text-cr-text-light">
                {t.name}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function SeasonFilter({ season, setSeason }: { season: string; setSeason: (v: string) => void }) {
  const seasonNum = Number.parseInt(season, 10)
  const options = getFootballSeasonOptions(4)

  return (
    <label className="flex max-w-xs flex-col gap-1.5">
      <span className="font-inter text-xs font-semibold text-cr-text-dark dark:text-cr-text-light">
        Season
      </span>
      <select
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="min-h-10 rounded-lg border border-cr-border-light bg-cr-surface-light px-3 font-inter text-sm dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light"
      >
        {options.map((option) => (
          <option key={option.value} value={String(option.value)}>
            {option.label}
          </option>
        ))}
        {!options.some((o) => String(o.value) === season) && Number.isFinite(seasonNum) ? (
          <option value={season}>{formatFootballSeasonLabel(seasonNum)}</option>
        ) : null}
      </select>
      <span className="font-inter text-[11px] text-cr-muted dark:text-cr-muted-dark">
        API season {season}. Defaults to {formatFootballSeasonLabel(getCurrentFootballSeasonYear())}.
      </span>
    </label>
  )
}

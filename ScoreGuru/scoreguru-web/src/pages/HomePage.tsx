import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { DateSelector } from '../components/shared/DateSelector'
import { RefreshControl } from '../components/shared/RefreshControl'
import { SportCategoryChip } from '../components/scores/SportCategoryChip'
import { Badge } from '../components/shared/Badge'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'
import { StandingsTable } from '../components/standings/StandingsTable'
import { ScoresByLeague } from '../features/scores/ScoresByLeague'
import { ScoresDataStates } from '../features/scores/ScoresDataStates'
import {
  getLiveScoreQueryOptions,
  getScoreQueryOptions,
} from '../features/scores/queryOptions'
import { livePollingEnabled } from '../services/pollingConfig'
import { todayDateString } from '../features/scores/sportsUtils'
import {
  useGetFootballStandingsQuery,
  useGetLiveFootballScoresQuery,
  useGetTodayFootballScoresQuery,
} from '../services/scoreGuruApi'

const PREVIEW_LEAGUE = 39
const PREVIEW_SEASON = 2024

const pollingHelper = livePollingEnabled
  ? 'Auto-refresh runs when this tab is focused.'
  : 'Auto-refresh is off. Use Refresh to update scores.'

export function HomePage() {
  const [selectedDate, setSelectedDate] = useState(todayDateString)

  const liveQuery = useGetLiveFootballScoresQuery(undefined, getLiveScoreQueryOptions())
  const todayQuery = useGetTodayFootballScoresQuery(
    { date: selectedDate },
    getScoreQueryOptions(),
  )
  const standingsQuery = useGetFootballStandingsQuery(
    { league: PREVIEW_LEAGUE, season: PREVIEW_SEASON },
    getScoreQueryOptions(),
  )

  const liveGames = liveQuery.data ?? []
  const todayGames = todayQuery.data ?? []
  const liveCount = liveGames.length
  const trending = liveGames.slice(0, 3)

  const refreshLive = () => void liveQuery.refetch()
  const refreshToday = () => void todayQuery.refetch()

  return (
    <PageContainer
      title="Home"
      description="Live football scores and quick league context."
      actions={
        <Link
          to="/live"
          className="font-inter text-sm font-semibold text-cr-purple hover:text-cr-purple-dark"
        >
          All live scores
        </Link>
      }
    >
      <Card className="mb-6 border-cr-purple/20 bg-gradient-to-br from-cr-purple/10 to-transparent dark:from-cr-purple/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
              Football
            </p>
            <p className="mt-1 font-jakarta text-2xl font-bold text-cr-text-dark dark:text-cr-text-light">
              {liveQuery.isLoading && !liveQuery.data ? '…' : `${liveCount} live`}
            </p>
          </div>
          <Badge variant="live">{liveCount} live now</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SportCategoryChip label="Football" selected />
        </div>
      </Card>

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-jakarta text-lg font-semibold text-cr-text-dark dark:text-cr-text-light">
            Live now
          </h2>
          <RefreshControl
            onRefresh={refreshLive}
            isRefreshing={liveQuery.isFetching}
            lastUpdatedMs={liveQuery.fulfilledTimeStamp}
            helperText={pollingHelper}
          />
        </div>
        <ScoresDataStates
          isLoading={liveQuery.isLoading && !liveQuery.data}
          isError={liveQuery.isError}
          isEmpty={!liveQuery.isLoading && liveGames.length === 0}
          onRetry={refreshLive}
          emptyTitle="No live games"
          emptyDescription="There are no live fixtures right now. Check the schedule below."
        >
          <ScoresByLeague games={liveGames} />
        </ScoresDataStates>
      </section>

      {trending.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-3 font-jakarta text-lg font-semibold text-cr-text-dark dark:text-cr-text-light">
            <span className="text-cr-yellow">Trending</span> live
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {trending.map((g) => (
              <Link key={g.id} to={`/games/${g.id}`}>
                <Card
                  padding="sm"
                  className="border-cr-yellow/30 transition-colors hover:border-cr-yellow/60"
                >
                  <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
                    {g.leagueName}
                  </p>
                  <p className="mt-2 font-jakarta text-sm font-bold tabular-nums text-cr-text-dark dark:text-cr-text-light">
                    {g.homeTeamName} {g.homeScore ?? '–'} – {g.awayScore ?? '–'} {g.awayTeamName}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-jakarta text-lg font-semibold text-cr-text-dark dark:text-cr-text-light">
            Schedule
          </h2>
          <div className="flex flex-wrap items-end gap-3">
            <DateSelector value={selectedDate} onChange={setSelectedDate} />
            <RefreshControl
              onRefresh={refreshToday}
              isRefreshing={todayQuery.isFetching}
              lastUpdatedMs={todayQuery.fulfilledTimeStamp}
              helperText="Fixture list for the selected date."
            />
          </div>
        </div>
        <ScoresDataStates
          isLoading={todayQuery.isLoading && !todayQuery.data}
          isError={todayQuery.isError}
          isEmpty={!todayQuery.isLoading && todayGames.length === 0}
          onRetry={refreshToday}
          skeletonCount={2}
          emptyTitle="No games on this date"
        >
          <ScoresByLeague games={todayGames.slice(0, 20)} />
        </ScoresDataStates>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-jakarta text-lg font-semibold text-cr-text-dark dark:text-cr-text-light">
            Standings preview
          </h2>
          <Link
            to={`/standings?league=${PREVIEW_LEAGUE}&season=${PREVIEW_SEASON}`}
            className="font-inter text-xs font-semibold text-cr-purple"
          >
            Full table
          </Link>
        </div>
        {standingsQuery.isLoading && !standingsQuery.data ? (
          <Card>
            <p className="font-inter text-sm text-cr-muted">Loading standings…</p>
          </Card>
        ) : standingsQuery.isError ? (
          <EmptyState
            title="Standings unavailable"
            description="Could not load preview standings."
            actionLabel="Retry"
            onAction={() => void standingsQuery.refetch()}
          />
        ) : standingsQuery.data ? (
          <div className="hidden md:block">
            <StandingsTable rows={standingsQuery.data.rows.slice(0, 5)} />
          </div>
        ) : null}
        {standingsQuery.data ? (
          <div className="mt-2 md:hidden">
            <Card padding="sm">
              <ul className="space-y-2">
                {standingsQuery.data.rows.slice(0, 5).map((r) => (
                  <li
                    key={r.teamId}
                    className="flex justify-between font-inter text-sm"
                  >
                    <span>
                      <span className="font-bold tabular-nums text-cr-muted">{r.rank}</span>{' '}
                      {r.teamName}
                    </span>
                    <span className="font-jakarta font-bold tabular-nums text-cr-purple">
                      {r.points}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ) : null}
      </section>
    </PageContainer>
  )
}

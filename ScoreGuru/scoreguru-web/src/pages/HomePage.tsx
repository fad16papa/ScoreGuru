import { Link } from 'react-router-dom'
import { SportCategoryChip } from '../components/scores/SportCategoryChip'
import { Badge } from '../components/shared/Badge'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'
import { PageContainer } from '../components/layout/PageContainer'
import { StandingsTable } from '../components/standings/StandingsTable'
import { ScoresByLeague } from '../features/scores/ScoresByLeague'
import { ScoresDataStates } from '../features/scores/ScoresDataStates'
import { todayDateString } from '../features/scores/sportsUtils'
import {
  useGetFootballStandingsQuery,
  useGetLiveFootballScoresQuery,
  useGetTodayFootballScoresQuery,
} from '../services/scoreGuruApi'

const PREVIEW_LEAGUE = 39
const PREVIEW_SEASON = 2024

export function HomePage() {
  const liveQuery = useGetLiveFootballScoresQuery(undefined, {
    pollingInterval: 30_000,
  })
  const todayQuery = useGetTodayFootballScoresQuery({ date: todayDateString() })
  const standingsQuery = useGetFootballStandingsQuery({
    league: PREVIEW_LEAGUE,
    season: PREVIEW_SEASON,
  })

  const liveGames = liveQuery.data ?? []
  const todayGames = todayQuery.data ?? []
  const liveCount = liveGames.length
  const trending = liveGames.slice(0, 3)

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
              Football · Today
            </p>
            <p className="mt-1 font-jakarta text-2xl font-bold text-cr-text-dark dark:text-cr-text-light">
              {liveQuery.isLoading ? '…' : `${liveCount} live`}
            </p>
          </div>
          <Badge variant="live">{liveCount} live now</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SportCategoryChip label="Football" selected />
        </div>
        <p className="mt-3 font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
          Date: {todayDateString()} (today)
        </p>
      </Card>

      <section className="mb-8">
        <h2 className="mb-3 font-jakarta text-lg font-semibold text-cr-text-dark dark:text-cr-text-light">
          Live now
        </h2>
        <ScoresDataStates
          isLoading={liveQuery.isLoading}
          isError={liveQuery.isError}
          isEmpty={!liveQuery.isLoading && liveGames.length === 0}
          onRetry={liveQuery.refetch}
          emptyTitle="No live games"
          emptyDescription="There are no live fixtures right now. Check today's schedule below."
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
        <h2 className="mb-3 font-jakarta text-lg font-semibold text-cr-text-dark dark:text-cr-text-light">
          Today
        </h2>
        <ScoresDataStates
          isLoading={todayQuery.isLoading}
          isError={todayQuery.isError}
          isEmpty={!todayQuery.isLoading && todayGames.length === 0}
          onRetry={todayQuery.refetch}
          skeletonCount={2}
          emptyTitle="No games today"
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
        {standingsQuery.isLoading ? (
          <Card>
            <p className="font-inter text-sm text-cr-muted">Loading standings…</p>
          </Card>
        ) : standingsQuery.isError ? (
          <EmptyState
            title="Standings unavailable"
            description="Could not load preview standings."
            actionLabel="Retry"
            onAction={standingsQuery.refetch}
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

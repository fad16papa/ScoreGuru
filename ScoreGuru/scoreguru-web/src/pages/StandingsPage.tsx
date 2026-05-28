import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { LeagueSeasonFilters } from '../components/shared/LeagueSeasonFilters'
import { PREMIER_LEAGUE_PRESET } from '../features/scores/leaguePresets'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { Skeleton } from '../components/shared/Skeleton'
import { MobileStandingsTable } from '../components/standings/MobileStandingsTable'
import { StandingsTable } from '../components/standings/StandingsTable'
import { getScoreQueryOptions } from '../features/scores/queryOptions'
import { useGetFootballStandingsQuery } from '../services/scoreGuruApi'

export function StandingsPage() {
  const [searchParams] = useSearchParams()
  const initialLeague = searchParams.get('league') ?? PREMIER_LEAGUE_PRESET.league
  const initialSeason = searchParams.get('season') ?? PREMIER_LEAGUE_PRESET.season

  const [league, setLeague] = useState(initialLeague)
  const [season, setSeason] = useState(initialSeason)

  const leagueNum = Number.parseInt(league, 10)
  const seasonNum = Number.parseInt(season, 10)
  const valid = Number.isFinite(leagueNum) && Number.isFinite(seasonNum)

  const { data, isLoading, isError, isFetching, refetch, fulfilledTimeStamp } =
    useGetFootballStandingsQuery(
      { league: leagueNum, season: seasonNum },
      getScoreQueryOptions(!valid),
    )

  const title = useMemo(
    () => (data ? `${data.leagueName} · ${data.season}` : 'Standings'),
    [data],
  )

  return (
    <PageContainer
      title={title}
      description="Football league table. Use league id and season year."
      actions={
        valid ? (
          <RefreshControl
            onRefresh={() => void refetch()}
            isRefreshing={isFetching}
            lastUpdatedMs={fulfilledTimeStamp}
          />
        ) : undefined
      }
    >
      <div className="mb-6">
        <LeagueSeasonFilters
          league={league}
          season={season}
          onLeagueChange={setLeague}
          onSeasonChange={setSeason}
        />
      </div>

      {!valid ? (
        <EmptyState
          title="Invalid filters"
          description="Enter numeric league and season, or use the Premier League preset."
        />
      ) : isLoading && !data ? (
        <Skeleton className="h-64 w-full" />
      ) : isError ? (
        <EmptyState
          title="Could not load standings"
          description="Check API availability and league/season values."
          actionLabel="Try again"
          onAction={() => void refetch()}
        />
      ) : !data || data.rows.length === 0 ? (
        <EmptyState title="No standings" description="No table rows for this league and season." />
      ) : (
        <>
          <div className="hidden md:block">
            <StandingsTable rows={data.rows} />
          </div>
          <MobileStandingsTable rows={data.rows} />
        </>
      )}
    </PageContainer>
  )
}

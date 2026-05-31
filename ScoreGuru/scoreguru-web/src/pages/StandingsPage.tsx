import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { CountryLeagueSeasonSelector } from '../components/shared/CountryLeagueSeasonSelector'
import { getPremierLeaguePreset } from '../features/scores/leaguePresets'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { Skeleton } from '../components/shared/Skeleton'
import { MobileStandingsTable } from '../components/standings/MobileStandingsTable'
import { StandingsTable } from '../components/standings/StandingsTable'
import { getScoreQueryOptions } from '../features/scores/queryOptions'
import {
  formatFootballSeasonLabel,
  getPreviousFootballSeasonYear,
  SEASON_UNAVAILABLE_HINT,
} from '../features/scores/seasonUtils'
import { useGetFootballStandingsQuery } from '../services/scoreGuruApi'

export function StandingsPage() {
  const [searchParams] = useSearchParams()
  const preset = getPremierLeaguePreset()
  const initialLeague = searchParams.get('league') ?? preset.league
  const initialSeason = searchParams.get('season') ?? preset.season

  const [country, setCountry] = useState<string>(preset.country)
  const [leagueId, setLeagueId] = useState(initialLeague)
  const [season, setSeason] = useState(initialSeason)

  const leagueNum = Number.parseInt(leagueId, 10)
  const seasonNum = Number.parseInt(season, 10)
  const valid = Number.isFinite(leagueNum) && Number.isFinite(seasonNum)

  const { data, isLoading, isError, isFetching, refetch, fulfilledTimeStamp } =
    useGetFootballStandingsQuery(
      { league: leagueNum, season: seasonNum },
      getScoreQueryOptions(!valid),
    )

  const tryPreviousSeason = () => {
    if (!valid) return
    setSeason(String(getPreviousFootballSeasonYear(seasonNum)))
  }

  const title = useMemo(() => {
    if (data) {
      return `${data.leagueName} · ${formatFootballSeasonLabel(data.season)}`
    }
    return 'Standings'
  }, [data])

  return (
    <PageContainer
      title={title}
      description="Football league table by country, league, and season."
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
        <CountryLeagueSeasonSelector
          country={country}
          leagueId={leagueId}
          season={season}
          onCountryChange={setCountry}
          onLeagueIdChange={setLeagueId}
          onSeasonChange={setSeason}
        />
      </div>

      {!valid ? (
        <EmptyState
          title="Invalid filters"
          description="Choose a country, league, and season, or use the Premier League preset."
        />
      ) : isLoading && !data ? (
        <Skeleton className="h-64 w-full" />
      ) : isError ? (
        <EmptyState
          title="Could not load standings"
          description="Check API availability and try again."
          actionLabel="Try again"
          onAction={() => void refetch()}
          secondaryActionLabel="Try previous season"
          onSecondaryAction={tryPreviousSeason}
        />
      ) : !data || data.rows.length === 0 ? (
        <EmptyState
          title="No standings"
          description={`No table rows for this league and season. ${SEASON_UNAVAILABLE_HINT}`}
          secondaryActionLabel="Try previous season"
          onSecondaryAction={tryPreviousSeason}
        />
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

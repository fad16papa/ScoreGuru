import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { CountryLeagueSeasonSelector } from '../components/shared/CountryLeagueSeasonSelector'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { Skeleton } from '../components/shared/Skeleton'
import { getPremierLeaguePreset } from '../features/scores/leaguePresets'
import {
  formatFootballSeasonLabel,
  getPreviousFootballSeasonYear,
  NO_LEAGUES_EMPTY_DESCRIPTION,
} from '../features/scores/seasonUtils'
import { useGetFootballLeaguesQuery } from '../services/scoreGuruApi'

export function LeaguesPage() {
  const preset = getPremierLeaguePreset()
  const [country, setCountry] = useState<string>(preset.country)
  const [season, setSeason] = useState(preset.season)

  const seasonNum = Number.parseInt(season, 10)
  const validSeason = Number.isFinite(seasonNum)

  const { data, isLoading, isError, refetch, isFetching, fulfilledTimeStamp } =
    useGetFootballLeaguesQuery({
      country: country.trim() || undefined,
      season: validSeason ? seasonNum : undefined,
    })

  const leagues = useMemo(() => {
    const list = [...(data ?? [])]
    list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [data])

  const tryPreviousSeason = () => {
    if (!validSeason) return
    setSeason(String(getPreviousFootballSeasonYear(seasonNum)))
  }

  return (
    <PageContainer
      title="Leagues"
      description="Browse football leagues by country and season."
      actions={
        <RefreshControl
          onRefresh={() => void refetch()}
          isRefreshing={isFetching}
          lastUpdatedMs={fulfilledTimeStamp}
        />
      }
    >
      <div className="mb-6">
        <CountryLeagueSeasonSelector
          country={country}
          leagueId={preset.league}
          season={season}
          onCountryChange={setCountry}
          onSeasonChange={setSeason}
          showLeagueSelect={false}
          showPreset={false}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load leagues"
          description="Check that the API is running and try again."
          actionLabel="Try again"
          onAction={() => void refetch()}
          secondaryActionLabel="Try previous season"
          onSecondaryAction={tryPreviousSeason}
        />
      ) : leagues.length === 0 ? (
        <EmptyState
          title="No leagues found"
          description={NO_LEAGUES_EMPTY_DESCRIPTION}
          secondaryActionLabel="Try previous season"
          onSecondaryAction={tryPreviousSeason}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <Link key={`${league.id}-${league.season}`} to={`/leagues/${league.id}`}>
              <Card className="flex items-center gap-3 transition-colors hover:border-cr-purple/40">
                {league.logoUrl ? (
                  <img src={league.logoUrl} alt="" className="h-10 w-10 object-contain" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cr-border-light/50 font-jakarta text-xs font-bold dark:bg-cr-surface-dark-2">
                    {league.name.slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
                    {league.name}
                  </p>
                  <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
                    {[league.country, league.season ? formatFootballSeasonLabel(league.season) : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

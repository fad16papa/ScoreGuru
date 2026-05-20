import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'
import { Skeleton } from '../components/shared/Skeleton'
import { useGetFootballLeaguesQuery } from '../services/scoreGuruApi'

export function LeaguesPage() {
  const [country, setCountry] = useState('')
  const [season, setSeason] = useState('2024')

  const seasonNum = season.trim() ? Number.parseInt(season, 10) : undefined
  const { data, isLoading, isError, refetch } = useGetFootballLeaguesQuery({
    country: country.trim() || undefined,
    season: Number.isFinite(seasonNum) ? seasonNum : undefined,
  })

  const leagues = data ?? []

  return (
    <PageContainer title="Leagues" description="Browse football leagues from ScoreGuru.">
      <div className="mb-6 flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. England"
            className="min-h-10 rounded-lg border border-cr-border-light bg-cr-surface-light px-3 text-sm text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light"
          />
        </label>
        <label className="flex flex-col gap-1 font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
          Season
          <input
            type="text"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="2024"
            className="w-24 min-h-10 rounded-lg border border-cr-border-light bg-cr-surface-light px-3 text-sm text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light"
          />
        </label>
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
          description="Check that the API is running."
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : leagues.length === 0 ? (
        <EmptyState title="No leagues found" description="Try different country or season filters." />
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
                    {[league.country, league.season].filter(Boolean).join(' · ')}
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

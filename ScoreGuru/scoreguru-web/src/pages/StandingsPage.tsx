import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'
import { Skeleton } from '../components/shared/Skeleton'
import { MobileStandingsTable } from '../components/standings/MobileStandingsTable'
import { StandingsTable } from '../components/standings/StandingsTable'
import { useGetFootballStandingsQuery } from '../services/scoreGuruApi'

const DEFAULT_LEAGUE = 39
const DEFAULT_SEASON = 2024

export function StandingsPage() {
  const [searchParams] = useSearchParams()
  const initialLeague = searchParams.get('league') ?? String(DEFAULT_LEAGUE)
  const initialSeason = searchParams.get('season') ?? String(DEFAULT_SEASON)

  const [league, setLeague] = useState(initialLeague)
  const [season, setSeason] = useState(initialSeason)

  const leagueNum = Number.parseInt(league, 10)
  const seasonNum = Number.parseInt(season, 10)
  const valid = Number.isFinite(leagueNum) && Number.isFinite(seasonNum)

  const { data, isLoading, isError, refetch } = useGetFootballStandingsQuery(
    { league: leagueNum, season: seasonNum },
    { skip: !valid },
  )

  const title = useMemo(
    () => (data ? `${data.leagueName} · ${data.season}` : 'Standings'),
    [data],
  )

  return (
    <PageContainer title={title} description="Football league table (MVP).">
      <div className="mb-6 flex flex-wrap gap-3">
        <FilterField label="League ID" value={league} onChange={setLeague} />
        <FilterField label="Season" value={season} onChange={setSeason} width="w-28" />
      </div>

      {!valid ? (
        <EmptyState
          title="Invalid filters"
          description="Enter numeric league and season (defaults: 39 and 2024 for mock/dev)."
        />
      ) : isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : isError ? (
        <EmptyState
          title="Could not load standings"
          description="Check API availability and league/season values."
          actionLabel="Try again"
          onAction={refetch}
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

function FilterField({
  label,
  value,
  onChange,
  width = 'w-32',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  width?: string
}) {
  return (
    <label className="flex flex-col gap-1 font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark">
      {label}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'min-h-10 rounded-lg border border-cr-border-light bg-cr-surface-light px-3 text-sm text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light',
          width,
        ].join(' ')}
      />
    </label>
  )
}

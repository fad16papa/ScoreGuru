import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { SearchInput } from '../components/shared/SearchInput'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'
import { useGetFootballLeaguesQuery, useGetFootballTeamsQuery } from '../services/scoreGuruApi'

const DEFAULT_SEASON = 2024
const DEFAULT_LEAGUE = 39

export function SearchPage() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const leaguesQuery = useGetFootballLeaguesQuery({ season: DEFAULT_SEASON })
  const teamsQuery = useGetFootballTeamsQuery(
    { league: DEFAULT_LEAGUE, season: DEFAULT_SEASON },
    { skip: !q },
  )

  const leagueMatches = useMemo(() => {
    const list = leaguesQuery.data ?? []
    if (!q) return []
    return list.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.country?.toLowerCase().includes(q) ?? false),
    )
  }, [leaguesQuery.data, q])

  const teamMatches = useMemo(() => {
    const list = teamsQuery.data ?? []
    if (!q) return []
    return list.filter((t) => t.name.toLowerCase().includes(q))
  }, [teamsQuery.data, q])

  const hasResults = leagueMatches.length > 0 || teamMatches.length > 0

  return (
    <PageContainer
      title="Search"
      description="Search loaded leagues and teams (client-side MVP)."
    >
      <SearchInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search leagues or teams…"
        className="mb-6 max-w-md"
      />

      {!q ? (
        <EmptyState
          title="Start typing"
          description="Leagues are loaded from ScoreGuru. Teams load when you search (league 39, season 2024)."
        />
      ) : leaguesQuery.isLoading ? (
        <p className="font-inter text-sm text-cr-muted">Loading…</p>
      ) : !hasResults ? (
        <EmptyState title="No results" description={`Nothing matched "${query}".`} />
      ) : (
        <div className="space-y-8">
          {leagueMatches.length > 0 ? (
            <section>
              <h2 className="mb-3 font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
                Leagues
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {leagueMatches.map((l) => (
                  <Link key={l.id} to={`/leagues/${l.id}`}>
                    <Card padding="sm">{l.name}</Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
          {teamMatches.length > 0 ? (
            <section>
              <h2 className="mb-3 font-jakarta text-sm font-semibold text-cr-text-dark dark:text-cr-text-light">
                Teams
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {teamMatches.map((t) => (
                  <Link key={t.id} to={`/teams/${t.id}`}>
                    <Card padding="sm" className="flex items-center gap-2">
                      {t.logoUrl ? (
                        <img src={t.logoUrl} alt="" className="h-6 w-6 object-contain" />
                      ) : null}
                      {t.name}
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </PageContainer>
  )
}

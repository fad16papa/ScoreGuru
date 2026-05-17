import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

function Placeholder({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <PageContainer title={title} description={body}>
      <EmptyState title="Coming soon" description={body} />
    </PageContainer>
  )
}

export function LiveScoresPage() {
  return (
    <Placeholder
      title="Live Scores"
      body="Filters, status segments, and grouped score cards will load here."
    />
  )
}

export function LeaguesPage() {
  return (
    <Placeholder title="Leagues" body="League browser and detail routes will link from here." />
  )
}

export function StandingsPage() {
  return (
    <Placeholder
      title="Standings"
      body="Season selector and standings table variants will render here."
    />
  )
}

export function TeamsPage() {
  return <Placeholder title="Teams" body="Team directory and detail pages stub." />
}

export function PlayersPage() {
  return <Placeholder title="Players" body="Player directory and detail pages stub." />
}

export function FavoritesPage() {
  return (
    <Placeholder
      title="Favorites"
      body="Favorite teams, leagues, players, and games — alerts stay Phase 2."
    />
  )
}

export function SearchPage() {
  return (
    <Placeholder
      title="Search"
      body="Global search grouped by entity type with recent searches."
    />
  )
}

import { PageContainer } from '../components/layout/PageContainer'
import { EmptyState } from '../components/shared/EmptyState'

export { LiveScoresPage } from './LiveScoresPage'
export { LeaguesPage } from './LeaguesPage'
export { StandingsPage } from './StandingsPage'
export { SearchPage } from './SearchPage'

function Placeholder({ title, body }: { title: string; body: string }) {
  return (
    <PageContainer title={title} description={body}>
      <EmptyState title="Coming soon" description={body} />
    </PageContainer>
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

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

export function FavoritesPage() {
  return (
    <Placeholder
      title="Favorites"
      body="Favorite teams, leagues, players, and games — alerts stay Phase 2."
    />
  )
}

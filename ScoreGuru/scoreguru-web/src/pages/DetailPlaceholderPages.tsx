import { useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'

type PlaceholderCopy = {
  title: string
  heading: string
  body: string
}

function DetailPlaceholder({ copy, idParam }: { copy: PlaceholderCopy; idParam: string }) {
  return (
    <PageContainer title={copy.title} description="MVP placeholder — API wiring comes later.">
      <Card className="space-y-4">
        {idParam ? (
          <p className="font-inter text-xs font-medium uppercase tracking-wider text-cr-muted dark:text-cr-muted-dark">
            Resource ID
            <span className="mt-1 block font-inter text-sm font-normal normal-case tracking-normal text-cr-text-dark dark:text-cr-text-light">
              {idParam}
            </span>
          </p>
        ) : null}
        <EmptyState title={copy.heading} description={copy.body} />
      </Card>
    </PageContainer>
  )
}

const gameCopy: PlaceholderCopy = {
  title: 'Game details',
  heading: 'Game Details coming soon',
  body: 'Live score header, timeline, team comparison, and sport-aware stats will load here once the backend is connected.',
}

const leagueCopy: PlaceholderCopy = {
  title: 'League details',
  heading: 'League Details coming soon',
  body: 'Season selector, fixtures by date, standings snapshot, and squad lists will appear in this workspace.',
}

const playerCopy: PlaceholderCopy = {
  title: 'Player details',
  heading: 'Player Details coming soon',
  body: 'Player bio, club link, seasonal stats, and recent appearances will show here without advanced analytics.',
}

export function GameDetailPlaceholderPage() {
  const { gameId = '' } = useParams<{ gameId: string }>()
  return <DetailPlaceholder copy={gameCopy} idParam={gameId} />
}

export function LeagueDetailPlaceholderPage() {
  const { leagueId = '' } = useParams<{ leagueId: string }>()
  return <DetailPlaceholder copy={leagueCopy} idParam={leagueId} />
}

export function PlayerDetailPlaceholderPage() {
  const { playerId = '' } = useParams<{ playerId: string }>()
  return <DetailPlaceholder copy={playerCopy} idParam={playerId} />
}

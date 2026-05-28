import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { GameDetailsPanel } from '../components/games/GameDetailsPanel'
import { GameHeader } from '../components/games/GameHeader'
import { GameTabs, type GameTabId } from '../components/games/GameTabs'
import { GameTimeline } from '../components/games/GameTimeline'
import { TeamStatsComparison } from '../components/games/TeamStatsComparison'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { Skeleton } from '../components/shared/Skeleton'
import { getGameDetailsQueryOptions } from '../features/scores/queryOptions'
import { formatScore, isLiveStatus } from '../features/scores/sportsUtils'
import { livePollingEnabled } from '../services/pollingConfig'
import { useGetFootballGameDetailsQuery } from '../services/scoreGuruApi'

const pollingHelper = livePollingEnabled
  ? 'Live games may auto-refresh when polling is enabled.'
  : 'Manual refresh only — polling disabled by default.'

export function GameDetailsPage() {
  const { gameId = '' } = useParams<{ gameId: string }>()
  const id = Number.parseInt(gameId, 10)
  const validId = Number.isFinite(id)
  const [tab, setTab] = useState<GameTabId>('summary')
  const [pollLive, setPollLive] = useState(false)

  const { data, isLoading, isError, isFetching, refetch, fulfilledTimeStamp } =
    useGetFootballGameDetailsQuery(id, {
      skip: !validId,
      ...getGameDetailsQueryOptions(pollLive),
    })

  const isLiveDerived = data ? isLiveStatus(data.statusShort) : false
  if (isLiveDerived !== pollLive) {
    setPollLive(isLiveDerived)
  }

  const refresh = () => void refetch()

  if (!validId) {
    return (
      <PageContainer title="Game">
        <EmptyState title="Invalid game" description="The game id in the URL is not valid." />
      </PageContainer>
    )
  }

  if (isLoading && !data) {
    return (
      <PageContainer title="Game">
        <Skeleton className="mb-4 h-40 w-full" />
        <Skeleton className="h-8 w-64" />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer title="Game">
        <EmptyState
          title="Could not load game"
          description="The game may not exist or the API is unavailable."
          actionLabel="Try again"
          onAction={refresh}
        />
      </PageContainer>
    )
  }

  if (!data) {
    return (
      <PageContainer title="Game">
        <EmptyState title="Game not found" description={`No details for game ${gameId}.`} />
      </PageContainer>
    )
  }

  const live = isLiveStatus(data.statusShort)

  return (
    <PageContainer
      title={`${data.homeTeamName} vs ${data.awayTeamName}`}
      actions={
        <RefreshControl
          onRefresh={refresh}
          isRefreshing={isFetching}
          lastUpdatedMs={fulfilledTimeStamp}
          helperText={pollingHelper}
        />
      }
    >
      <GameHeader game={data} />
      <div className="mt-6">
        <GameTabs
          activeId={tab}
          onChange={setTab}
          summary={
            <Card className="space-y-2">
              <p className="font-jakarta text-2xl font-bold tabular-nums">
                {formatScore(data.homeScore, data.awayScore)}
              </p>
              <p className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
                {data.status}
                {live && data.elapsed != null ? ` · ${data.elapsed}'` : ''}
              </p>
              <p className="font-inter text-xs text-cr-muted">
                {data.events.length} events · {data.statistics.length} stat groups
              </p>
            </Card>
          }
          live={<GameTimeline events={data.events} />}
          stats={<TeamStatsComparison game={data} statistics={data.statistics} />}
          details={<GameDetailsPanel game={data} />}
        />
      </div>
    </PageContainer>
  )
}

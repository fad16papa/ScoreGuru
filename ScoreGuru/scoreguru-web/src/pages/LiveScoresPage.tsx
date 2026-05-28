import { useMemo, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { DateSelector } from '../components/shared/DateSelector'
import { RefreshControl } from '../components/shared/RefreshControl'
import { ScoreFilterBar } from '../components/scores/ScoreFilterBar'
import { SportCategoryChip } from '../components/scores/SportCategoryChip'
import { ScoresByLeague } from '../features/scores/ScoresByLeague'
import { ScoresDataStates } from '../features/scores/ScoresDataStates'
import {
  getLiveScoreQueryOptions,
  getScoreQueryOptions,
} from '../features/scores/queryOptions'
import { livePollingEnabled } from '../services/pollingConfig'
import {
  filterGamesBySegment,
  todayDateString,
  type ScoreSegment,
} from '../features/scores/sportsUtils'
import {
  useGetLiveFootballScoresQuery,
  useGetTodayFootballScoresQuery,
} from '../services/scoreGuruApi'

const pollingHelper = livePollingEnabled
  ? 'Live tab auto-refreshes when focused.'
  : 'Live tab uses manual refresh unless polling is enabled in env.'

export function LiveScoresPage() {
  const [segment, setSegment] = useState<ScoreSegment>('live')
  const [selectedDate, setSelectedDate] = useState(todayDateString)

  const liveQuery = useGetLiveFootballScoresQuery(
    undefined,
    getLiveScoreQueryOptions(segment !== 'live'),
  )
  const todayQuery = useGetTodayFootballScoresQuery(
    { date: selectedDate },
    getScoreQueryOptions(segment === 'live'),
  )

  const isLiveSegment = segment === 'live'
  const activeQuery = isLiveSegment ? liveQuery : todayQuery
  const isLoading = activeQuery.isLoading && !activeQuery.data
  const isError = activeQuery.isError
  const refresh = () => void activeQuery.refetch()

  const games = useMemo(() => {
    if (isLiveSegment) {
      return liveQuery.data ?? []
    }
    const today = todayQuery.data ?? []
    return filterGamesBySegment(today, segment)
  }, [isLiveSegment, liveQuery.data, todayQuery.data, segment])

  return (
    <PageContainer title="Live Scores" description="Football fixtures grouped by league.">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <SportCategoryChip label="Football" selected />
        </div>
        <RefreshControl
          onRefresh={refresh}
          isRefreshing={activeQuery.isFetching}
          lastUpdatedMs={activeQuery.fulfilledTimeStamp}
          helperText={isLiveSegment ? pollingHelper : 'Filtered from the selected date.'}
        />
      </div>
      <ScoreFilterBar active={segment} onChange={setSegment} />
      {!isLiveSegment ? (
        <div className="mt-3">
          <DateSelector value={selectedDate} onChange={setSelectedDate} />
        </div>
      ) : null}
      <div className="mt-6">
        <ScoresDataStates
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && games.length === 0}
          onRetry={refresh}
          emptyTitle={
            isLiveSegment ? 'No live games' : `No ${segment} games on ${selectedDate}`
          }
        >
          <ScoresByLeague games={games} />
        </ScoresDataStates>
      </div>
    </PageContainer>
  )
}

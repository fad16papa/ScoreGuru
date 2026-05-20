import { useMemo, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { ScoreFilterBar } from '../components/scores/ScoreFilterBar'
import { SportCategoryChip } from '../components/scores/SportCategoryChip'
import { ScoresByLeague } from '../features/scores/ScoresByLeague'
import { ScoresDataStates } from '../features/scores/ScoresDataStates'
import {
  filterGamesBySegment,
  todayDateString,
  type ScoreSegment,
} from '../features/scores/sportsUtils'
import {
  useGetLiveFootballScoresQuery,
  useGetTodayFootballScoresQuery,
} from '../services/scoreGuruApi'

export function LiveScoresPage() {
  const [segment, setSegment] = useState<ScoreSegment>('live')
  const date = todayDateString()

  const liveQuery = useGetLiveFootballScoresQuery(undefined, {
    skip: segment !== 'live',
    pollingInterval: segment === 'live' ? 30_000 : 0,
  })
  const todayQuery = useGetTodayFootballScoresQuery(
    { date },
    { skip: segment === 'live' },
  )

  const isLoading = segment === 'live' ? liveQuery.isLoading : todayQuery.isLoading
  const isError = segment === 'live' ? liveQuery.isError : todayQuery.isError
  const refetch = segment === 'live' ? liveQuery.refetch : todayQuery.refetch

  const games = useMemo(() => {
    if (segment === 'live') {
      return liveQuery.data ?? []
    }
    const today = todayQuery.data ?? []
    return filterGamesBySegment(today, segment)
  }, [segment, liveQuery.data, todayQuery.data])

  return (
    <PageContainer title="Live Scores" description="Football fixtures grouped by league.">
      <div className="mb-4 flex flex-wrap gap-2">
        <SportCategoryChip label="Football" selected />
      </div>
      <ScoreFilterBar
        active={segment}
        onChange={setSegment}
        dateLabel={`Today · ${date}`}
      />
      <div className="mt-6">
        <ScoresDataStates
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && games.length === 0}
          onRetry={refetch}
          emptyTitle={
            segment === 'live' ? 'No live games' : `No ${segment} games today`
          }
        >
          <ScoresByLeague games={games} />
        </ScoresDataStates>
      </div>
    </PageContainer>
  )
}

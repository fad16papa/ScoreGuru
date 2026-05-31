import { useMemo } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { PageContainer } from '../components/layout/PageContainer'
import { PlayerHeader } from '../components/players/PlayerHeader'
import { PlayerRecentGames } from '../components/players/PlayerRecentGames'
import { PlayerStatCards } from '../components/players/PlayerStatCards'
import { Button } from '../components/shared/Button'
import { EmptyState } from '../components/shared/EmptyState'
import { RefreshControl } from '../components/shared/RefreshControl'
import { Skeleton } from '../components/shared/Skeleton'
import { getPremierLeaguePreset } from '../features/scores/leaguePresets'
import { getScoreQueryOptions } from '../features/scores/queryOptions'
import {
  formatFootballSeasonLabel,
  getPreviousFootballSeasonYear,
} from '../features/scores/seasonUtils'
import { useGetFootballPlayerByIdQuery } from '../services/scoreGuruApi'

export function PlayerDetailsPage() {
  const navigate = useNavigate()
  const { playerId = '' } = useParams<{ playerId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const playerNum = Number.parseInt(playerId, 10)
  const validPlayerId = Number.isFinite(playerNum)

  const preset = getPremierLeaguePreset()
  const seasonNum = useMemo(() => {
    const fromUrl = searchParams.get('season')
    const parsed = fromUrl ? Number.parseInt(fromUrl, 10) : Number.parseInt(preset.season, 10)
    return Number.isFinite(parsed) ? parsed : Number.parseInt(preset.season, 10)
  }, [searchParams, preset.season])

  const leagueNum = useMemo(() => {
    const fromUrl = searchParams.get('league')
    const parsed = fromUrl ? Number.parseInt(fromUrl, 10) : Number.parseInt(preset.league, 10)
    return Number.isFinite(parsed) ? parsed : Number.parseInt(preset.league, 10)
  }, [searchParams, preset.league])

  const teamNum = useMemo(() => {
    const fromUrl = searchParams.get('team')
    if (!fromUrl) return undefined
    const parsed = Number.parseInt(fromUrl, 10)
    return Number.isFinite(parsed) ? parsed : undefined
  }, [searchParams])

  const playerQuery = useGetFootballPlayerByIdQuery(
    {
      playerId: playerNum,
      season: seasonNum,
      team: teamNum,
      league: leagueNum,
    },
    getScoreQueryOptions(!validPlayerId),
  )

  const fetchError = playerQuery.error as FetchBaseQueryError | undefined
  const isNotFound = fetchError?.status === 404
  const isProviderError = playerQuery.isError && !isNotFound
  const isLoading = playerQuery.isLoading && !playerQuery.data && !isNotFound

  const player = playerQuery.data

  const pageTitle = useMemo(() => {
    if (isLoading) return 'Player details'
    if (player?.name) return player.name
    if (isNotFound) return 'Player not found'
    return 'Player details'
  }, [isLoading, player?.name, isNotFound])

  const tryPreviousSeason = () => {
    const previous = getPreviousFootballSeasonYear(seasonNum)
    const next = new URLSearchParams(searchParams)
    next.set('season', String(previous))
    setSearchParams(next)
  }

  const refresh = () => {
    void playerQuery.refetch()
  }

  if (!validPlayerId) {
    return (
      <PageContainer title="Player not found">
        <EmptyState title="Invalid player" description="The player id in the URL is not valid." />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={pageTitle}
      description="Basic player profile from ScoreGuru football data."
      actions={
        <RefreshControl
          onRefresh={refresh}
          isRefreshing={playerQuery.isFetching}
          lastUpdatedMs={playerQuery.fulfilledTimeStamp}
          helperText={`Season ${formatFootballSeasonLabel(seasonNum)}`}
        />
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : isProviderError ? (
        <EmptyState
          title="Could not load player"
          description="Check that the API is running and try again."
          actionLabel="Try again"
          onAction={refresh}
          secondaryActionLabel="Back to Players"
          onSecondaryAction={() => navigate('/players')}
        />
      ) : isNotFound || !player ? (
        <EmptyState
          title="Player not found"
          description="Player not found for the selected season. Try opening the player from the team roster or selecting another season."
          actionLabel="Try previous season"
          onAction={tryPreviousSeason}
          secondaryActionLabel="Back to Players"
          onSecondaryAction={() => navigate('/players')}
        />
      ) : (
        <div className="space-y-6">
          <PlayerHeader player={player} />
          <PlayerStatCards player={player} />
          <PlayerRecentGames playerName={player.name} />
          <div className="flex flex-wrap gap-3">
            <Link to="/players">
              <Button type="button" variant="secondary">
                Back to Players
              </Button>
            </Link>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

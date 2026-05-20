import type { ReactNode } from 'react'
import { Button } from '../../components/shared/Button'
import { EmptyState } from '../../components/shared/EmptyState'
import { GameScoreSkeleton } from '../../components/scores/GameScoreSkeleton'

type ScoresDataStatesProps = {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  onRetry?: () => void
  skeletonCount?: number
  emptyTitle?: string
  emptyDescription?: string
  children: ReactNode
}

export function ScoresDataStates({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  skeletonCount = 4,
  emptyTitle = 'No games found',
  emptyDescription = 'Try another filter or check back later.',
  children,
}: ScoresDataStatesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <GameScoreSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load scores"
        description="Make sure the ScoreGuru API is running and reachable."
        actionLabel="Try again"
        onAction={onRetry}
      />
    )
  }

  if (isEmpty) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return <>{children}</>
}

export function InlineRetry({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex justify-center py-4">
      <Button type="button" variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

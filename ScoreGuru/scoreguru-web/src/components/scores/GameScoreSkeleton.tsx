import { Card } from '../shared/Card'
import { Skeleton } from '../shared/Skeleton'

export function GameScoreSkeleton() {
  return (
    <Card padding="sm" className="space-y-3">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-14" />
        <Skeleton className="h-5 w-28" />
      </div>
    </Card>
  )
}

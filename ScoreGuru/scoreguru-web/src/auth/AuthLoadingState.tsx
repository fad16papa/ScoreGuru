import { Card } from '../components/shared/Card'
import { Skeleton } from '../components/shared/Skeleton'

type AuthLoadingStateProps = {
  message?: string
}

export function AuthLoadingState({ message = 'Loading session…' }: AuthLoadingStateProps) {
  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4"
      aria-busy
      aria-live="polite"
    >
      <p className="font-inter text-sm font-medium text-cr-muted dark:text-cr-muted-dark">
        {message}
      </p>
      <Card className="w-full max-w-md space-y-3" padding="md">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-11 w-full" rounded="md" />
      </Card>
    </div>
  )
}

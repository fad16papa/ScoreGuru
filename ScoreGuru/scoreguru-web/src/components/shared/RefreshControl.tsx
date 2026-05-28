import { Button } from './Button'
import { formatLastUpdated } from '../../features/scores/queryOptions'

type RefreshControlProps = {
  onRefresh: () => void
  isRefreshing?: boolean
  lastUpdatedMs?: number
  helperText?: string
  className?: string
}

export function RefreshControl({
  onRefresh,
  isRefreshing = false,
  lastUpdatedMs,
  helperText,
  className = '',
}: RefreshControlProps) {
  const lastUpdated = formatLastUpdated(lastUpdatedMs)

  return (
    <div
      className={[
        'flex flex-wrap items-center justify-between gap-2',
        className,
      ].join(' ')}
    >
      <div className="min-w-0">
        {lastUpdated ? (
          <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
            Last updated {lastUpdated}
          </p>
        ) : (
          <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
            Not loaded yet
          </p>
        )}
        {helperText ? (
          <p className="mt-0.5 font-inter text-[11px] text-cr-muted/80 dark:text-cr-muted-dark/80">
            {helperText}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="outline"
        className="min-h-9 px-3 text-xs"
        disabled={isRefreshing}
        onClick={onRefresh}
      >
        {isRefreshing ? 'Refreshing…' : 'Refresh'}
      </Button>
    </div>
  )
}

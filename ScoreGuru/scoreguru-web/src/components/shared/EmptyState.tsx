import type { ReactNode } from 'react'
import { Button } from './Button'

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-cr-border-light bg-cr-surface-light px-6 py-10 text-center dark:border-cr-border-dark dark:bg-cr-surface-dark">
      {icon ? (
        <div className="mb-4 text-cr-muted dark:text-cr-muted-dark">{icon}</div>
      ) : null}
      <h3 className="font-jakarta text-lg font-semibold text-cr-text-dark dark:text-cr-text-light">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 max-w-md font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

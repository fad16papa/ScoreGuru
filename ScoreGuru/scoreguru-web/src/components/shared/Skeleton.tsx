type SkeletonProps = {
  className?: string
  rounded?: 'md' | 'lg' | 'full'
}

const roundedMap = { md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }

export function Skeleton({
  className = '',
  rounded = 'lg',
}: SkeletonProps) {
  return (
    <div
      className={[
        'animate-pulse bg-cr-border-light/70 dark:bg-cr-surface-dark-2',
        roundedMap[rounded],
        className,
      ].join(' ')}
      aria-hidden
    />
  )
}

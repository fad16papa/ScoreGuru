import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'live' | 'highlight' | 'muted'

const variantClass: Record<BadgeVariant, string> = {
  default:
    'bg-cr-purple/15 text-cr-purple dark:bg-cr-purple/25 dark:text-cr-text-light',
  live: 'bg-cr-orange text-cr-primary-fg-on-primary',
  highlight: 'bg-cr-yellow/20 text-cr-text-dark dark:text-cr-text-light',
  muted:
    'bg-cr-border-light/80 text-cr-muted dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark',
}

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export function Badge({
  variant = 'default',
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-lg px-2 py-0.5 font-inter text-xs font-semibold uppercase tracking-wide',
        variantClass[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

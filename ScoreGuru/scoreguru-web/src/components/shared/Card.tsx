import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: 'sm' | 'md'
}

const paddingClass = { sm: 'p-3', md: 'p-4' }

export function Card({
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-xl border border-cr-border-light bg-cr-surface-light shadow-sm dark:border-cr-border-dark dark:bg-cr-surface-dark dark:shadow-none',
        paddingClass[padding],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

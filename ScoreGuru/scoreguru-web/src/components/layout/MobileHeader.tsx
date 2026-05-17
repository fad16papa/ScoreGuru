import type { ReactNode } from 'react'

type MobileHeaderProps = {
  title: string
  rightSlot?: ReactNode
}

export function MobileHeader({ title, rightSlot }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-cr-border-light bg-cr-surface-light px-3 dark:border-cr-border-dark dark:bg-cr-surface-dark md:hidden">
      <div className="min-w-0">
        <div className="truncate font-jakarta text-base font-bold text-cr-text-dark dark:text-cr-text-light">
          {title}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{rightSlot}</div>
    </header>
  )
}

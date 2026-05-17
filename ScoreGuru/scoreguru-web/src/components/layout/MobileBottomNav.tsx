import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

export type BottomNavItem = {
  to: string
  label: string
  icon: ReactNode
}

type MobileBottomNavProps = {
  items: BottomNavItem[]
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-cr-border-light bg-cr-surface-light pb-[env(safe-area-inset-bottom)] dark:border-cr-border-dark dark:bg-cr-surface-dark md:hidden"
      aria-label="Mobile primary"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex min-h-[56px] min-w-[56px] flex-1 flex-col items-center justify-center gap-1 py-1 font-inter text-[11px] font-semibold transition-colors',
                isActive
                  ? 'text-cr-purple'
                  : 'text-cr-muted dark:text-cr-muted-dark',
              ].join(' ')
            }
          >
            <span className="text-current" aria-hidden>
              {item.icon}
            </span>
            <span className="max-w-[72px] truncate">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

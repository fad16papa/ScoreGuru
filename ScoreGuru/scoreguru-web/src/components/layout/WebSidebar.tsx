import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

export type SidebarItem = {
  to: string
  label: string
  icon: ReactNode
}

type WebSidebarProps = {
  items: SidebarItem[]
}

export function WebSidebar({ items }: WebSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-cr-border-light bg-cr-surface-light dark:border-cr-border-dark dark:bg-cr-surface-dark md:flex">
      <div className="border-b border-cr-border-light px-4 py-5 dark:border-cr-border-dark">
        <div className="font-jakarta text-lg font-extrabold text-cr-purple">ScoreGuru</div>
        <p className="font-inter text-xs font-semibold uppercase tracking-widest text-cr-muted dark:text-cr-muted-dark">
          Live scores
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Primary">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex min-h-11 items-center gap-3 rounded-lg px-3 font-inter text-sm font-semibold transition-colors',
                isActive
                  ? 'border-l-2 border-cr-purple bg-cr-purple/10 text-cr-purple dark:bg-cr-purple/15 dark:text-cr-text-light'
                  : 'border-l-2 border-transparent text-cr-muted hover:bg-cr-bg-light hover:text-cr-text-dark dark:text-cr-muted-dark dark:hover:bg-cr-surface-dark-2 dark:hover:text-cr-text-light',
              ].join(' ')
            }
            end={item.to === '/'}
          >
            <span className="text-current" aria-hidden>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

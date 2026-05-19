import { SignedIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { DesktopSessionControls } from './SessionControls'
import { SearchInput } from '../shared/SearchInput'
import { ThemeToggleWithBackend } from '../shared/ThemeToggleWithBackend'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 hidden h-14 items-center gap-4 border-b border-cr-border-light bg-cr-surface-light px-4 dark:border-cr-border-dark dark:bg-cr-surface-dark md:flex md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Link to="/search" className="max-w-xl min-w-0 flex-1" tabIndex={-1}>
          <SearchInput
            placeholder="Search leagues, teams, players, games…"
            readOnly
            aria-readonly
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="min-h-11 rounded-lg border border-cr-border-light px-3 font-inter text-sm font-semibold text-cr-text-dark transition-colors hover:bg-cr-bg-light dark:border-cr-border-dark dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2"
          aria-label="Date selector (coming soon)"
        >
          Today
        </button>
        <ThemeToggleWithBackend />
        <button
          type="button"
          className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-cr-border-light text-cr-text-dark transition-colors hover:bg-cr-bg-light dark:border-cr-border-dark dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2"
          aria-label="Notifications (coming soon)"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0h6z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute right-2 top-2 size-2 rounded-full bg-cr-orange" />
        </button>
        <SignedIn>
          <Link
            to="/settings"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-cr-border-light bg-cr-bg-light px-3 font-inter text-xs font-semibold text-cr-muted transition-colors hover:border-cr-purple-dark hover:text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark dark:hover:text-cr-text-light"
          >
            Settings
          </Link>
        </SignedIn>
        <DesktopSessionControls />
      </div>
    </header>
  )
}

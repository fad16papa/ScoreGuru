import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../shared/ThemeToggle'

type AuthPageChromeProps = {
  children: ReactNode
  subTitle?: string
}

export function AuthPageChrome({ children, subTitle }: AuthPageChromeProps) {
  return (
    <div className="flex min-h-svh flex-col bg-cr-bg-light dark:bg-cr-bg-dark">
      <header className="flex h-14 items-center justify-between border-b border-cr-border-light px-4 dark:border-cr-border-dark dark:bg-cr-surface-dark">
        <Link
          to="/"
          className="font-jakarta text-lg font-extrabold text-cr-purple hover:text-cr-purple-dark"
        >
          ScoreGuru
        </Link>
        <div className="flex items-center gap-2">
          {subTitle ? (
            <span className="hidden font-inter text-xs font-medium text-cr-muted sm:inline dark:text-cr-muted-dark">
              {subTitle}
            </span>
          ) : null}
          <ThemeToggle className="!border-0 bg-transparent hover:bg-cr-border-light/30 dark:hover:bg-cr-surface-dark-2" />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:py-12">{children}</main>
    </div>
  )
}

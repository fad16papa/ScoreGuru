import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setThemePreference } from '../../features/theme/themeSlice'
import type { ThemePreference } from '../../features/theme/types'

const order: ThemePreference[] = ['light', 'dark', 'system']

function labelFor(p: ThemePreference): string {
  switch (p) {
    case 'light':
      return 'Light'
    case 'dark':
      return 'Dark'
    default:
      return 'System'
  }
}

function iconFor(p: ThemePreference) {
  switch (p) {
    case 'light':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          />
        </svg>
      )
    case 'dark':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 14.5A8.5 8.5 0 0112.5 5a8.46 8.46 0 00-1.08 5.05 4 4 0 104.23 4.23A8.5 8.5 0 0021 14.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M7 9h2M15 9h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
  }
}

type ThemeToggleProps = {
  mode?: 'cycle' | 'menu'
  className?: string
}

export function ThemeToggle({ mode = 'cycle', className = '' }: ThemeToggleProps) {
  const dispatch = useAppDispatch()
  const preference = useAppSelector((s) => s.theme.preference)

  if (mode === 'menu') {
    return (
      <div className={['flex items-center gap-1', className].join(' ')}>
        {order.map((p) => (
          <button
            key={p}
            type="button"
            className={[
              'min-h-10 rounded-lg px-3 font-inter text-xs font-semibold transition-colors',
              preference === p
                ? 'bg-cr-purple text-cr-primary-fg-on-primary'
                : 'text-cr-muted hover:bg-cr-border-light/50 dark:text-cr-muted-dark dark:hover:bg-cr-surface-dark-2',
            ].join(' ')}
            onClick={() => dispatch(setThemePreference(p))}
          >
            {labelFor(p)}
          </button>
        ))}
      </div>
    )
  }

  const next = (): void => {
    const i = order.indexOf(preference)
    const np = order[(i + 1) % order.length]
    dispatch(setThemePreference(np))
  }

  return (
    <button
      type="button"
      onClick={next}
      className={[
        'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-cr-border-light text-cr-text-dark transition-colors hover:bg-cr-bg-light dark:border-cr-border-dark dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2',
        className,
      ].join(' ')}
      aria-label={`Theme: ${labelFor(preference)}. Click to cycle.`}
      title={`Theme: ${labelFor(preference)}`}
    >
      {iconFor(preference)}
    </button>
  )
}

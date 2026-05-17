import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const primaryLink =
  'inline-flex min-h-11 items-center justify-center rounded-lg bg-cr-purple px-4 py-2 font-inter text-sm font-semibold text-cr-primary-fg-on-primary transition-colors hover:bg-cr-purple-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cr-purple/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cr-bg-light dark:focus-visible:ring-offset-cr-bg-dark'

const iconButton =
  'inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-cr-border-light text-cr-text-dark transition-colors hover:bg-cr-bg-light dark:border-cr-border-dark dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cr-purple/40'

export function DesktopSessionControls() {
  return (
    <>
      <SignedOut>
        <Link className={primaryLink} to="/sign-in">
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: 'size-9',
              userButtonTrigger: 'min-h-11 rounded-lg focus:shadow-none',
            },
          }}
        />
      </SignedIn>
    </>
  )
}

export function MobileSessionControls() {
  return (
    <>
      <SignedOut>
        <Link
          to="/sign-in"
          className={iconButton}
          aria-label="Sign in"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
            <path
              d="M6 20a6 6 0 0112 0"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: 'size-8',
              userButtonTrigger: iconButton,
            },
          }}
        />
      </SignedIn>
    </>
  )
}

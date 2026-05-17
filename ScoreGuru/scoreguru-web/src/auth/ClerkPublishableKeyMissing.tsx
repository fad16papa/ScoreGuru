const linkBase =
  'inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 font-inter text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cr-purple/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cr-bg-light dark:focus-visible:ring-offset-cr-bg-dark'

const ghostClasses = `${linkBase} bg-transparent text-cr-text-dark hover:bg-cr-border-light/40 dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2`

const outlineClasses = `${linkBase} border border-cr-border-light bg-transparent text-cr-text-dark hover:bg-cr-bg-light dark:border-cr-border-dark dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2`

export function ClerkPublishableKeyMissing() {
  const isDev = import.meta.env.DEV

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-cr-bg-light px-4 py-10 dark:bg-cr-bg-dark">
      <div className="w-full max-w-lg space-y-4 rounded-xl border border-cr-border-light bg-cr-surface-light p-6 text-center shadow-sm dark:border-cr-border-dark dark:bg-cr-surface-dark dark:shadow-none">
        <h1 className="font-jakarta text-xl font-bold text-cr-text-dark dark:text-cr-text-light">
          Clerk is not configured
        </h1>
        <p className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
          ScoreGuru needs a Clerk publishable key to load authentication. Add{' '}
          <code className="rounded-md bg-cr-border-light/50 px-1 py-0.5 font-mono text-xs text-cr-text-dark dark:bg-cr-surface-dark-2 dark:text-cr-text-light">
            VITE_CLERK_PUBLISHABLE_KEY
          </code>{' '}
          to your environment and restart Vite.
        </p>
        {isDev ? (
          <ol className="list-decimal space-y-2 pl-5 text-left font-inter text-sm text-cr-text-dark dark:text-cr-text-light">
            <li>
              Copy{' '}
              <code className="font-mono text-xs">.env.example</code> to{' '}
              <code className="font-mono text-xs">.env</code> in{' '}
              <code className="font-mono text-xs">scoreguru-web</code>.
            </li>
            <li>
              Paste your key from the Clerk dashboard (API keys → Publishable key).
            </li>
            <li>
              Run <code className="font-mono text-xs">npm run dev</code> again.
            </li>
          </ol>
        ) : (
          <p className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
            Set <span className="font-mono text-xs">VITE_CLERK_PUBLISHABLE_KEY</span> in
            your deployment environment, then redeploy.
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            className={ghostClasses}
            href="https://dashboard.clerk.com/"
            rel="noreferrer"
            target="_blank"
          >
            Clerk dashboard
          </a>
          <a className={outlineClasses} href="/">
            Reload home
          </a>
        </div>
      </div>
    </div>
  )
}

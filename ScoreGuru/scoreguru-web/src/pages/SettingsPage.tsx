import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/shared/Card'
import { Skeleton } from '../components/shared/Skeleton'
import { ThemeToggle } from '../components/shared/ThemeToggle'
import { UserProfileCard } from '../features/user/UserProfileCard'
import { useSaveThemeToBackend } from '../features/user/useSaveThemeToBackend'
import { useGetAuthMeQuery } from '../services/scoreGuruApi'

export function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Manage appearance and your ScoreGuru profile."
    >
      <div className="space-y-6">
        <AppearanceSection />
        <SignedIn>
          <SignedInAccountSection />
        </SignedIn>
        <SignedOut>
          <Card className="space-y-2">
            <h2 className="font-jakarta text-base font-semibold text-cr-text-dark dark:text-cr-text-light">
              ScoreGuru account
            </h2>
            <p className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
              Sign in to sync your profile with the ScoreGuru backend.
            </p>
            <SignInButton mode="modal">
              <button
                type="button"
                className="mt-2 inline-flex min-h-10 items-center justify-center rounded-lg bg-cr-purple px-4 font-inter text-sm font-semibold text-cr-primary-fg-on-primary transition-colors hover:bg-cr-purple-dark"
              >
                Sign in
              </button>
            </SignInButton>
          </Card>
        </SignedOut>
      </div>
    </PageContainer>
  )
}

function AppearanceSection() {
  const saveThemeToBackend = useSaveThemeToBackend()

  return (
    <Card>
      <h2 className="font-jakarta text-base font-semibold text-cr-text-dark dark:text-cr-text-light">
        Appearance
      </h2>
      <p className="mt-1 font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
        Theme is saved on this device. When signed in, your choice is also sent to ScoreGuru.
      </p>
      <div className="mt-4">
        <ThemeToggle mode="menu" onPreferenceChange={saveThemeToBackend} />
      </div>
    </Card>
  )
}

function SignedInAccountSection() {
  const { data, isLoading, isError, refetch } = useGetAuthMeQuery()

  if (isLoading) {
    return (
      <Card className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="space-y-3">
        <h2 className="font-jakarta text-base font-semibold text-cr-text-dark dark:text-cr-text-light">
          ScoreGuru account
        </h2>
        <p className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
          Could not load your synced profile.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-cr-border-light px-4 font-inter text-sm font-semibold text-cr-text-dark transition-colors hover:bg-cr-bg-light dark:border-cr-border-dark dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2"
        >
          Retry
        </button>
      </Card>
    )
  }

  return <UserProfileCard user={data} />
}

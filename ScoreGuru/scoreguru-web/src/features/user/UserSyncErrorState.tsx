import { PageContainer } from '../../components/layout/PageContainer'
import { EmptyState } from '../../components/shared/EmptyState'

type UserSyncErrorStateProps = {
  onRetry: () => void
}

export function UserSyncErrorState({ onRetry }: UserSyncErrorStateProps) {
  return (
    <PageContainer
      title="Account sync"
      description="We could not reach the ScoreGuru API to load your profile."
    >
      <EmptyState
        title="Could not sync your account"
        description="Make sure the backend is running at the configured API URL and that you are signed in with Clerk."
        actionLabel="Try again"
        onAction={onRetry}
      />
    </PageContainer>
  )
}

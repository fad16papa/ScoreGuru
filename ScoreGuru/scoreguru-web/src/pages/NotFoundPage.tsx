import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/shared/Button'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <PageContainer
      title="Page not found"
      description="This URL is not part of the ScoreGuru MVP shell yet."
    >
      <Card>
        <EmptyState
          title="We could not find that page"
          description="Check the address for typos, or return to the dashboard to keep browsing scores and leagues."
        />
        <div className="mt-4 flex flex-wrap justify-center gap-3 border-t border-cr-border-light pt-4 dark:border-cr-border-dark">
          <Button type="button" onClick={() => navigate(-1)} variant="outline">
            Go back
          </Button>
          <Button type="button" onClick={() => navigate('/')}>
            Go home
          </Button>
        </div>
      </Card>
    </PageContainer>
  )
}

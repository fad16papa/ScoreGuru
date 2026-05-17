import { PageContainer } from '../components/layout/PageContainer'
import { Badge } from '../components/shared/Badge'
import { Card } from '../components/shared/Card'
import { EmptyState } from '../components/shared/EmptyState'

export function HomePage() {
  return (
    <PageContainer
      title="Home"
      description="Dashboard placeholder — live counts, league groups, and trending will connect to the API next."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="live">12 live</Badge>
            <span className="font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
              Today&apos;s games (sample)
            </span>
          </div>
          <p className="mt-4 font-inter text-sm text-cr-text-dark dark:text-cr-text-light">
            League-grouped score feed and trending row will render here.
          </p>
        </Card>
        <Card>
          <h2 className="font-jakarta text-base font-semibold text-cr-text-dark dark:text-cr-text-light">
            Standings preview
          </h2>
          <p className="mt-2 font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
            Compact top-5 table placeholder.
          </p>
        </Card>
      </div>
      <div className="mt-6">
        <EmptyState
          title="MVP shell ready"
          description="Connect RTK Query and score endpoints when the backend is available."
        />
      </div>
    </PageContainer>
  )
}

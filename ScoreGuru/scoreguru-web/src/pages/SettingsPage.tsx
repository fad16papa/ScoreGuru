import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/shared/Card'
import { ThemeToggle } from '../components/shared/ThemeToggle'

export function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      description="Theme preference persists locally. Clerk profile will arrive later."
    >
      <Card>
        <h2 className="font-jakarta text-base font-semibold text-cr-text-dark dark:text-cr-text-light">
          Appearance
        </h2>
        <p className="mt-1 font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
          Choose light, dark, or follow system.
        </p>
        <div className="mt-4">
          <ThemeToggle mode="menu" />
        </div>
      </Card>
    </PageContainer>
  )
}

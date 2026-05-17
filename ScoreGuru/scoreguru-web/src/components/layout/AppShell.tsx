import { Outlet, useLocation } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { MobileBottomNav } from './MobileBottomNav'
import { MobileHeader } from './MobileHeader'
import { WebSidebar } from './WebSidebar'
import { getMobileHeaderTitle, mobileBottomNav, sidebarNav } from './navigationConfig'
import { ThemeToggle } from '../shared/ThemeToggle'
import { MobileSessionControls } from './SessionControls'

export function AppShell() {
  const { pathname } = useLocation()
  const title = getMobileHeaderTitle(pathname)

  return (
    <div className="min-h-svh bg-cr-bg-light dark:bg-cr-bg-dark">
      <WebSidebar items={sidebarNav} />
      <div className="flex min-h-svh flex-col md:pl-64">
        <MobileHeader
          title={title}
          rightSlot={
            <>
              <MobileSessionControls />
              <ThemeToggle className="!border-0 bg-transparent hover:bg-cr-border-light/30 dark:hover:bg-cr-surface-dark-2" />
            </>
          }
        />
        <AppHeader />
        <main className="flex-1 pb-[calc(56px+env(safe-area-inset-bottom))] pt-0 md:pb-0">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav items={mobileBottomNav} />
    </div>
  )
}

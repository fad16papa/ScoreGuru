import type { ReactNode } from 'react'
import { Tabs, type TabItem } from '../shared/Tabs'

export type GameTabId = 'summary' | 'live' | 'stats' | 'details'

type GameTabsProps = {
  activeId: GameTabId
  onChange: (id: GameTabId) => void
  summary: ReactNode
  live: ReactNode
  stats: ReactNode
  details: ReactNode
}

export function GameTabs({ activeId, onChange, summary, live, stats, details }: GameTabsProps) {
  const items: TabItem[] = [
    { id: 'summary', label: 'Summary', content: summary },
    { id: 'live', label: 'Live', content: live },
    { id: 'stats', label: 'Stats', content: stats },
    { id: 'details', label: 'Details', content: details },
  ]

  return <Tabs items={items} activeId={activeId} onChange={(id) => onChange(id as GameTabId)} />
}

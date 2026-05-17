import type { ReactNode } from 'react'

export type TabItem = {
  id: string
  label: string
  content: ReactNode
}

type TabsProps = {
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ items, activeId, onChange, className = '' }: TabsProps) {
  return (
    <div className={className}>
      <div
        className="flex gap-1 overflow-x-auto border-b border-cr-border-light dark:border-cr-border-dark"
        role="tablist"
        aria-label="Section tabs"
      >
        {items.map((item) => {
          const selected = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={[
                'min-h-11 shrink-0 px-3 font-inter text-sm font-semibold transition-colors',
                selected
                  ? 'border-b-2 border-cr-purple text-cr-purple dark:text-cr-text-light'
                  : 'border-b-2 border-transparent text-cr-muted hover:text-cr-text-dark dark:text-cr-muted-dark dark:hover:text-cr-text-light',
              ].join(' ')}
              onClick={() => onChange(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="mt-4" role="tabpanel">
        {items.find((i) => i.id === activeId)?.content}
      </div>
    </div>
  )
}

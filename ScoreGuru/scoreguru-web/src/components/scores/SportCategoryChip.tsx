type SportCategoryChipProps = {
  label: string
  selected?: boolean
  onClick?: () => void
}

export function SportCategoryChip({ label, selected = false, onClick }: SportCategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex min-h-9 shrink-0 items-center rounded-full px-4 font-inter text-xs font-semibold transition-colors',
        selected
          ? 'bg-cr-purple text-cr-primary-fg-on-primary'
          : 'border border-cr-border-light bg-cr-surface-light text-cr-muted hover:border-cr-purple/40 hover:text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-muted-dark dark:hover:text-cr-text-light',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

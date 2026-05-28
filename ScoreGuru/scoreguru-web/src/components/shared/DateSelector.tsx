type DateSelectorProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
}

export function DateSelector({
  value,
  onChange,
  label = 'Date',
  className = '',
}: DateSelectorProps) {
  return (
    <label
      className={[
        'flex flex-col gap-1 font-inter text-xs font-medium text-cr-muted dark:text-cr-muted-dark',
        className,
      ].join(' ')}
    >
      {label}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-10 rounded-lg border border-cr-border-light bg-cr-surface-light px-3 font-inter text-sm text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light"
      />
    </label>
  )
}

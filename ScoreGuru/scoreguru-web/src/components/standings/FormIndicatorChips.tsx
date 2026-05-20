type FormIndicatorChipsProps = {
  form: string | null | undefined
}

const resultClass: Record<string, string> = {
  W: 'bg-cr-purple text-cr-primary-fg-on-primary',
  D: 'bg-cr-border-light text-cr-muted dark:bg-cr-surface-dark-2 dark:text-cr-muted-dark',
  L: 'bg-cr-orange/20 text-cr-orange dark:bg-cr-orange/30',
}

export function FormIndicatorChips({ form }: FormIndicatorChipsProps) {
  if (!form) {
    return <span className="text-cr-muted dark:text-cr-muted-dark">—</span>
  }

  const chars = form.toUpperCase().split('').filter((c) => 'WDL'.includes(c)).slice(-5)

  return (
    <div className="flex gap-0.5">
      {chars.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className={[
            'inline-flex h-5 w-5 items-center justify-center rounded font-inter text-[10px] font-bold',
            resultClass[c] ?? resultClass.D,
          ].join(' ')}
          title={c === 'W' ? 'Win' : c === 'L' ? 'Loss' : 'Draw'}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

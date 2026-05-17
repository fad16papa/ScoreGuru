import type { InputHTMLAttributes } from 'react'

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> & {
  className?: string
}

export function SearchInput({ className = '', ...props }: SearchInputProps) {
  return (
    <div
      className={[
        'flex min-h-11 w-full items-center gap-2 rounded-lg border border-cr-border-light bg-cr-surface-light px-3 dark:border-cr-border-dark dark:bg-cr-surface-dark',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="shrink-0 text-cr-muted dark:text-cr-muted-dark"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="min-w-0 flex-1 bg-transparent py-2 font-inter text-sm text-cr-text-dark placeholder:text-cr-muted outline-none dark:text-cr-text-light dark:placeholder:text-cr-muted-dark"
        {...props}
      />
    </div>
  )
}

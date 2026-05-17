import type { HTMLAttributes, ReactNode } from 'react'

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
  actions?: ReactNode
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  className = '',
  ...props
}: PageContainerProps) {
  return (
    <div
      className={['mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8', className].join(
        ' ',
      )}
      {...props}
    >
      {title || description || actions ? (
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title ? (
              <h1 className="font-jakarta text-2xl font-bold tracking-tight text-cr-text-dark dark:text-cr-text-light md:text-3xl">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-1 max-w-2xl font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </div>
  )
}

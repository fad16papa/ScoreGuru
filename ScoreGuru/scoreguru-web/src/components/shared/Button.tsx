import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-cr-purple text-cr-primary-fg-on-primary hover:bg-cr-purple-dark active:bg-cr-purple-dark',
  secondary:
    'bg-cr-border-light text-cr-text-dark hover:opacity-90 dark:bg-cr-surface-dark-2 dark:text-cr-text-light',
  outline:
    'border border-cr-border-light bg-transparent text-cr-text-dark hover:bg-cr-bg-light dark:border-cr-border-dark dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2',
  ghost:
    'bg-transparent text-cr-text-dark hover:bg-cr-border-light/40 dark:text-cr-text-light dark:hover:bg-cr-surface-dark-2',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 font-inter text-sm font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cr-purple/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cr-bg-light dark:focus-visible:ring-offset-cr-bg-dark',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

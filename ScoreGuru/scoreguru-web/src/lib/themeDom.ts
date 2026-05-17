import type { ThemePreference } from '../features/theme/types'

function shouldUseDark(preference: ThemePreference): boolean {
  if (preference === 'dark') return true
  if (preference === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyThemeToDocument(preference: ThemePreference): void {
  const root = document.documentElement
  if (shouldUseDark(preference)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function watchSystemTheme(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

import { THEME_STORAGE_KEY, type ThemePreference } from './types'

export function readStoredThemePreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') {
      return raw
    }
  } catch {
    /* storage unavailable */
  }
  return 'system'
}

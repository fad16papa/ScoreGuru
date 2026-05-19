import { useSaveThemeToBackend } from '../../features/user/useSaveThemeToBackend'
import { ThemeToggle } from './ThemeToggle'

type ThemeToggleWithBackendProps = {
  mode?: 'cycle' | 'menu'
  className?: string
}

export function ThemeToggleWithBackend({ mode = 'cycle', className }: ThemeToggleWithBackendProps) {
  const saveThemeToBackend = useSaveThemeToBackend()
  return <ThemeToggle mode={mode} className={className} onPreferenceChange={saveThemeToBackend} />
}

import { useEffect } from 'react'
import { useAppSelector } from './hooks'
import { applyThemeToDocument, watchSystemTheme } from '../lib/themeDom'

export function ThemeRootSync() {
  const preference = useAppSelector((s) => s.theme.preference)

  useEffect(() => {
    applyThemeToDocument(preference)
    if (preference !== 'system') return
    return watchSystemTheme(() => applyThemeToDocument('system'))
  }, [preference])

  return null
}

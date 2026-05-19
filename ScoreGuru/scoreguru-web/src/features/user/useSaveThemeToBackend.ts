import { useAuth } from '@clerk/clerk-react'
import { useCallback } from 'react'
import type { ThemePreference } from '../theme/types'
import { useUpdateMyThemeMutation } from '../../services/scoreGuruApi'

/**
 * Persists theme to ScoreGuru when signed in. Failures are ignored — local theme still applies.
 */
export function useSaveThemeToBackend() {
  const { isSignedIn } = useAuth()
  const [updateTheme] = useUpdateMyThemeMutation()

  return useCallback(
    (preference: ThemePreference) => {
      if (!isSignedIn) {
        return
      }

      void updateTheme({ themePreference: preference }).unwrap().catch(() => {
        // Local theme remains the source of truth for the UI.
      })
    },
    [isSignedIn, updateTheme],
  )
}

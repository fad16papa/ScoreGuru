import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { THEME_STORAGE_KEY } from '../features/theme/types'
import { setThemePreference } from '../features/theme/themeSlice'

export const themePersistListener = createListenerMiddleware()

themePersistListener.startListening({
  matcher: isAnyOf(setThemePreference),
  effect: (action) => {
    if (!setThemePreference.match(action)) return
    try {
      localStorage.setItem(THEME_STORAGE_KEY, action.payload)
    } catch {
      /* ignore */
    }
  },
})

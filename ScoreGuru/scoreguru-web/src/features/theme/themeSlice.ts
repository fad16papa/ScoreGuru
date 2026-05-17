import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { readStoredThemePreference } from './themeStorage'
import type { ThemePreference } from './types'

const initialPreference: ThemePreference =
  typeof window !== 'undefined' ? readStoredThemePreference() : 'system'

const initialState: { preference: ThemePreference } = {
  preference: initialPreference,
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemePreference(state, action: PayloadAction<ThemePreference>) {
      state.preference = action.payload
    },
  },
})

export const { setThemePreference } = themeSlice.actions

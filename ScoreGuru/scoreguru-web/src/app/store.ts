import { configureStore } from '@reduxjs/toolkit'
import { themeSlice } from '../features/theme/themeSlice'
import { themePersistListener } from './themePersistListener'

export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(themePersistListener.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

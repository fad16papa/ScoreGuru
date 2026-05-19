import { configureStore } from '@reduxjs/toolkit'
import { themeSlice } from '../features/theme/themeSlice'
import { scoreGuruApi } from '../services/scoreGuruApi'
import { themePersistListener } from './themePersistListener'

export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    [scoreGuruApi.reducerPath]: scoreGuruApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(themePersistListener.middleware)
      .concat(scoreGuruApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

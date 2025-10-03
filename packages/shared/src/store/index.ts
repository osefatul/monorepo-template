import { configureStore } from '@reduxjs/toolkit'

import { api } from '../api'

// Create the stores
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [api.util.resetApiState.type],
      },
    }).concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const createAppStore = () => store
export * from '../api'

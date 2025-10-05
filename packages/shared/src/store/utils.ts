import { configureStore } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'

import { baseApi } from '../services/api/baseApi'
import { uiSlice } from './slices'

// Base store configuration that can be extended by apps
export const createBaseStore = (
  additionalReducers = {},
  additionalMiddleware: Middleware[] = []
) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
      [baseApi.reducerPath]: baseApi.reducer,
      ...additionalReducers,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        },
      })
        .concat(baseApi.middleware)
        .concat(...additionalMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  })
}

// Type for the store
export type AppStore = ReturnType<typeof createBaseStore>
export type AppDispatch = AppStore['dispatch']

// Persistence utilities
export const persistConfig = {
  key: 'root',
  storage: typeof window !== 'undefined' ? localStorage : undefined,
  whitelist: ['auth', 'ui'], // Only persist these reducers
  blacklist: [], // Don't persist these reducers
}

// Local storage utilities for manual persistence
export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }
}

export const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return defaultValue
    }
  }
  return defaultValue
}

export const removeFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }
}

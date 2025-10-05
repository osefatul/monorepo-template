import { configureStore } from '@reduxjs/toolkit'

import { baseApi } from '../services/api/baseApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const createAppStore = () => store
export * from '../services/api/api'
export * from './utils'

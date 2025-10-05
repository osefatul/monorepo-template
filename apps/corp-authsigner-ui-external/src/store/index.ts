// index.ts
import { configureStore } from '@reduxjs/toolkit'

import { baseApi } from '@shared/services/api/baseApi'

import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [baseApi.util.resetApiState.type],
      },
    }).concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

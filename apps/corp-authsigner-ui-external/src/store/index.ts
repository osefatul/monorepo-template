import { createBaseStore } from '@shared/store'
import type { BaseRootState } from '@shared/store'

// External app specific reducers (can be added later)
const externalReducers = {
  // Add external-specific reducers here
  // publicApi: publicApiSlice.reducer,
  // forms: formsSlice.reducer,
}

// Create the store for the external app
export const store = createBaseStore(externalReducers)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = BaseRootState & {
  // Add external-specific state types here
}
export type AppDispatch = typeof store.dispatch

// Export API hooks for easy access
export * from './api'

export default store
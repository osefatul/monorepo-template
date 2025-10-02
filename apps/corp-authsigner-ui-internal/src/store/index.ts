import { createBaseStore } from '@shared/store'
import type { BaseRootState } from '@shared/store'

// Internal app specific reducers (can be added later)
const internalReducers = {
  // Add internal-specific reducers here
  // dashboard: dashboardSlice.reducer,
  // reports: reportsSlice.reducer,
}

// Create the store for the internal app
export const store = createBaseStore(internalReducers)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = BaseRootState & {
  // Add internal-specific state types here
}
export type AppDispatch = typeof store.dispatch

// Export API hooks for easy access
export * from './api'

export default store
import { store as sharedStore } from '@shared/store'
import type { AppDispatch, RootState } from '@shared/store'

// Use the shared store for the external app
export const store = sharedStore

// Re-export types
export type { RootState, AppDispatch }

// Export shared API hooks and selectors for easy access
export * from '@shared/store'

export default store

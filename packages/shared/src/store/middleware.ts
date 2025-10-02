import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { BaseRootState } from './types'
import { authActions } from './slices'
import { authApi } from './api'

// Create the middleware instance
export const listenerMiddleware = createListenerMiddleware()

// Add listeners for automatic token refresh, etc.
listenerMiddleware.startListening({
  matcher: authApi.endpoints.login.matchFulfilled,
  effect: async (action, listenerApi) => {
    // Auto-refresh token before it expires (simplified example)
    const { token } = action.payload
    if (token) {
      // Store token in localStorage for persistence
      localStorage.setItem('auth-token', token)
      // Set up token refresh timer (in a real app, you'd decode the JWT to get expiry)
      setTimeout(() => {
        listenerApi.dispatch(authApi.endpoints.refreshToken.initiate())
      }, 30 * 60 * 1000) // Refresh after 30 minutes
    }
  },
})

// Listen for logout and clear any timers/cleanup
listenerMiddleware.startListening({
  matcher: authApi.endpoints.logout.matchFulfilled,
  effect: async () => {
    // Clear any timers, localStorage, etc.
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-preferences')
  },
})

// Listen for auth errors and show notifications
listenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    const state = currentState as BaseRootState
    const prevState = previousState as BaseRootState
    return state.auth.error !== null && state.auth.error !== prevState.auth.error
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as BaseRootState
    if (state.auth.error) {
      // You could dispatch a notification action here if needed
      console.error('Auth Error:', state.auth.error)
    }
  },
})

export { listenerMiddleware as authMiddleware }
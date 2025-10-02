import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  BaseAuthState,
  BaseUser,
  SetUserPayload,
} from '../types'
import { authApi } from '../api'

// Initial state
const initialState: BaseAuthState = {
  user: null,
  loading: false,
  error: null,
  token: null,
}

// Helper function to extract user from auth response
const extractUserFromResponse = (response: any): BaseUser => {
  return {
    id: response.user?.id || `user-${Date.now()}`,
    email: response.user?.email || '',
    name: response.user?.name || '',
    role: response.user?.role || 'external',
    isAuthenticated: true,
  }
}

// Auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload.user }
      }
    },
    clearAuth: state => {
      state.user = null
      state.token = null
      state.error = null
      state.loading = false
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    clearAuthError: state => {
      state.error = null
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: builder => {
    builder
      // Handle login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false
        state.user = extractUserFromResponse(action.payload)
        state.token = action.payload.token
        state.error = null
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })

      // Handle logout
      .addMatcher(authApi.endpoints.logout.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.error = null
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Logout failed'
      })

      // Handle refresh token
      .addMatcher(authApi.endpoints.refreshToken.matchPending, (state) => {
        state.loading = true
      })
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.error = null
      })
      .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Token refresh failed'
      })

      // Handle get current user
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.user = action.payload
      })
  },
})

// Export actions
export const authActions = authSlice.actions

export default authSlice.reducer
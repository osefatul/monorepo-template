import type { BaseUser, LoginPayload, LoginSuccessPayload } from '../types'
import { baseApi } from './baseApi'

// Authentication API endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Login endpoint
    login: builder.mutation<LoginSuccessPayload, LoginPayload>({
      query: credentials => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Logout endpoint
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User', 'Profile'],
    }),

    // Refresh token endpoint
    refreshToken: builder.mutation<{ token: string; refreshToken: string }, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    // Get current user profile
    getCurrentUser: builder.query<BaseUser, void>({
      query: () => 'auth/me',
      providesTags: ['User'],
    }),

    // Update user profile
    updateProfile: builder.mutation<BaseUser, Partial<BaseUser>>({
      query: updates => ({
        url: 'auth/profile',
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['User', 'Profile'],
    }),

    // Change password
    changePassword: builder.mutation<
      { success: boolean },
      { currentPassword: string; newPassword: string }
    >({
      query: passwords => ({
        url: 'auth/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),

    // Request password reset
    requestPasswordReset: builder.mutation<{ success: boolean }, { email: string }>({
      query: data => ({
        url: 'auth/reset-password-request',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password with token
    resetPassword: builder.mutation<{ success: boolean }, { token: string; newPassword: string }>({
      query: data => ({
        url: 'auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

// Export hooks for usage in components
export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { BaseRootState } from '../types'

// Base query with authentication and error handling
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers, { getState }) => {
    // Get token from auth state
    const token = (getState() as BaseRootState).auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    headers.set('content-type', 'application/json')
    return headers
  },
})

// Enhanced base query with token refresh logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions)
    } else {
      // Refresh failed, logout user
      // This will be handled by the auth slice
    }
  }

  return result
}

// Base API slice that other API slices will extend
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Auth',
    'Profile',
    'Settings',
    'Documents',
    'Reports',
    'Dashboard',
    'Notifications',
  ],
  endpoints: () => ({}),
})

export default baseApi
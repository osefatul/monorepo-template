import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { BaseRootState } from '../types'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers, { getState }) => {
    const { token } = (getState() as BaseRootState).auth

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    headers.set('content-type', 'application/json')
    return headers
  },
})

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
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

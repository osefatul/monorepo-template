//baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://jsonplaceholder.typicode.com/',
  // prepareHeaders: (headers, { getState }) => {
  // const { token } = (getState() as BaseRootState).auth
  // if (token) {
  //   headers.set('authorization', `Bearer ${token}`)
  // }
  // headers.set('content-type', 'application/json')
  // return headers
  // },
})

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Post', 'Todo', 'Document'],
  endpoints: () => ({}),
})

export default baseApi

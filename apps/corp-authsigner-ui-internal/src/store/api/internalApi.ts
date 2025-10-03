// This file demonstrates how to create app-specific API endpoints
// For now, we'll use only the shared authentication APIs
//
// To add endpoints, follow this pattern:
//
// import { baseApi } from '@shared/store'
//
// export const internalApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getInternalData: builder.query<DataType, ParamsType>({
//       query: (params) => 'internal/data',
//       providesTags: ['InternalData'],
//     }),
//   }),
// })
//
// Then use hooks like: useGetInternalDataQuery()

export const internalApi = {}

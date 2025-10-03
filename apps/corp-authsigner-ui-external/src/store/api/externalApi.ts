// This file demonstrates how to create app-specific API endpoints
// For now, we'll use only the shared authentication APIs
//
// To add endpoints, follow this pattern:
//
// import { baseApi } from '@shared/store'
//
// export const externalApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getExternalData: builder.query<DataType, ParamsType>({
//       query: (params) => 'external/data',
//       providesTags: ['ExternalData'],
//     }),
//   }),
// })
//
// Then use hooks like: useGetExternalDataQuery()

export const externalApi = {}

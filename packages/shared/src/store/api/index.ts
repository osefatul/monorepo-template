// Export base API and all API slices
export { baseApi } from './baseApi'
export * from './authApi'

// Common API types and utilities
export type RTKApiResponse<T> = {
  data: T
  message?: string
  status: 'success' | 'error'
}

export type PaginatedResponse<T> = RTKApiResponse<{
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}>

export type ApiError = {
  status: number
  data: {
    message: string
    errors?: Record<string, string[]>
  }
}
export * from './authApi'
export { baseApi } from './baseApi'

export interface RTKApiResponse<T> {
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

export interface ApiError {
  status: number
  data: {
    message: string
    errors?: Record<string, string[]>
  }
}

export interface User {
  id: string
  email: string
  name: string
  role: 'internal' | 'external'
}

export interface AuthSignature {
  id: string
  userId: string
  signature: string
  timestamp: Date
  isValid: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

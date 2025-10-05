export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'signer'
  department?: string
  lastLogin?: string
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: number
}

export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

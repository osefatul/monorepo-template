import type { Action, ThunkAction } from '@reduxjs/toolkit'

// Base state interfaces that can be extended by apps
export interface BaseUser {
  id: string
  email: string
  name: string
  role: 'internal' | 'external' | 'admin'
  isAuthenticated: boolean
}

export interface BaseAuthState {
  user: BaseUser | null
  loading: boolean
  error: string | null
  token: string | null
}

export interface BaseUIState {
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  notifications: Notification[]
  loading: {
    global: boolean
    [key: string]: boolean
  }
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  dismissible: boolean
}

// Generic types for store creation
export interface BaseRootState {
  auth: BaseAuthState
  ui: BaseUIState
}

// Utility types for thunks
export type AppThunk<ReturnType = void, ExtraArgument = unknown> = ThunkAction<
  ReturnType,
  BaseRootState,
  ExtraArgument,
  Action<string>
>

// Action payload types
export interface LoginPayload {
  email: string
  password: string
}

export interface LoginSuccessPayload {
  user: BaseUser
  token: string
}

export interface SetUserPayload {
  user: Partial<BaseUser>
}

export interface SetLoadingPayload {
  key?: string
  loading: boolean
}

export interface AddNotificationPayload {
  notification: Omit<Notification, 'id' | 'timestamp'>
}

export interface RemoveNotificationPayload {
  id: string
}

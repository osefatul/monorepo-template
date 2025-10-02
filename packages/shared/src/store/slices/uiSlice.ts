import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  BaseUIState,
  Notification,
  SetLoadingPayload,
  AddNotificationPayload,
  RemoveNotificationPayload,
} from '../types'

// Initial state
const initialState: BaseUIState = {
  theme: 'light',
  sidebarCollapsed: false,
  notifications: [],
  loading: {
    global: false,
  },
}

// UI slice
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    toggleSidebar: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setLoading: (state, action: PayloadAction<SetLoadingPayload>) => {
      const { key = 'global', loading } = action.payload
      state.loading[key] = loading
    },
    addNotification: (state, action: PayloadAction<AddNotificationPayload>) => {
      const notification: Notification = {
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        ...action.payload.notification,
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<RemoveNotificationPayload>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload.id
      )
    },
    clearNotifications: state => {
      state.notifications = []
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        // Add read property if needed in the future
      }
    },
  },
})

// Export actions
export const uiActions = uiSlice.actions

export default uiSlice.reducer
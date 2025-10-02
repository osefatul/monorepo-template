import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { BaseRootState } from './types'
import type { AppStore } from './utils'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppStore['dispatch']>()
export const useAppSelector: TypedUseSelectorHook<BaseRootState> = useSelector

// Convenience hooks for common state selections
export const useAuth = () => {
  return useAppSelector(state => state.auth)
}

export const useUser = () => {
  return useAppSelector(state => state.auth.user)
}

export const useAuthLoading = () => {
  return useAppSelector(state => state.auth.loading)
}

export const useUI = () => {
  return useAppSelector(state => state.ui)
}

export const useTheme = () => {
  return useAppSelector(state => state.ui.theme)
}

export const useNotifications = () => {
  return useAppSelector(state => state.ui.notifications)
}

export const useGlobalLoading = () => {
  return useAppSelector(state => state.ui.loading.global)
}

export const useLoading = (key: string) => {
  return useAppSelector(state => state.ui.loading[key] || false)
}
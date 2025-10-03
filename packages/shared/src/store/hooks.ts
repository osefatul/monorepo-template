import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import type { BaseRootState } from './types'
import type { AppStore } from './utils'

export const useAppDispatch = () => useDispatch<AppStore['dispatch']>()
export const useAppSelector: TypedUseSelectorHook<BaseRootState> = useSelector

export const useAuth = () => {
  return useAppSelector(state => state.auth)
}

import React from 'react'
import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../store'

// Custom hook that combines navigation with authentication
export const useAppNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  const navigateTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options)
  }

  const goBack = () => {
    navigate(-1)
  }

  const isCurrentPath = (path: string) => {
    return location.pathname === path
  }

  const isPathActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return {
    currentPath: location.pathname,
    navigate: navigateTo,
    goBack,
    isCurrentPath,
    isPathActive,
    isAuthenticated: !!auth.user,
    userRole: auth.user?.role,
    location,
  }
}

// Hook for typed route parameters
export const useRouteParams = <T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T => {
  return useParams() as T
}

// Hook to generate breadcrumbs based on current path
export const useBreadcrumbs = (routeMap: Record<string, string>) => {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    const label = routeMap[path] || segment.charAt(0).toUpperCase() + segment.slice(1)

    return {
      label,
      path: index === pathSegments.length - 1 ? undefined : path, // Last item has no link
      active: index === pathSegments.length - 1
    }
  })

  // Add home breadcrumb
  return [
    { label: 'Home', path: '/', active: location.pathname === '/' },
    ...breadcrumbs
  ].filter((crumb, index, arr) => index === 0 || crumb.path !== '/')
}
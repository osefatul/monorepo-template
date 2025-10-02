export interface RouteConfig {
  path: string
  element: React.ComponentType<any>
  title?: string
  requiresAuth?: boolean
  roles?: string[]
  children?: RouteConfig[]
}

export interface AppRoutes {
  [key: string]: RouteConfig
}

export interface NavigationItem {
  id: string
  label: string
  path: string
  icon?: React.ComponentType<any>
  requiresAuth?: boolean
  roles?: string[]
  children?: NavigationItem[]
}

export interface BreadcrumbItem {
  label: string
  path?: string
  active?: boolean
}

export type RouteParams = Record<string, string | undefined>

export interface RouterContextValue {
  currentPath: string
  isAuthenticated: boolean
  userRole?: string
  navigate: (path: string, options?: { replace?: boolean; state?: any }) => void
  goBack: () => void
}
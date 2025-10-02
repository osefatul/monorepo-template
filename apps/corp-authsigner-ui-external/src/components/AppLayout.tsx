import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar, Breadcrumbs } from '@shared/components'
import { useTheme } from '@shared/store'

export const AppLayout: React.FC = () => {
  const theme = useTheme()
  const location = useLocation()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Signing Portal', path: '/signing', requiresAuth: true },
    { label: 'Contact', path: '/contact' },
  ]

  const routeMap = {
    '/': 'Home',
    '/signing': 'Signing Portal',
    '/contact': 'Contact Us',
    '/login': 'Login',
  }

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
    minHeight: '100vh',
  }

  // Don't show breadcrumbs on home page or login page
  const showBreadcrumbs = location.pathname !== '/' && location.pathname !== '/login'

  return (
    <div style={containerStyle}>
      <Navbar appName="Corp Auth Signer" navItems={navItems} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBreadcrumbs && <Breadcrumbs routeMap={routeMap} />}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar, Breadcrumbs } from '@shared/components'
import { useTheme } from '@shared/store'

export const AppLayout: React.FC = () => {
  const theme = useTheme()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { label: 'Documents', path: '/documents', requiresAuth: true },
    { label: 'Users', path: '/users', requiresAuth: true, roles: ['internal'] },
  ]

  const routeMap = {
    '/dashboard': 'Dashboard',
    '/documents': 'Documents',
    '/users': 'User Management',
  }

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
    minHeight: '100vh',
  }

  return (
    <div style={containerStyle}>
      <Navbar appName="Internal Portal" navItems={navItems} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs routeMap={routeMap} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
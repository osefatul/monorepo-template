import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppNavigation } from '../../routing'
import { useAuth, useTheme, useAppDispatch, uiActions, useLogoutMutation } from '../../store'
import { Button } from '../Button'

interface NavItem {
  label: string
  path: string
  requiresAuth?: boolean
  roles?: string[]
}

interface NavbarProps {
  appName: string
  navItems: NavItem[]
  className?: string
}

export const Navbar: React.FC<NavbarProps> = ({ appName, navItems, className = '' }) => {
  const { isAuthenticated, userRole } = useAppNavigation()
  const auth = useAuth()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      dispatch(uiActions.addNotification({
        notification: {
          type: 'info',
          title: 'Logged Out',
          message: 'You have been successfully logged out',
          dismissible: true,
        },
      }))
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleTheme = () => {
    dispatch(uiActions.toggleTheme())
  }

  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (item.roles && item.roles.length > 0 && (!userRole || !item.roles.includes(userRole))) return false
    return true
  })

  const navbarStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#f8fafc',
    color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
    borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
  }

  const linkStyle = (isActive: boolean) => ({
    color: isActive
      ? (theme === 'dark' ? '#3b82f6' : '#2563eb')
      : (theme === 'dark' ? '#d1d5db' : '#4b5563'),
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
    backgroundColor: isActive
      ? (theme === 'dark' ? '#1e3a8a' : '#dbeafe')
      : 'transparent',
  })

  return (
    <nav style={navbarStyle} className={`p-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* App Name */}
        <div className="flex items-center space-x-8">
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="text-xl font-bold">{appName}</h1>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {filteredNavItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => linkStyle(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="small"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>

          {/* User Info & Logout */}
          {isAuthenticated && auth.user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm">
                Welcome, <strong>{auth.user.name}</strong>
              </span>
              <Button
                variant="secondary"
                size="small"
                onClick={handleLogout}
                loading={isLoggingOut}
              >
                Logout
              </Button>
            </div>
          ) : (
            <NavLink to="/login">
              <Button variant="primary" size="small">
                Login
              </Button>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Simple responsive menu */}
      <div className="md:hidden mt-4 pt-4 border-t border-gray-300">
        <div className="flex flex-col space-y-2">
          {filteredNavItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => linkStyle(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
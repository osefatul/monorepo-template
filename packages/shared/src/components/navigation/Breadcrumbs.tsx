import React from 'react'
import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../../routing'
import { useTheme } from '../../store'

interface BreadcrumbsProps {
  routeMap?: Record<string, string>
  className?: string
  separator?: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  routeMap = {},
  className = '',
  separator = '/'
}) => {
  const breadcrumbs = useBreadcrumbs(routeMap)
  const theme = useTheme()

  if (breadcrumbs.length <= 1) {
    return null // Don't show breadcrumbs for home page only
  }

  const breadcrumbStyle = {
    color: theme === 'dark' ? '#d1d5db' : '#4b5563',
    fontSize: '0.875rem',
  }

  const linkStyle = {
    color: theme === 'dark' ? '#3b82f6' : '#2563eb',
    textDecoration: 'none',
  }

  const separatorStyle = {
    margin: '0 0.5rem',
    color: theme === 'dark' ? '#6b7280' : '#9ca3af',
  }

  return (
    <nav aria-label="Breadcrumb" style={breadcrumbStyle} className={`py-2 ${className}`}>
      <ol className="flex items-center">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path || crumb.label} className="flex items-center">
            {index > 0 && (
              <span style={separatorStyle} aria-hidden="true">
                {separator}
              </span>
            )}
            {crumb.path && !crumb.active ? (
              <Link
                to={crumb.path}
                style={linkStyle}
                className="hover:underline"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={crumb.active ? 'font-medium' : ''}>
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
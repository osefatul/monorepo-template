import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium'

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return <span className={classes}>{children}</span>
}

// Status badges for documents
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variantMap: Record<string, BadgeProps['variant']> = {
    draft: 'default',
    pending: 'warning',
    signed: 'success',
    expired: 'danger',
    rejected: 'danger',
  }

  return (
    <Badge variant={variantMap[status] || 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const variantMap: Record<string, BadgeProps['variant']> = {
    low: 'default',
    medium: 'info',
    high: 'warning',
    urgent: 'danger',
  }

  return (
    <Badge variant={variantMap[priority] || 'default'} size="sm">
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

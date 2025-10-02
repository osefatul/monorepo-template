import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  footer?: ReactNode
}

export const Card = ({ children, className = '', title, footer }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {title != null ? (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      ) : null}
      <div className="px-6 py-4">{children}</div>
      {footer != null ? (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>
      ) : null}
    </div>
  )
}

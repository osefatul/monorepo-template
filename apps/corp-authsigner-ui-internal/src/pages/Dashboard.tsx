import React from 'react'
import { Card, Button } from '@shared/components'
import { useAuth, useTheme } from '@shared/store'
import { formatDate } from '@shared/utils'

export const Dashboard: React.FC = () => {
  const auth = useAuth()
  const theme = useTheme()

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '2rem',
  }

  const stats = [
    { label: 'Total Documents', value: '1,234', trend: '+12%' },
    { label: 'Pending Approvals', value: '56', trend: '+5%' },
    { label: 'Approved Today', value: '23', trend: '+8%' },
    { label: 'Active Users', value: '89', trend: '+3%' },
  ]

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Internal Dashboard</h1>
          <p className="text-lg opacity-75">
            Welcome back, {auth.user?.name}! Here's what's happening today.
          </p>
          <p className="text-sm opacity-60">
            Last updated: {formatDate(new Date())}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-75">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.trend}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Quick Actions" className="p-6">
            <div className="space-y-4">
              <Button variant="primary" className="w-full">
                Create New Document
              </Button>
              <Button variant="outline" className="w-full">
                Review Pending Approvals
              </Button>
              <Button variant="outline" className="w-full">
                Generate Report
              </Button>
            </div>
          </Card>

          <Card title="Recent Activity" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="font-medium">Document ABC-123 approved</p>
                  <p className="text-sm opacity-75">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm opacity-75">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Report generated</p>
                  <p className="text-sm opacity-75">1 hour ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
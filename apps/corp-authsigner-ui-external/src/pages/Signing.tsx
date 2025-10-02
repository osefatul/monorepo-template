import React, { useState } from 'react'
import { Card, Button } from '@shared/components'
import { useAuth, useTheme } from '@shared/store'

export const Signing: React.FC = () => {
  const auth = useAuth()
  const theme = useTheme()
  const [activeTab, setActiveTab] = useState('pending')

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '2rem',
  }

  const signingRequests = {
    pending: [
      {
        id: 'REQ-001',
        title: 'Partnership Agreement - TechCorp',
        description: 'Strategic partnership agreement for Q2 2024',
        deadline: '2024-01-20',
        priority: 'high',
      },
      {
        id: 'REQ-002',
        title: 'Service Level Agreement',
        description: 'SLA for cloud services integration',
        deadline: '2024-01-25',
        priority: 'medium',
      },
    ],
    completed: [
      {
        id: 'REQ-003',
        title: 'Vendor Agreement - DataSys',
        description: 'Completed vendor agreement',
        completedAt: '2024-01-10',
        priority: 'low',
      },
    ],
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const tabStyle = (isActive: boolean) => ({
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
    backgroundColor: 'transparent',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
  })

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Signing Portal</h1>
          <p className="text-lg opacity-75">
            Welcome back, {auth.user?.name}! Manage your signing requests below.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {signingRequests.pending.length}
              </p>
              <p className="text-sm opacity-75">Pending Signatures</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {signingRequests.completed.length}
              </p>
              <p className="text-sm opacity-75">Completed This Month</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {signingRequests.pending.length + signingRequests.completed.length}
              </p>
              <p className="text-sm opacity-75">Total Requests</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">
                + Request New Signature
              </Button>
              <Button variant="outline">
                Upload Document
              </Button>
              <Button variant="outline">
                Check Request Status
              </Button>
              <Button variant="outline">
                Download Signed Documents
              </Button>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="overflow-hidden">
          <div className="border-b" style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}>
            <div className="flex">
              <button
                style={tabStyle(activeTab === 'pending')}
                onClick={() => setActiveTab('pending')}
              >
                Pending ({signingRequests.pending.length})
              </button>
              <button
                style={tabStyle(activeTab === 'completed')}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({signingRequests.completed.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {signingRequests.pending.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4"
                    style={{
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{request.title}</h4>
                        <p className="opacity-75 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>ID: {request.id}</span>
                          <span>Deadline: {request.deadline}</span>
                          <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                            Priority: {request.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="primary" size="small">
                          Sign Document
                        </Button>
                        <Button variant="outline" size="small">
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {signingRequests.completed.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4"
                    style={{
                      borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                      backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{request.title}</h4>
                        <p className="opacity-75 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>ID: {request.id}</span>
                          <span>Completed: {request.completedAt}</span>
                          <span className="text-green-600 font-medium">✓ Signed</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="small">
                          Download
                        </Button>
                        <Button variant="outline" size="small">
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {((activeTab === 'pending' && signingRequests.pending.length === 0) ||
              (activeTab === 'completed' && signingRequests.completed.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-lg opacity-75">
                  No {activeTab} signing requests found.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
import React, { useState } from 'react'
import { Card, Button } from '@shared/components'
import { useTheme } from '@shared/store'

export const Documents: React.FC = () => {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '2rem',
  }

  const documents = [
    { id: 'DOC-001', title: 'Partnership Agreement', status: 'pending', createdAt: '2024-01-15', creator: 'John Doe' },
    { id: 'DOC-002', title: 'Service Contract', status: 'approved', createdAt: '2024-01-14', creator: 'Jane Smith' },
    { id: 'DOC-003', title: 'NDA Template', status: 'draft', createdAt: '2024-01-13', creator: 'Bob Johnson' },
    { id: 'DOC-004', title: 'License Agreement', status: 'rejected', createdAt: '2024-01-12', creator: 'Alice Brown' },
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.creator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'rejected': return 'text-red-600'
      case 'draft': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Document Management</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg"
                style={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 border rounded-lg"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              }}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <Button variant="primary">
              + New Document
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">{doc.title}</div>
                        <div className="text-sm opacity-75">{doc.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doc.creator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {doc.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button variant="outline" size="small">View</Button>
                      <Button variant="outline" size="small">Edit</Button>
                      {doc.status === 'pending' && (
                        <Button variant="primary" size="small">Approve</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg opacity-75">No documents found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
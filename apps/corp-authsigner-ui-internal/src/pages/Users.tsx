import React from 'react'
import { Card, Button } from '@shared/components'
import { useTheme } from '@shared/store'

export const Users: React.FC = () => {
  const theme = useTheme()

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '2rem',
  }

  const users = [
    { id: '1', name: 'John Doe', email: 'john@company.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-14' },
    { id: '3', name: 'Bob Johnson', email: 'bob@company.com', role: 'User', status: 'Inactive', lastLogin: '2024-01-10' },
    { id: '4', name: 'Alice Brown', email: 'alice@company.com', role: 'User', status: 'Active', lastLogin: '2024-01-13' },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'text-red-600'
      case 'Manager': return 'text-blue-600'
      case 'User': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-600' : 'text-gray-600'
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">User Management</h1>
          <div className="flex justify-between items-center">
            <p className="text-lg opacity-75">Manage internal users and their permissions</p>
            <Button variant="primary">+ Add New User</Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              <p className="text-sm opacity-75">Total Users</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.status === 'Active').length}
              </p>
              <p className="text-sm opacity-75">Active Users</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {users.filter(u => u.role === 'Admin').length}
              </p>
              <p className="text-sm opacity-75">Administrators</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {users.filter(u => u.role === 'Manager').length}
              </p>
              <p className="text-sm opacity-75">Managers</p>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-sm opacity-75">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button variant="outline" size="small">Edit</Button>
                      <Button variant="outline" size="small">
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="small">Reset Password</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
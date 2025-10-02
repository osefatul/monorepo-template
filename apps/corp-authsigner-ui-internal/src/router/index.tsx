import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard, Documents, Users, Login } from '../pages'

// Layout component that includes navigation
import { AppLayout } from '../components/AppLayout'

export const AppRouter: React.FC = () => {

  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Main app routes */}
      <Route path="/" element={<AppLayout />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard routes */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Document management routes */}
        <Route path="documents" element={<Documents />} />

        {/* User management routes */}
        <Route path="users" element={<Users />} />
      </Route>

      {/* 404 page */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
              <a href="/" className="text-blue-600 hover:underline">
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  )
}
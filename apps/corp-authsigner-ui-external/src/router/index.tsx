import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, Signing, Contact, Login } from '../pages'

// Layout component that includes navigation
import { AppLayout } from '../components/AppLayout'

export const AppRouter: React.FC = () => {

  return (
    <Routes>
      {/* Main app routes with layout */}
      <Route path="/" element={<AppLayout />}>
        {/* Home page - accessible to everyone */}
        <Route index element={<Home />} />

        {/* Contact page - accessible to everyone */}
        <Route path="contact" element={<Contact />} />

        {/* Login page */}
        <Route path="login" element={<Login />} />

        {/* Signing portal */}
        <Route path="signing" element={<Signing />} />
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
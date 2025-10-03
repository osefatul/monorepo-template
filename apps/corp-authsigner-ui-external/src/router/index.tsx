import React from 'react'

import { Route, Routes } from 'react-router-dom'

import { AppLayout } from '../components/AppLayout'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* <Route path="login" element={<Login />} /> */}
      </Route>

      <Route
        path="*"
        element={
          <div>
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  )
}

import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Card, Button } from '@shared/components'
import { useAuth, useTheme, useAppDispatch, uiActions, useLoginMutation } from '@shared/store'
import { validateEmail } from '@shared/utils'

export const Login: React.FC = () => {
  const auth = useAuth()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()

  const [email, setEmail] = useState('internal@company.com')
  const [password, setPassword] = useState('demo-password')
  const [isValidEmail, setIsValidEmail] = useState(true)

  // Redirect if already authenticated
  if (auth.user) {
    return <Navigate to="/dashboard" replace />
  }

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f3f4f6',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
    setIsValidEmail(validateEmail(value))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidEmail || !password) {
      return
    }

    try {
      await login({ email, password }).unwrap()
      dispatch(uiActions.addNotification({
        notification: {
          type: 'success',
          title: 'Welcome!',
          message: 'Successfully logged in to internal system',
          dismissible: true,
        },
      }))
    } catch (error: any) {
      dispatch(uiActions.addNotification({
        notification: {
          type: 'error',
          title: 'Login Failed',
          message: error?.data?.message || 'Please check your credentials',
          dismissible: true,
        },
      }))
    }
  }

  const inputStyle = {
    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
    borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    color: theme === 'dark' ? '#ffffff' : '#000000',
  }

  return (
    <div style={containerStyle}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Internal Portal</h1>
          <p className="opacity-75">Sign in to access the internal dashboard</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg"
                style={inputStyle}
                required
              />
              {email && !isValidEmail && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg"
                style={inputStyle}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              disabled={!isValidEmail || !password}
            >
              Sign In
            </Button>

            {auth.error && (
              <div className="text-red-500 text-sm text-center mt-4">
                {auth.error}
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm opacity-75">
            <p>Demo Credentials:</p>
            <p>Email: internal@company.com</p>
            <p>Password: demo-password</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
import { useState } from 'react'

import { Button, Card, LoadingSpinner } from '@shared/components'
import type { User } from '@shared/types'
import { formatDate, validateEmail } from '@shared/utils'

import './App.css'

const App = () => {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [loading, setLoading] = useState(false)

  const user: User = {
    id: 'ext-001',
    email: 'external@partner.com',
    name: 'External Partner',
    role: 'external',
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
    setIsValidEmail(validateEmail(value))
  }

  const handleSignIn = async () => {
    if (!isValidEmail) {
      return
    }
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
  }

  return (
    <>
      <div>
        <h1>Corp Auth Signer - External UI</h1>
        <p>
          Welcome, {user.name} ({user.role})
        </p>
        <p>Session started: {formatDate(new Date())}</p>
      </div>

      <Card className="max-w-md mx-auto" title="External Authentication">
        <div className="space-y-4">
          <div className="card">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter email address"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <p className={`text-sm mt-1 ${isValidEmail ? 'text-green-600' : 'text-red-600'}`}>
              {email ? (isValidEmail ? 'Valid email' : 'Invalid email format') : null}
            </p>
          </div>

          <div className="flex gap-2">
            <Button disabled={!isValidEmail} loading={loading} onClick={handleSignIn}>
              Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEmail('')
                setIsValidEmail(false)
              }}
            >
              Clear
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : null}

          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </Card>

      <p className="read-the-docs">External application for corporate authentication signing</p>
    </>
  )
}

export default App

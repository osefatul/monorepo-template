import { useState } from 'react'
import { Button, Card, LoadingSpinner } from '@shared/components'
import { formatDate, validateEmail } from '@shared/utils'
import { User } from '@shared/types'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [loading, setLoading] = useState(false)

  const user: User = {
    id: 'ext-001',
    email: 'external@partner.com',
    name: 'External Partner',
    role: 'external'
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValidEmail(validateEmail(value))
  }

  const handleSignIn = async () => {
    if (!isValidEmail) return
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
  }

  return (
    <>
      <div>
        <h1>Corp Auth Signer - External UI</h1>
        <p>Welcome, {user.name} ({user.role})</p>
        <p>Session started: {formatDate(new Date())}</p>
      </div>
      
      <Card title="External Authentication" className="max-w-md mx-auto">
        <div className="space-y-4">
          <div className="card">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <p className={`text-sm mt-1 ${isValidEmail ? 'text-green-600' : 'text-red-600'}`}>
              {email && (isValidEmail ? 'Valid email' : 'Invalid email format')}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSignIn}
              disabled={!isValidEmail}
              loading={loading}
            >
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
          
          {loading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </Card>
      
      <p className="read-the-docs">
        External application for corporate authentication signing
      </p>
    </>
  )
}

export default App
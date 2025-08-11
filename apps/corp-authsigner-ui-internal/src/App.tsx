import { useState } from 'react'
import { Button, Card, LoadingSpinner } from '@shared/components'
import { formatDate, generateId } from '@shared/utils'
import { User } from '@shared/types'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const user: User = {
    id: generateId(),
    email: 'internal@company.com',
    name: 'Internal User',
    role: 'internal'
  }

  const handleAsyncAction = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setCount(prev => prev + 1)
  }

  return (
    <>
      <div>
        <h1>Corp Auth Signer - Internal UI</h1>
        <p>Welcome, {user.name} ({user.role})</p>
        <p>Current time: {formatDate(new Date())}</p>
      </div>
      
      <Card title="Shared Components Demo" className="max-w-md mx-auto">
        <div className="space-y-4">
          <div className="card">
            <p>Count: {count}</p>
            <div className="flex gap-2">
              <Button onClick={() => setCount(count + 1)}>
                Increment
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setCount(0)}
              >
                Reset
              </Button>
              <Button 
                variant="outline" 
                loading={loading}
                onClick={handleAsyncAction}
              >
                Async Action
              </Button>
            </div>
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
        Internal application for corporate authentication signing
      </p>
    </>
  )
}

export default App
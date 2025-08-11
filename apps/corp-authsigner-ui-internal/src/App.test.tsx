import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('Internal App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Corp Auth Signer - Internal UI')).toBeInTheDocument()
  })

  it('displays user information', () => {
    render(<App />)
    expect(screen.getByText(/Welcome, Internal User \(internal\)/)).toBeInTheDocument()
    expect(screen.getByText(/Current time:/)).toBeInTheDocument()
  })

  it('renders shared components', () => {
    render(<App />)
    expect(screen.getByText('Shared Components Demo')).toBeInTheDocument()
    expect(screen.getByText('Increment')).toBeInTheDocument()
    expect(screen.getByText('Reset')).toBeInTheDocument()
    expect(screen.getByText('Async Action')).toBeInTheDocument()
  })

  it('increments counter when increment button is clicked', () => {
    render(<App />)
    const incrementButton = screen.getByText('Increment')
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
    
    fireEvent.click(incrementButton)
    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })

  it('resets counter when reset button is clicked', () => {
    render(<App />)
    const incrementButton = screen.getByText('Increment')
    const resetButton = screen.getByText('Reset')
    
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    expect(screen.getByText('Count: 2')).toBeInTheDocument()
    
    fireEvent.click(resetButton)
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})
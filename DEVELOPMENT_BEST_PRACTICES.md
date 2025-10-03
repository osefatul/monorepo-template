# Development Best Practices

This document outlines the coding standards, conventions, and best practices for our React + TypeScript monorepo. All developers should follow these guidelines to ensure consistency, maintainability, and code quality across the entire codebase.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Best Practices](#component-best-practices)
3. [Naming Conventions](#naming-conventions)
4. [TypeScript Guidelines](#typescript-guidelines)
5. [State Management](#state-management)
6. [Routing Best Practices](#routing-best-practices)
7. [Testing Standards](#testing-standards)
8. [Code Formatting & Linting](#code-formatting--linting)
9. [Import Organization](#import-organization)
10. [Performance Guidelines](#performance-guidelines)
11. [Security Best Practices](#security-best-practices)
12. [Git Workflow](#git-workflow)

## Project Structure

### Monorepo Organization

```
monorepo-template/
├── apps/                           # Application packages
│   ├── corp-authsigner-ui-internal/    # Internal-facing UI
│   └── corp-authsigner-ui-external/    # External-facing UI
├── packages/                       # Shared packages
│   └── shared/                     # Shared components, utils, types
├── docs/                          # Documentation
├── .husky/                        # Git hooks
└── package.json                   # Root workspace configuration
```

### Package Structure

Each app and package should follow this structure:

```
package/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components (apps only)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── config/            # Configuration files
│   ├── services/          # API calls and external services
│   ├── stores/            # State management (Zustand, Redux, etc.)
│   ├── assets/            # Static assets
│   └── __tests__/         # Test files (alternative: co-located tests)
├── dist/                  # Build output
├── package.json
├── tsconfig.json
└── vite.config.ts         # Build configuration
```

## Component Best Practices

### Component Structure

**✅ Good: Functional Components with TypeScript**

```tsx
import { ReactNode, useState } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
  className?: string
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  onClick,
  className = '',
}: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false)

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  }

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  )
}
```

### Component Guidelines

1. **Always use TypeScript interfaces** for props
2. **Provide default values** for optional props
3. **Use meaningful prop names** that describe their purpose
4. **Extend HTML attributes** when appropriate (e.g., `ButtonHTMLAttributes<HTMLButtonElement>`)
5. **Keep components focused** - single responsibility principle
6. **Use composition over inheritance**
7. **Implement proper error boundaries** for complex components

### Component Patterns

**Container/Presentation Pattern:**

```tsx
// Container Component (business logic)
const UserProfileContainer = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchUser = async (id: string) => {
    setLoading(true)
    try {
      const userData = await userService.getUser(id)
      setUser(userData)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  return <UserProfile user={user} loading={loading} onRefresh={fetchUser} />
}

// Presentation Component (UI only)
interface UserProfileProps {
  user: User | null
  loading: boolean
  onRefresh: (id: string) => void
}

const UserProfile = ({ user, loading, onRefresh }: UserProfileProps) => {
  if (loading) return <LoadingSpinner />
  if (!user) return <div>No user found</div>

  return (
    <Card>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <Button onClick={() => onRefresh(user.id)}>Refresh</Button>
    </Card>
  )
}
```

## Naming Conventions

### Components

- **PascalCase** for component names: `UserProfile`, `NavigationBar`, `PaymentButton`
- **Descriptive and specific**: `UserProfileCard` instead of `Card`
- **Avoid abbreviations**: `NavigationBar` instead of `NavBar`

### Files and Directories

- **PascalCase** for component files: `UserProfile.tsx`, `PaymentButton.tsx`
- **camelCase** for utility files: `formatDate.ts`, `validateEmail.ts`
- **kebab-case** for directories: `user-profile/`, `payment-processing/`
- **Lowercase** for config files: `package.json`, `tsconfig.json`

### Variables and Functions

```tsx
// ✅ Good: Descriptive camelCase
const getUserProfile = async (userId: string) => {
  /* ... */
}
const isEmailValid = validateEmail(email)
const currentUserData = await fetchCurrentUser()

// ❌ Avoid: Abbreviated or unclear names
const getUsrProf = async (id: string) => {
  /* ... */
}
const isValid = validate(email)
const data = await fetch()
```

### Constants

```tsx
// ✅ Good: SCREAMING_SNAKE_CASE for constants
const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTHENTICATION: '/api/auth',
  PAYMENTS: '/api/payments',
} as const

const MAX_RETRY_ATTEMPTS = 3
const DEFAULT_TIMEOUT = 5000

// ✅ Good: Enums with PascalCase
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
```

### Interfaces and Types

```tsx
// ✅ Good: PascalCase with descriptive names
interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

// ✅ Good: Event handler types
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void
type FormSubmitHandler = (data: FormData) => Promise<void>
```

## TypeScript Guidelines

### Type Definitions

**Always define explicit types for:**

1. **Component props**
2. **API responses**
3. **Function parameters and return types**
4. **State objects**

```tsx
// ✅ Good: Explicit typing
interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

const handleLogin = async (formData: LoginFormData): Promise<ApiResponse<User>> => {
  try {
    const response = await authService.login(formData)
    return response
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`)
  }
}

// ✅ Good: Generic types for reusability
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

const fetchUser = async (id: string): Promise<ApiResponse<User>> => {
  // Implementation
}
```

### Utility Types

```tsx
// ✅ Leverage TypeScript utility types
type PartialUser = Partial<User> // All properties optional
type UserWithoutId = Omit<User, 'id'> // User without id property
type UserEmailAndName = Pick<User, 'email' | 'name'> // Only email and name
type UserKeys = keyof User // 'id' | 'email' | 'name' | 'role'
```

### Type Guards

```tsx
// ✅ Good: Type guards for runtime type checking
const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'role' in obj
  )
}

// Usage
const processUserData = (data: unknown) => {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.email) // ✅ Safe
  }
}
```

## State Management

### Local State (useState)

Use for component-specific state that doesn't need to be shared:

```tsx
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Component logic here
}
```

### Context API

Use for sharing state across component trees without external libraries:

```tsx
interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    setUser(response.data)
  }

  const logout = () => {
    setUser(null)
    authService.logout()
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### External State Management (Zustand/Redux)

For complex application state, use a dedicated state management library:

```tsx
// Zustand example
interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  notifications: Notification[]
  setUser: (user: User | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Notification) => void
}

const useAppStore = create<AppState>(set => ({
  user: null,
  theme: 'light',
  notifications: [],
  setUser: user => set({ user }),
  setTheme: theme => set({ theme }),
  addNotification: notification =>
    set(state => ({
      notifications: [...state.notifications, notification],
    })),
}))
```

## Routing Best Practices

### File-based Routing (if using Next.js)

```
pages/
├── index.tsx                 # /
├── about.tsx                # /about
├── users/
│   ├── index.tsx            # /users
│   ├── [id].tsx             # /users/:id
│   └── profile/
│       └── [id].tsx         # /users/profile/:id
└── api/
    └── users/
        └── [id].ts          # /api/users/:id
```

### Route-based Code Splitting

```tsx
import { Suspense, lazy } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const Settings = lazy(() => import('./pages/Settings'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

### Protected Routes

```tsx
interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requiredRole?: UserRole
}

const ProtectedRoute = ({ children, requireAuth = true, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth()

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

// Usage
;<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## Testing Standards

### Unit Testing

```tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies correct variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-600')
  })
})
```

### Custom Hook Testing

```tsx
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCounter } from './useCounter'

describe('useCounter Hook', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('increments count', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
```

## Code Formatting & Linting

### ESLint Configuration

Follow the existing ESLint configuration in `eslint.config.js`:

```typescript
// Key rules to follow:
- Use TypeScript strict mode
- Follow React Hooks rules
- No unused variables
- Consistent semicolon usage (off)
- Single quotes for strings
- No console.log in production code
```

### Prettier Configuration

Follow the settings in `.prettierrc.json`:

```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## Import Organization

Follow the import order defined in `.prettierrc.json`:

```tsx
// 1. React imports
import { useEffect, useState } from 'react'
import { createContext } from 'react'

// 2. Next.js imports (if applicable)
import { GetServerSideProps } from 'next'

// 3. Third-party libraries
import axios from 'axios'
import { z } from 'zod'

// 4. Shared package imports
import { Button, Card } from '@shared/components'
import { User } from '@shared/types'
import { validateEmail } from '@shared/utils'

// 5. Internal app imports
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'

import { helperFunction } from '../utils'
import { ChildComponent } from './ChildComponent'
// 6. Relative imports
import './Component.css'
```

## Performance Guidelines

### React Performance

1. **Use React.memo for expensive components:**

```tsx
const ExpensiveComponent = React.memo(({ data }: { data: ComplexData }) => {
  return <div>{/* Expensive rendering logic */}</div>
})
```

2. **Optimize re-renders with useMemo and useCallback:**

```tsx
const SearchResults = ({ query, items }: Props) => {
  const filteredItems = useMemo(
    () => items.filter(item => item.name.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  )

  const handleItemClick = useCallback((id: string) => {
    // Handle click logic
  }, [])

  return (
    <div>
      {filteredItems.map(item => (
        <Item key={item.id} item={item} onClick={handleItemClick} />
      ))}
    </div>
  )
}
```

3. **Implement proper key props for lists:**

```tsx
// ✅ Good: Stable, unique keys
{
  users.map(user => <UserCard key={user.id} user={user} />)
}

// ❌ Avoid: Index as key for dynamic lists
{
  users.map((user, index) => <UserCard key={index} user={user} />)
}
```

### Bundle Optimization

1. **Use dynamic imports for code splitting:**

```tsx
const LazyComponent = lazy(() => import('./LazyComponent'))

// Or with named exports
const LazyComponent = lazy(() =>
  import('./LazyComponent').then(module => ({ default: module.LazyComponent }))
)
```

2. **Optimize images and assets:**

```tsx
// Use appropriate image formats and sizes
<img src="/images/hero.webp" alt="Hero image" loading="lazy" width={800} height={600} />
```

## Security Best Practices

### Input Sanitization

```tsx
import DOMPurify from 'dompurify'

// ✅ Good: Sanitize user input before rendering
const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html)
}

const UserContent = ({ content }: { content: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(content),
      }}
    />
  )
}
```

### Environment Variables

```tsx
// ✅ Good: Use environment variables for sensitive data
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_KEY = process.env.VITE_API_KEY

// ❌ Never: Hardcode sensitive information
const API_KEY = 'sk-1234567890abcdef' // DON'T DO THIS
```

### Authentication

```tsx
// ✅ Good: Secure token handling
const authService = {
  setToken: (token: string) => {
    // Store in httpOnly cookie or secure storage
    localStorage.setItem('authToken', token)
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken')
  },

  removeToken: () => {
    localStorage.removeItem('authToken')
  },
}
```

## Git Workflow

### Commit Messages

Follow conventional commits format:

```
type(scope): description

- feat: new feature
- fix: bug fix
- docs: documentation changes
- style: formatting changes
- refactor: code refactoring
- test: adding tests
- chore: maintenance tasks

Examples:
feat(auth): add user login functionality
fix(button): resolve disabled state styling
docs(readme): update installation instructions
```

### Branch Naming

```
feature/user-authentication
bugfix/login-validation-error
hotfix/security-vulnerability
chore/update-dependencies
```

### Pre-commit Hooks

The repository uses Husky for pre-commit hooks:

- **Lint-staged**: Runs ESLint and Prettier on staged files
- **Type checking**: Ensures TypeScript compiles without errors
- **Tests**: Runs relevant test suites

---

## Conclusion

These best practices should be followed consistently across all development work. They ensure:

- **Code Quality**: Maintainable, readable, and robust code
- **Team Collaboration**: Consistent patterns everyone can understand
- **Performance**: Optimized applications that scale well
- **Security**: Protection against common vulnerabilities
- **Developer Experience**: Smooth development workflow with proper tooling

For questions or suggestions about these practices, please create an issue or submit a pull request.

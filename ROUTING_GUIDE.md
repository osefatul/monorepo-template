# React Router Guide

This guide explains how to use React Router in our monorepo structure for navigation and routing between pages.

## 🏗️ **Architecture Overview**

### 📁 File Structure

```
packages/shared/src/routing/
├── types.ts               # Routing types and interfaces
├── hooks.ts               # Custom routing hooks
├── guards.ts              # Route protection utilities
└── index.ts               # Routing exports

apps/[app-name]/src/
├── router/
│   └── index.tsx          # App-specific router configuration
├── pages/
│   ├── HomePage.tsx       # Individual page components
│   ├── LoginPage.tsx
│   └── index.ts           # Page exports
└── components/
    └── AppLayout.tsx      # Layout wrapper with navigation
```

## 🚀 **Current Implementation**

### ✅ **What's Working:**

1. **✅ React Router DOM** installed and configured
2. **✅ Shared navigation components** (Navbar, Breadcrumbs)
3. **✅ Page-based routing** for both apps
4. **✅ Layout components** with nested routing
5. **✅ Theme-aware navigation** with Redux integration

### 🔄 **App Routing Structure:**

#### **Internal App Routes:**

- `/` → Redirects to `/dashboard`
- `/login` → Login page
- `/dashboard` → Main dashboard
- `/documents` → Document management
- `/users` → User management (admin only)

#### **External App Routes:**

- `/` → Home page (public)
- `/login` → Login page
- `/contact` → Contact form (public)
- `/signing` → Signing portal (authenticated)

---

## 💡 **How to Add New Routes**

### 1. **Create a New Page Component**

```typescript
// apps/[app]/src/pages/NewPage.tsx
import React from 'react'
import { Card, Button } from '@shared/components'
import { useTheme } from '@shared/store'

export const NewPage: React.FC = () => {
  const theme = useTheme()

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '2rem',
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">New Page</h1>
        <Card className="p-6">
          <p>Your new page content goes here...</p>
        </Card>
      </div>
    </div>
  )
}
```

### 2. **Export from Pages Index**

```typescript
// apps/[app]/src/pages/index.ts
export * from './NewPage'
// ... other exports
```

### 3. **Add Route to Router**

```typescript
// apps/[app]/src/router/index.tsx
import { NewPage } from '../pages'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Add your new route */}
        <Route path="new-page" element={<NewPage />} />
        {/* ... other routes */}
      </Route>
    </Routes>
  )
}
```

### 4. **Add Navigation Link**

```typescript
// apps/[app]/src/components/AppLayout.tsx
const navItems = [
  { label: 'New Page', path: '/new-page' },
  // ... other nav items
]
```

---

## 🛡️ **Route Protection Patterns**

### **Basic Authentication Check (in page component)**

```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '@shared/store'

export const ProtectedPage: React.FC = () => {
  const auth = useAuth()

  // Redirect if not authenticated
  if (!auth.user) {
    return <Navigate to="/login" replace />
  }

  return <div>Protected content</div>
}
```

### **Role-Based Access**

```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '@shared/store'

export const AdminPage: React.FC = () => {
  const auth = useAuth()

  // Check authentication
  if (!auth.user) {
    return <Navigate to="/login" replace />
  }

  // Check role
  if (auth.user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />
  }

  return <div>Admin content</div>
}
```

---

## 🧭 **Navigation Patterns**

### **Using Navigation Hooks**

```typescript
import { useAppNavigation } from '@shared/routing'

export const MyComponent: React.FC = () => {
  const { navigate, goBack, isCurrentPath } = useAppNavigation()

  const handleNavigation = () => {
    navigate('/documents')
  }

  const handleBack = () => {
    goBack()
  }

  return (
    <div>
      <Button onClick={handleNavigation}>Go to Documents</Button>
      <Button onClick={handleBack}>Go Back</Button>
      {isCurrentPath('/dashboard') && <p>You're on the dashboard!</p>}
    </div>
  )
}
```

### **Using Link Components**

```typescript
import { Link, NavLink } from 'react-router-dom'

export const NavigationExample: React.FC = () => {
  return (
    <nav>
      {/* Basic link */}
      <Link to="/dashboard">Dashboard</Link>

      {/* NavLink with active state */}
      <NavLink
        to="/documents"
        style={({ isActive }) => ({
          fontWeight: isActive ? 'bold' : 'normal',
          color: isActive ? '#3b82f6' : '#4b5563',
        })}
      >
        Documents
      </NavLink>
    </nav>
  )
}
```

### **Programmatic Navigation**

```typescript
import { useNavigate } from 'react-router-dom'

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()

  const handleLogin = async () => {
    // ... login logic
    navigate('/dashboard', { replace: true })
  }

  return (
    <form onSubmit={handleLogin}>
      {/* form content */}
    </form>
  )
}
```

---

## 🍞 **Breadcrumbs**

### **Using Breadcrumbs Component**

```typescript
import { Breadcrumbs } from '@shared/components'

export const AppLayout: React.FC = () => {
  const routeMap = {
    '/dashboard': 'Dashboard',
    '/documents': 'Documents',
    '/documents/new': 'Create Document',
    '/users': 'User Management',
  }

  return (
    <div>
      <Navbar {...navbarProps} />
      <Breadcrumbs routeMap={routeMap} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

---

## 📊 **Route Parameters**

### **Route with Parameters**

```typescript
// In router configuration
<Route path="documents/:id" element={<DocumentDetail />} />
<Route path="users/:userId/edit" element={<EditUser />} />
```

### **Using Parameters in Components**

```typescript
import { useRouteParams } from '@shared/routing'

interface DocumentParams {
  id: string
}

export const DocumentDetail: React.FC = () => {
  const { id } = useRouteParams<DocumentParams>()

  return <div>Document ID: {id}</div>
}
```

### **Query Parameters**

```typescript
import { useSearchParams } from 'react-router-dom'

export const DocumentList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'
  const status = searchParams.get('status') || 'all'

  const updateFilters = (newStatus: string) => {
    setSearchParams({ page: '1', status: newStatus })
  }

  return <div>Current page: {page}, Status: {status}</div>
}
```

---

## 🎨 **Layout Patterns**

### **Nested Layouts**

```typescript
// Main layout
<Route path="/" element={<AppLayout />}>
  {/* Dashboard with sidebar */}
  <Route path="dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="analytics" element={<Analytics />} />
  </Route>

  {/* Simple pages */}
  <Route path="profile" element={<Profile />} />
</Route>
```

### **Conditional Navigation**

```typescript
export const Navbar: React.FC<NavbarProps> = ({ navItems }) => {
  const { isAuthenticated, userRole } = useAppNavigation()

  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (item.roles && !item.roles.includes(userRole)) return false
    return true
  })

  return (
    <nav>
      {filteredNavItems.map(item => (
        <NavLink key={item.path} to={item.path}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
```

---

## 🔧 **Advanced Patterns**

### **Lazy Loading Routes**

```typescript
import { lazy, Suspense } from 'react'

const LazyDocuments = lazy(() => import('../pages/Documents'))

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route
          path="documents"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LazyDocuments />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
```

### **Route Data Loading**

```typescript
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const DocumentDetail: React.FC = () => {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true)
      try {
        // Use RTK Query hook instead
        // const doc = await fetchDocument(id)
        // setDocument(doc)
      } catch (error) {
        console.error('Failed to load document:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadDocument()
    }
  }, [id])

  if (loading) return <div>Loading...</div>

  return <div>{/* document content */}</div>
}
```

---

## 📋 **Best Practices**

### ✅ **DO:**

- Use `NavLink` for navigation menus to show active states
- Implement proper loading states for route changes
- Use breadcrumbs for deep navigation hierarchies
- Protect routes at the component level for better UX
- Use typed route parameters with TypeScript
- Keep route configurations organized and documented

### ❌ **DON'T:**

- Don't use `<a>` tags for internal navigation (breaks SPA)
- Don't implement route guards that cause loading flashes
- Don't forget to handle 404 cases
- Don't hardcode URLs in components (use constants)
- Don't mix authentication logic with routing logic

### 🎯 **Tips:**

- Use `replace: true` for redirects to avoid back button issues
- Implement skeleton screens for better perceived performance
- Use route-based code splitting for large applications
- Consider implementing route-level error boundaries
- Use consistent URL patterns across your app

---

## 🔗 **Integration with Redux**

The routing system is fully integrated with our Redux store:

- **Authentication state** determines route access
- **Theme state** affects navigation styling
- **Navigation actions** can dispatch Redux actions
- **Route changes** can trigger data fetching

Example of integrated usage:

```typescript
import { useAppNavigation } from '@shared/routing'
import { useAppDispatch, useAuth, useTheme } from '@shared/store'

export const AuthenticatedRoute: React.FC = () => {
  const auth = useAuth()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { navigate } = useAppNavigation()

  // All integrated and working together!
}
```

This routing setup provides a solid foundation for navigation in your React applications! 🎉

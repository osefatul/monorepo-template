# Redux Toolkit + RTK Query Guide

This guide explains how to use Redux Toolkit and RTK Query in our monorepo structure for state management and API calls.

## Architecture Overview

### 📁 File Structure
```
packages/shared/src/store/
├── api/
│   ├── baseApi.ts          # Base RTK Query API configuration
│   ├── authApi.ts          # Shared authentication endpoints
│   └── index.ts            # API exports
├── slices/
│   ├── authSlice.ts        # Authentication state (works with RTK Query)
│   ├── uiSlice.ts          # UI state (theme, notifications, etc.)
│   └── index.ts            # Slice exports
├── hooks.ts                # Typed Redux hooks
├── middleware.ts           # Custom middleware
├── types.ts               # TypeScript types
├── utils.ts               # Store utilities
└── index.ts               # Main exports

apps/[app-name]/src/store/
├── api/
│   └── [appName]Api.ts     # App-specific API endpoints
├── slices/
│   └── [feature]Slice.ts   # App-specific slices
└── index.ts               # App store configuration
```

## 🔄 When to Use Shared vs App-Specific

### ✅ SHARED (packages/shared/src/store/)
Use shared store for:
- **Authentication** (login, logout, user profile)
- **UI State** (theme, global notifications, loading states)
- **Common API endpoints** (auth, user management)
- **Cross-app features** (settings, preferences)

### 🏠 APP-SPECIFIC (apps/[app]/src/store/)
Use app-specific store for:
- **Business logic specific to one app**
- **App-specific API endpoints**
- **Feature-specific state**
- **App-unique workflows**

---

## 🚀 How to Add New Slices

### 1. Shared Slice (for cross-app features)

Create in `packages/shared/src/store/slices/newFeatureSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NewFeatureState {
  data: any[]
  loading: boolean
  error: string | null
}

const initialState: NewFeatureState = {
  data: [],
  loading: false,
  error: null,
}

export const newFeatureSlice = createSlice({
  name: 'newFeature',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const newFeatureActions = newFeatureSlice.actions
export default newFeatureSlice.reducer
```

Add to `packages/shared/src/store/slices/index.ts`:
```typescript
export * from './newFeatureSlice'
```

Update `packages/shared/src/store/utils.ts`:
```typescript
import { newFeatureSlice } from './slices'

// In createBaseStore function:
reducer: {
  auth: authSlice.reducer,
  ui: uiSlice.reducer,
  newFeature: newFeatureSlice.reducer, // Add this
  [baseApi.reducerPath]: baseApi.reducer,
  ...additionalReducers,
},
```

### 2. App-Specific Slice

Create in `apps/[app]/src/store/slices/appFeatureSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppFeatureState {
  items: any[]
  selectedItem: any | null
}

const initialState: AppFeatureState = {
  items: [],
  selectedItem: null,
}

export const appFeatureSlice = createSlice({
  name: 'appFeature',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload
    },
    selectItem: (state, action: PayloadAction<any>) => {
      state.selectedItem = action.payload
    },
  },
})

export const appFeatureActions = appFeatureSlice.actions
export default appFeatureSlice.reducer
```

Add to app store configuration `apps/[app]/src/store/index.ts`:
```typescript
import { appFeatureSlice } from './slices/appFeatureSlice'

const appReducers = {
  appFeature: appFeatureSlice.reducer,
}

export const store = createBaseStore(appReducers)
```

---

## 🌐 How to Add API Endpoints

### 1. Shared API Endpoints

Add to existing API slice or create new one in `packages/shared/src/store/api/`:

```typescript
// packages/shared/src/store/api/commonApi.ts
import { baseApi } from './baseApi'

export const commonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<Settings, void>({
      query: () => 'settings',
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation<Settings, Partial<Settings>>({
      query: (settings) => ({
        url: 'settings',
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
})

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = commonApi
```

### 2. App-Specific API Endpoints

Create in `apps/[app]/src/store/api/[feature]Api.ts`:

```typescript
import { baseApi } from '@shared/store'

export interface MyData {
  id: string
  name: string
  value: number
}

export const myFeatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyData: builder.query<MyData[], { page?: number }>({
      query: (params) => ({
        url: 'my-feature/data',
        params,
      }),
      providesTags: ['MyData'],
    }),

    createMyData: builder.mutation<MyData, Omit<MyData, 'id'>>({
      query: (newData) => ({
        url: 'my-feature/data',
        method: 'POST',
        body: newData,
      }),
      invalidatesTags: ['MyData'],
    }),

    updateMyData: builder.mutation<MyData, { id: string; data: Partial<MyData> }>({
      query: ({ id, data }) => ({
        url: `my-feature/data/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'MyData', id },
        'MyData',
      ],
    }),

    deleteMyData: builder.mutation<void, string>({
      query: (id) => ({
        url: `my-feature/data/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyData'],
    }),
  }),
})

export const {
  useGetMyDataQuery,
  useCreateMyDataMutation,
  useUpdateMyDataMutation,
  useDeleteMyDataMutation,
} = myFeatureApi
```

---

## 💡 Using in Components

### 1. Using Shared State and APIs

```typescript
import React from 'react'
import {
  useAuth,
  useTheme,
  uiActions,
  useAppDispatch,
  useLoginMutation,
  useLogoutMutation
} from '@shared/store'

export const MyComponent = () => {
  const dispatch = useAppDispatch()
  const auth = useAuth()
  const theme = useTheme()

  // RTK Query hooks
  const [login, { isLoading: isLoggingIn }] = useLoginMutation()
  const [logout] = useLogoutMutation()

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' }).unwrap()
      dispatch(uiActions.addNotification({
        notification: {
          type: 'success',
          title: 'Success',
          message: 'Logged in successfully',
          dismissible: true,
        }
      }))
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const toggleTheme = () => {
    dispatch(uiActions.toggleTheme())
  }

  return (
    <div style={{
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    }}>
      {auth.user ? (
        <div>
          <p>Welcome, {auth.user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin} disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      )}
      <button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </button>
    </div>
  )
}
```

### 2. Using App-Specific APIs

```typescript
import React from 'react'
import {
  useGetMyDataQuery,
  useCreateMyDataMutation,
  useDeleteMyDataMutation
} from '../store/api/myFeatureApi'

export const MyFeatureComponent = () => {
  // RTK Query automatically handles loading, error, and data states
  const {
    data: myData = [],
    isLoading,
    error,
    refetch
  } = useGetMyDataQuery({ page: 1 })

  const [createData, { isLoading: isCreating }] = useCreateMyDataMutation()
  const [deleteData] = useDeleteMyDataMutation()

  const handleCreate = async () => {
    try {
      await createData({
        name: 'New Item',
        value: 100,
      }).unwrap()
      // No need to manually refetch - RTK Query handles cache invalidation
    } catch (error) {
      console.error('Failed to create:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteData(id).unwrap()
      // Cache automatically updated due to invalidatesTags
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (
    <div>
      <button onClick={handleCreate} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Add New Item'}
      </button>

      <button onClick={() => refetch()}>
        Refresh Data
      </button>

      <ul>
        {myData.map((item) => (
          <li key={item.id}>
            {item.name} - {item.value}
            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 🔧 Advanced Patterns

### 1. Conditional Queries
```typescript
const { data } = useGetUserProfileQuery(userId, {
  skip: !userId, // Only run query when userId exists
})
```

### 2. Polling
```typescript
const { data } = useGetLiveDataQuery(undefined, {
  pollingInterval: 5000, // Poll every 5 seconds
})
```

### 3. Optimistic Updates
```typescript
const [updateItem] = useUpdateItemMutation()

const handleUpdate = async (id: string, changes: Partial<Item>) => {
  try {
    await updateItem({ id, changes }).unwrap()
  } catch (error) {
    // RTK Query automatically rolls back optimistic update on error
    console.error('Update failed:', error)
  }
}
```

### 4. Manual Cache Management
```typescript
import { useAppDispatch } from '@shared/store'
import { myFeatureApi } from '../store/api/myFeatureApi'

const dispatch = useAppDispatch()

// Manually invalidate cache
dispatch(myFeatureApi.util.invalidateTags(['MyData']))

// Manually update cache
dispatch(myFeatureApi.util.updateQueryData(
  'getMyData',
  { page: 1 },
  (draft) => {
    draft.push(newItem)
  }
))
```

---

## 📋 Best Practices

### ✅ DO:
- Use RTK Query for all API calls
- Keep shared state minimal and focused
- Use TypeScript for all slice and API definitions
- Leverage cache invalidation instead of manual refetching
- Use optimistic updates for better UX
- Keep slice reducers pure and simple

### ❌ DON'T:
- Put app-specific logic in shared slices
- Bypass RTK Query for API calls
- Store derived data in state (use selectors instead)
- Manually manage loading states when using RTK Query
- Put non-serializable data in Redux state

### 🎯 Tips:
- Use `providesTags` and `invalidatesTags` for smart cache management
- Leverage RTK Query's automatic background refetching
- Use `skip` option to conditionally run queries
- Combine multiple related mutations in a single component
- Use `unwrap()` to get the actual data/error from mutations

---

## 🚦 Migration from Old Patterns

If migrating from old async thunks or manual API calls:

1. **Replace async thunks with RTK Query endpoints**
2. **Remove manual loading/error state management**
3. **Update components to use RTK Query hooks**
4. **Remove manual cache invalidation logic**

This new setup provides automatic caching, background updates, loading states, and error handling out of the box!
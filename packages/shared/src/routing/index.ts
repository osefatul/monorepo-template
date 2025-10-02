export * from './types'
export * from './hooks'
export * from './guards'

// Re-export commonly used React Router components for convenience
export {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
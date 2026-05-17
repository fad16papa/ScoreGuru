import { useAuth } from '@clerk/clerk-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthLoadingState } from './AuthLoadingState'

export function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return <AuthLoadingState />
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

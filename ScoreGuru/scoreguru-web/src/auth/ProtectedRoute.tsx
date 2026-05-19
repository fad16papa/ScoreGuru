import { useAuth } from '@clerk/clerk-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { UserSyncErrorState } from '../features/user/UserSyncErrorState'
import { useGetAuthMeQuery } from '../services/scoreGuruApi'
import { AuthLoadingState } from './AuthLoadingState'

export function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()
  const { data, isLoading, isFetching, isError, refetch } = useGetAuthMeQuery(undefined, {
    skip: !isSignedIn,
  })

  if (!isLoaded) {
    return <AuthLoadingState />
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }

  const isSyncing = !data && (isLoading || isFetching)
  if (isSyncing) {
    return <AuthLoadingState message="Syncing your ScoreGuru account…" />
  }

  if (isError) {
    return <UserSyncErrorState onRetry={() => void refetch()} />
  }

  return <Outlet />
}

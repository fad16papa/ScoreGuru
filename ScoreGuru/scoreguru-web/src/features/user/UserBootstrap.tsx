import { useAuth } from '@clerk/clerk-react'
import { useGetAuthMeQuery } from '../../services/scoreGuruApi'

/**
 * Triggers ScoreGuru user sync when Clerk session is active.
 * Does not render UI — public routes stay usable if sync fails.
 */
export function UserBootstrap() {
  const { isSignedIn } = useAuth()

  useGetAuthMeQuery(undefined, {
    skip: !isSignedIn,
  })

  return null
}

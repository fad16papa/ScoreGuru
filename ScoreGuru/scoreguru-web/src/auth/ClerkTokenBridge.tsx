import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { clerkJwtTemplate } from '../services/apiConfig'
import { registerClerkGetToken, unregisterClerkGetToken } from '../services/auth/clerkTokenBridge'

/**
 * Registers Clerk getToken for RTK Query (no hooks in prepareHeaders).
 * Must render inside ClerkProvider.
 */
export function ClerkTokenBridge() {
  const { getToken, isLoaded } = useAuth()

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    registerClerkGetToken(async () => {
      if (clerkJwtTemplate) {
        return getToken({ template: clerkJwtTemplate })
      }

      return getToken()
    })

    return () => {
      unregisterClerkGetToken()
    }
  }, [getToken, isLoaded])

  return null
}

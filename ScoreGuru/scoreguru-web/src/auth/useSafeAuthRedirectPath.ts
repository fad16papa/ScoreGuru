import { useLocation } from 'react-router-dom'

/**
 * Path to send the user after auth. Rejects auth routes and non-path strings.
 */
export function useSafeAuthRedirectPath(): string {
  const { state } = useLocation()
  const from =
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof (state as { from: unknown }).from === 'string'
      ? (state as { from: string }).from
      : '/'

  if (!from.startsWith('/') || from.startsWith('//')) {
    return '/'
  }
  if (from === '/sign-in' || from === '/sign-up') {
    return '/'
  }
  return from
}

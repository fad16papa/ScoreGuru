import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppRoutes } from './AppRoutes'
import { ClerkTokenBridge } from './auth/ClerkTokenBridge'
import { getClerkAppearance } from './auth/clerkAppearance'
import { ClerkPublishableKeyMissing } from './auth/ClerkPublishableKeyMissing'
import { UserBootstrap } from './features/user/UserBootstrap'

function ClerkAppTree({ publishableKey }: { publishableKey: string }) {
  return (
    <ClerkProvider publishableKey={publishableKey} appearance={getClerkAppearance()}>
      <ClerkTokenBridge />
      <BrowserRouter>
        <UserBootstrap />
        <AppRoutes />
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default function App() {
  const raw = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const publishableKey = typeof raw === 'string' ? raw.trim() : ''

  if (!publishableKey) {
    return <ClerkPublishableKeyMissing />
  }

  return <ClerkAppTree publishableKey={publishableKey} />
}

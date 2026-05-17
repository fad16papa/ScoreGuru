import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useSafeAuthRedirectPath } from '../auth/useSafeAuthRedirectPath'
import { AuthPageChrome } from '../components/layout/AuthPageChrome'
import { Card } from '../components/shared/Card'

export function SignInPage() {
  const fallbackRedirectUrl = useSafeAuthRedirectPath()

  return (
    <AuthPageChrome subTitle="Sign in">
      <Card className="w-full max-w-md overflow-hidden p-4 sm:p-6" padding="sm">
        <div className="mb-4 text-center">
          <h1 className="font-jakarta text-xl font-bold text-cr-text-dark dark:text-cr-text-light">
            Welcome back
          </h1>
          <p className="mt-1 font-inter text-sm text-cr-muted dark:text-cr-muted-dark">
            Sign in with Google, Apple, or email via Clerk.
          </p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl={fallbackRedirectUrl}
        />
        <p className="mt-4 text-center font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
          No password form —{' '}
          <Link className="font-semibold text-cr-purple hover:text-cr-purple-dark" to="/sign-up">
            create an account
          </Link>
        </p>
      </Card>
    </AuthPageChrome>
  )
}

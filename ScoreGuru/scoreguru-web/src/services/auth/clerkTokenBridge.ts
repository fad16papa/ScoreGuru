export type ClerkGetTokenFn = () => Promise<string | null>

let getTokenFn: ClerkGetTokenFn | null = null

export function registerClerkGetToken(fn: ClerkGetTokenFn): void {
  getTokenFn = fn
}

export function unregisterClerkGetToken(): void {
  getTokenFn = null
}

export async function resolveClerkAuthToken(): Promise<string | null> {
  if (!getTokenFn) {
    return null
  }

  return getTokenFn()
}

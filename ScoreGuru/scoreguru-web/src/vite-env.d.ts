/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string
  readonly VITE_SCOREGURU_API_BASE_URL?: string
  readonly VITE_CLERK_JWT_TEMPLATE?: string
  readonly VITE_SCOREGURU_ENABLE_LIVE_POLLING?: string
  readonly VITE_SCOREGURU_LIVE_POLLING_SECONDS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

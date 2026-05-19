const rawBaseUrl = import.meta.env.VITE_SCOREGURU_API_BASE_URL

export const scoreGuruApiBaseUrl =
  typeof rawBaseUrl === 'string' && rawBaseUrl.trim().length > 0
    ? rawBaseUrl.replace(/\/$/, '')
    : 'http://localhost:5000/api'

export const clerkJwtTemplate = import.meta.env.VITE_CLERK_JWT_TEMPLATE?.trim() ?? ''

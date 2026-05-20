import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { scoreGuruApiBaseUrl } from './apiConfig'
import { resolveClerkAuthToken } from './auth/clerkTokenBridge'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: scoreGuruApiBaseUrl,
  credentials: 'include',
  prepareHeaders: async (headers) => {
    const token = await resolveClerkAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    headers.set('Accept', 'application/json')
    return headers
  },
})

export const scoreGuruBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (import.meta.env.DEV && result.meta?.response) {
    const source = result.meta.response.headers.get('X-ScoreGuru-Data-Source')
    if (source) {
      console.debug('[ScoreGuru] data source:', source)
    }
  }

  return result
}

import { createApi } from '@reduxjs/toolkit/query/react'
import type { MeResponse } from './types/authTypes'
import type {
  UpdateThemeRequest,
  UpdateUserProfileRequest,
  UserProfileDto,
} from './types/profileTypes'
import { scoreGuruBaseQuery } from './scoreGuruBaseQuery'

export const scoreGuruApi = createApi({
  reducerPath: 'scoreGuruApi',
  baseQuery: scoreGuruBaseQuery,
  tagTypes: ['AuthMe', 'Profile'],
  endpoints: (build) => ({
    getAuthMe: build.query<MeResponse, void>({
      query: () => '/auth/me',
      providesTags: ['AuthMe', 'Profile'],
    }),
    getMyProfile: build.query<UserProfileDto, void>({
      query: () => '/users/me/profile',
      providesTags: ['Profile'],
    }),
    updateMyProfile: build.mutation<UserProfileDto, UpdateUserProfileRequest>({
      query: (body) => ({
        url: '/users/me/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile', 'AuthMe'],
    }),
    updateMyTheme: build.mutation<UserProfileDto, UpdateThemeRequest>({
      query: (body) => ({
        url: '/users/me/theme',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile', 'AuthMe'],
    }),
  }),
})

export const {
  useGetAuthMeQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateMyThemeMutation,
} = scoreGuruApi

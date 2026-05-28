import { createApi } from '@reduxjs/toolkit/query/react'
import type { MeResponse } from './types/authTypes'
import type {
  UpdateThemeRequest,
  UpdateUserProfileRequest,
  UserProfileDto,
} from './types/profileTypes'
import type {
  FootballLeaguesParams,
  FootballStandingsParams,
  FootballTeamsParams,
  GameDetailsDto,
  GameSummaryDto,
  LeagueDto,
  LeagueStandingsDto,
  SportDto,
  TeamDto,
  TodayFootballScoresParams,
} from './types/sportsTypes'
import { scoreGuruBaseQuery } from './scoreGuruBaseQuery'

export const scoreGuruApi = createApi({
  reducerPath: 'scoreGuruApi',
  baseQuery: scoreGuruBaseQuery,
  tagTypes: ['AuthMe', 'Profile', 'Sports', 'Football'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
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
    getSports: build.query<SportDto[], void>({
      query: () => '/sports',
      providesTags: ['Sports'],
    }),
    getFootballLeagues: build.query<LeagueDto[], FootballLeaguesParams | void>({
      query: (params) => ({
        url: '/football/leagues',
        params: params ?? {},
      }),
      providesTags: ['Football'],
    }),
    getLiveFootballScores: build.query<GameSummaryDto[], void>({
      query: () => '/football/scores/live',
      providesTags: ['Football'],
    }),
    getTodayFootballScores: build.query<GameSummaryDto[], TodayFootballScoresParams | void>({
      query: (params) => ({
        url: '/football/scores/today',
        params: params ?? {},
      }),
      providesTags: ['Football'],
    }),
    getFootballGameDetails: build.query<GameDetailsDto, number>({
      query: (gameId) => `/football/games/${gameId}`,
      providesTags: (_result, _error, gameId) => [{ type: 'Football', id: `game-${gameId}` }],
    }),
    getFootballStandings: build.query<LeagueStandingsDto, FootballStandingsParams>({
      query: ({ league, season }) => ({
        url: '/football/standings',
        params: { league, season },
      }),
      providesTags: (_result, _error, { league, season }) => [
        { type: 'Football', id: `standings-${league}-${season}` },
      ],
    }),
    getFootballTeams: build.query<TeamDto[], FootballTeamsParams | void>({
      query: (params) => ({
        url: '/football/teams',
        params: params ?? {},
      }),
      providesTags: ['Football'],
    }),
  }),
})

export const {
  useGetAuthMeQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateMyThemeMutation,
  useGetSportsQuery,
  useGetFootballLeaguesQuery,
  useGetLiveFootballScoresQuery,
  useGetTodayFootballScoresQuery,
  useGetFootballGameDetailsQuery,
  useGetFootballStandingsQuery,
  useGetFootballTeamsQuery,
} = scoreGuruApi

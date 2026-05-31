import { createApi } from '@reduxjs/toolkit/query/react'
import type { MeResponse } from './types/authTypes'
import type {
  UpdateThemeRequest,
  UpdateUserProfileRequest,
  UserProfileDto,
} from './types/profileTypes'
import type {
  CountryDto,
  FootballLeaguesParams,
  FootballPlayersParams,
  FootballPlayerByIdParams,
  FootballStandingsParams,
  FootballTeamRosterParams,
  FootballTeamsParams,
  GameDetailsDto,
  GameSummaryDto,
  LeagueDto,
  LeagueStandingsDto,
  PlayerDto,
  SportDto,
  TeamDto,
  TeamRosterDto,
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
    getFootballCountries: build.query<CountryDto[], void>({
      query: () => '/football/countries',
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
    getFootballTeamRoster: build.query<TeamRosterDto, FootballTeamRosterParams>({
      query: ({ teamId, season }) => ({
        url: `/football/teams/${teamId}/players`,
        params: season !== undefined ? { season } : {},
      }),
      providesTags: (_result, _error, { teamId, season }) => [
        { type: 'Football', id: `roster-${teamId}-${season ?? 'default'}` },
      ],
    }),
    getFootballPlayers: build.query<PlayerDto[], FootballPlayersParams | void>({
      query: (params) => ({
        url: '/football/players',
        params: params ?? {},
      }),
      providesTags: ['Football'],
    }),
    getFootballPlayerById: build.query<PlayerDto, FootballPlayerByIdParams>({
      query: ({ playerId, season, team, league }) => ({
        url: `/football/players/${playerId}`,
        params: {
          ...(season !== undefined ? { season } : {}),
          ...(team !== undefined ? { team } : {}),
          ...(league !== undefined ? { league } : {}),
        },
      }),
      providesTags: (_result, _error, { playerId, season, team, league }) => [
        { type: 'Football', id: `player-${playerId}-${season ?? '_'}_${team ?? '_'}_${league ?? '_'}` },
      ],
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
  useGetFootballCountriesQuery,
  useGetLiveFootballScoresQuery,
  useGetTodayFootballScoresQuery,
  useGetFootballGameDetailsQuery,
  useGetFootballStandingsQuery,
  useGetFootballTeamsQuery,
  useGetFootballTeamRosterQuery,
  useGetFootballPlayersQuery,
  useGetFootballPlayerByIdQuery,
} = scoreGuruApi

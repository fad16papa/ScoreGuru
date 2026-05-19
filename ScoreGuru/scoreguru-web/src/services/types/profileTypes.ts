export type UserProfileDto = {
  firstName: string | null
  lastName: string | null
  country: string | null
  preferredSports: string | null
  preferredLeagues: string | null
  themePreference: string | null
  timeZone: string | null
  language: string | null
}

export type UpdateUserProfileRequest = {
  firstName?: string | null
  lastName?: string | null
  country?: string | null
  preferredSports?: string | null
  preferredLeagues?: string | null
  timeZone?: string | null
  language?: string | null
}

export type UpdateThemeRequest = {
  themePreference: string
}

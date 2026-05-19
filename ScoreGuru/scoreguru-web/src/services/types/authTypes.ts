import type { UserProfileDto } from './profileTypes'

export type MeResponse = {
  id: string
  clerkUserId: string
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  isActive: boolean
  profile: UserProfileDto | null
}

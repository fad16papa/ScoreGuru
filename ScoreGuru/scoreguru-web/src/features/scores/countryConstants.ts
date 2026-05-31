import type { CountryDto } from '../../services/types/sportsTypes'

/** Local fallback when GET /football/countries is unavailable. */
export const FALLBACK_COUNTRIES: CountryDto[] = [
  { name: 'England', code: 'GB', flagUrl: null },
  { name: 'Spain', code: 'ES', flagUrl: null },
  { name: 'Germany', code: 'DE', flagUrl: null },
  { name: 'Italy', code: 'IT', flagUrl: null },
  { name: 'France', code: 'FR', flagUrl: null },
  { name: 'Portugal', code: 'PT', flagUrl: null },
  { name: 'Netherlands', code: 'NL', flagUrl: null },
  { name: 'Brazil', code: 'BR', flagUrl: null },
  { name: 'Argentina', code: 'AR', flagUrl: null },
  { name: 'USA', code: 'US', flagUrl: null },
  { name: 'World', code: null, flagUrl: null },
]

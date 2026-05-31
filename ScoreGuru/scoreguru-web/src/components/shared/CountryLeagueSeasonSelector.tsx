import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { FALLBACK_COUNTRIES } from '../../features/scores/countryConstants'
import { getPremierLeaguePreset } from '../../features/scores/leaguePresets'
import { getScoreQueryOptions } from '../../features/scores/queryOptions'
import {
  formatFootballSeasonLabel,
  getCurrentFootballSeasonYear,
  getFootballSeasonOptions,
} from '../../features/scores/seasonUtils'
import type { CountryDto, LeagueDto } from '../../services/types/sportsTypes'
import {
  useGetFootballCountriesQuery,
  useGetFootballLeaguesQuery,
} from '../../services/scoreGuruApi'
import { Button } from './Button'
import { Skeleton } from './Skeleton'

export type CountryLeagueSeasonSelectorProps = {
  country: string
  leagueId: string
  season: string
  onCountryChange: (value: string) => void
  onLeagueIdChange?: (value: string) => void
  onSeasonChange: (value: string) => void
  showLeagueSelect?: boolean
  showPreset?: boolean
}

const controlClassName =
  'min-h-10 w-full rounded-lg border border-cr-border-light bg-cr-surface-light px-3 font-inter text-sm text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light'

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="block min-h-4 font-inter text-xs font-semibold leading-4 text-cr-text-dark dark:text-cr-text-light">
      {children}
    </span>
  )
}

function injectPresetLeague(leagues: LeagueDto[], leagueId: string): LeagueDto[] {
  const preset = getPremierLeaguePreset()
  if (String(preset.leagueId) !== leagueId) {
    return leagues
  }
  if (leagues.some((l) => l.id === preset.leagueId)) {
    return leagues
  }
  return [
    {
      id: preset.leagueId,
      name: preset.leagueName,
      logoUrl: null,
      country: preset.country,
      season: Number.parseInt(preset.season, 10) || null,
      sportKey: 'football',
    },
    ...leagues,
  ]
}

export function CountryLeagueSeasonSelector({
  country,
  leagueId,
  season,
  onCountryChange,
  onLeagueIdChange,
  onSeasonChange,
  showLeagueSelect = true,
  showPreset = true,
}: CountryLeagueSeasonSelectorProps) {
  const [showAdvancedLeagueId, setShowAdvancedLeagueId] = useState(false)

  const seasonNum = Number.parseInt(season, 10)
  const validSeason = Number.isFinite(seasonNum)
  const preset = getPremierLeaguePreset()
  const seasonOptions = useMemo(() => getFootballSeasonOptions(4), [])

  const countriesQuery = useGetFootballCountriesQuery()
  const countries = useMemo(() => {
    const list = countriesQuery.data?.length ? [...countriesQuery.data] : [...FALLBACK_COUNTRIES]
    list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [countriesQuery.data])

  const leaguesQuery = useGetFootballLeaguesQuery(
    {
      season: validSeason ? seasonNum : getCurrentFootballSeasonYear(),
      country: country.trim() || undefined,
    },
    getScoreQueryOptions(!validSeason),
  )

  const leagues = useMemo(() => {
    const list = [...(leaguesQuery.data ?? [])]
    list.sort((a, b) => a.name.localeCompare(b.name))
    return showLeagueSelect ? injectPresetLeague(list, leagueId) : list
  }, [leaguesQuery.data, leagueId, showLeagueSelect])

  const selectedLeagueInList = leagues.some((l) => String(l.id) === leagueId)
  const leagueLookupFailed = showLeagueSelect && leaguesQuery.isError
  const leagueLookupLoading = showLeagueSelect && leaguesQuery.isLoading && !leaguesQuery.data

  useEffect(() => {
    if (!showLeagueSelect || leagueLookupLoading || leagueLookupFailed) {
      return
    }
    if (leagues.length === 0) {
      return
    }
    if (!selectedLeagueInList) {
      const preferred =
        leagues.find((l) => l.id === preset.leagueId) ??
        leagues.find((l) => l.name === preset.leagueName) ??
        leagues[0]
      if (preferred) {
        onLeagueIdChange?.(String(preferred.id))
      }
    }
  }, [
    showLeagueSelect,
    leagueLookupLoading,
    leagueLookupFailed,
    leagues,
    selectedLeagueInList,
    onLeagueIdChange,
    preset.leagueId,
    preset.leagueName,
  ])

  const gridClass = showLeagueSelect
    ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_10rem_auto]'
    : 'md:grid-cols-[minmax(0,1fr)_10rem_auto] md:max-w-2xl'

  return (
    <div className="space-y-3">
      <div className={`grid grid-cols-1 items-end gap-3 ${gridClass}`}>
        <label className="flex min-w-0 flex-col gap-1.5">
          <FieldLabel>Country</FieldLabel>
          {countriesQuery.isLoading && !countriesQuery.data ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <select
              value={country}
              onChange={(e) => onCountryChange(e.target.value)}
              className={controlClassName}
            >
              {!countries.some((c) => c.name === country) && country ? (
                <option value={country}>{country}</option>
              ) : null}
              {countries.map((c: CountryDto) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </label>

        {showLeagueSelect ? (
          leagueLookupLoading ? (
            <div className="flex flex-col gap-1.5">
              <FieldLabel>League</FieldLabel>
              <Skeleton className="h-10 w-full" />
            </div>
          ) : leagueLookupFailed ? (
            <div className="flex flex-col gap-1.5">
              <FieldLabel>League</FieldLabel>
              <div
                className={`${controlClassName} flex items-center text-cr-muted dark:text-cr-muted-dark`}
              >
                {String(leagueId) === String(preset.leagueId)
                  ? preset.leagueName
                  : 'League list unavailable'}
              </div>
            </div>
          ) : (
            <label className="flex min-w-0 flex-col gap-1.5">
              <FieldLabel>League</FieldLabel>
              <select
                value={selectedLeagueInList ? leagueId : ''}
                onChange={(e) => onLeagueIdChange?.(e.target.value)}
                className={controlClassName}
                disabled={!leagues.length}
              >
                {!leagues.length ? (
                  <option value="">No leagues available</option>
                ) : null}
                {leagues.map((league) => (
                  <option key={league.id} value={String(league.id)}>
                    {league.name}
                  </option>
                ))}
              </select>
            </label>
          )
        ) : null}

        <label className="flex flex-col gap-1.5">
          <FieldLabel>Season</FieldLabel>
          <select
            value={season}
            onChange={(e) => onSeasonChange(e.target.value)}
            className={controlClassName}
          >
            {seasonOptions.map((option) => (
              <option key={option.value} value={String(option.value)}>
                {option.label}
              </option>
            ))}
            {validSeason && !seasonOptions.some((o) => String(o.value) === season) ? (
              <option value={season}>{formatFootballSeasonLabel(seasonNum)}</option>
            ) : null}
          </select>
        </label>

        {showPreset ? (
          <div className="flex flex-col gap-1.5">
            <FieldLabel>&nbsp;</FieldLabel>
            <Button
              type="button"
              variant="secondary"
              className="min-h-10 whitespace-nowrap px-3 text-xs"
              onClick={() => {
                onCountryChange(preset.country)
                onLeagueIdChange?.(preset.league)
                onSeasonChange(preset.season)
              }}
            >
              Premier League preset
            </Button>
          </div>
        ) : null}
      </div>

      {countriesQuery.isError ? (
        <p className="font-inter text-[11px] text-cr-muted dark:text-cr-muted-dark">
          Country list unavailable — using built-in defaults.
        </p>
      ) : null}

      {showLeagueSelect && leagueLookupFailed ? (
        <div className="rounded-lg border border-cr-border-light bg-cr-bg-light/80 p-3 dark:border-cr-border-dark dark:bg-cr-surface-dark-2/40">
          <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
            League list unavailable. Try refreshing or use the Premier League preset.
          </p>
          <button
            type="button"
            className="mt-2 font-inter text-xs font-medium text-cr-purple dark:text-cr-text-light"
            onClick={() => setShowAdvancedLeagueId((v) => !v)}
          >
            {showAdvancedLeagueId ? 'Hide advanced league id' : 'Advanced: enter league id'}
          </button>
          {showAdvancedLeagueId ? (
            <label className="mt-2 flex flex-col gap-1.5">
              <span className="font-inter text-[11px] text-cr-muted dark:text-cr-muted-dark">
                Developer fallback — league ids are hidden from normal users.
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={leagueId}
                onChange={(e) => onLeagueIdChange?.(e.target.value)}
                className={controlClassName}
              />
            </label>
          ) : null}
        </div>
      ) : null}

      {showLeagueSelect &&
      !leagueLookupLoading &&
      !leagueLookupFailed &&
      leagues.length === 0 &&
      validSeason ? (
        <p className="font-inter text-xs text-cr-muted dark:text-cr-muted-dark">
          No leagues for {country || 'selected country'} in {formatFootballSeasonLabel(seasonNum)}.
          Try another season or country.
        </p>
      ) : null}
    </div>
  )
}

/** @deprecated Use CountryLeagueSeasonSelector */
export { CountryLeagueSeasonSelector as LeagueSeasonSelector }

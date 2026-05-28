import { Button } from './Button'
import { PREMIER_LEAGUE_PRESET } from '../../features/scores/leaguePresets'

type LeagueSeasonFiltersProps = {
  league: string
  season: string
  onLeagueChange: (value: string) => void
  onSeasonChange: (value: string) => void
  leagueHelper?: string
  seasonHelper?: string
  showPreset?: boolean
}

export function LeagueSeasonFilters({
  league,
  season,
  onLeagueChange,
  onSeasonChange,
  leagueHelper = 'API-FOOTBALL league id (e.g. 39 = Premier League).',
  seasonHelper = 'Season year (e.g. 2024).',
  showPreset = true,
}: LeagueSeasonFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <FilterField
          label="League ID"
          value={league}
          onChange={onLeagueChange}
          helper={leagueHelper}
          width="w-36"
        />
        <FilterField
          label="Season"
          value={season}
          onChange={onSeasonChange}
          helper={seasonHelper}
          width="w-28"
        />
        {showPreset ? (
          <Button
            type="button"
            variant="secondary"
            className="min-h-10 text-xs"
            onClick={() => {
              onLeagueChange(PREMIER_LEAGUE_PRESET.league)
              onSeasonChange(PREMIER_LEAGUE_PRESET.season)
            }}
          >
            Premier League preset
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function FilterField({
  label,
  value,
  onChange,
  helper,
  width,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  helper: string
  width: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-inter text-xs font-semibold text-cr-text-dark dark:text-cr-text-light">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'min-h-10 rounded-lg border border-cr-border-light bg-cr-surface-light px-3 font-inter text-sm text-cr-text-dark dark:border-cr-border-dark dark:bg-cr-surface-dark dark:text-cr-text-light',
          width,
        ].join(' ')}
      />
      <span className="max-w-xs font-inter text-[11px] leading-snug text-cr-muted dark:text-cr-muted-dark">
        {helper}
      </span>
    </label>
  )
}

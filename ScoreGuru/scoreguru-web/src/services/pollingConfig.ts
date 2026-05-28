const MIN_POLLING_SECONDS = 60
const DEFAULT_POLLING_SECONDS = 60

function parseBoolean(raw: string | undefined, defaultValue: boolean): boolean {
  if (raw === undefined || raw.trim() === '') {
    return defaultValue
  }

  const normalized = raw.trim().toLowerCase()
  return normalized === 'true' || normalized === '1' || normalized === 'yes'
}

function parsePollingSeconds(raw: string | undefined): number {
  const parsed = Number.parseInt(raw?.trim() ?? '', 10)
  if (!Number.isFinite(parsed) || parsed < MIN_POLLING_SECONDS) {
    return DEFAULT_POLLING_SECONDS
  }

  return parsed
}

/** Live auto-polling is off by default to protect API-SPORTS quota. */
export const livePollingEnabled = parseBoolean(
  import.meta.env.VITE_SCOREGURU_ENABLE_LIVE_POLLING,
  false,
)

export const livePollingSeconds = parsePollingSeconds(
  import.meta.env.VITE_SCOREGURU_LIVE_POLLING_SECONDS,
)

export const livePollingIntervalMs = livePollingEnabled
  ? livePollingSeconds * 1000
  : undefined

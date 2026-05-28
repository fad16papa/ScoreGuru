import { livePollingIntervalMs } from '../../services/pollingConfig'

/** RTK Query options for live score endpoints — polling only when env-enabled. */
export function getLiveScoreQueryOptions(skip = false) {
  return {
    skip,
    pollingInterval: livePollingIntervalMs,
    skipPollingIfUnfocused: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  } as const
}

/** RTK Query options for game details — poll only when live and polling enabled. */
export function getGameDetailsQueryOptions(isLive: boolean) {
  return {
    pollingInterval: isLive ? livePollingIntervalMs : 0,
    skipPollingIfUnfocused: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  } as const
}

/** Standard options for non-live score reads (today, standings, etc.). */
export function getScoreQueryOptions(skip = false) {
  return {
    skip,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  } as const
}

export function formatLastUpdated(timestampMs: number | undefined): string | null {
  if (!timestampMs) {
    return null
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(timestampMs))
  } catch {
    return null
  }
}

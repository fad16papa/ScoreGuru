# ScoreGuru score pages (frontend)

Football score UI calls **only** the ScoreGuru .NET API via RTK Query. It never calls API-SPORTS directly.

## Pages

| Route | Data |
|-------|------|
| `/` | Live scores, schedule by date, standings preview |
| `/live` | Live + filtered today scores |
| `/leagues/:id` | League games, standings, teams |
| `/standings` | Full table |
| `/games/:id` | Game details |

## API quota protection (Phase 6B)

API-SPORTS free tier has a **limited daily quota**. The backend Redis cache reduces duplicate provider calls, but **does not remove quota risk** if the frontend polls aggressively.

### Live polling is **disabled by default**

Environment variables (`scoreguru-web/.env`):

```env
VITE_SCOREGURU_ENABLE_LIVE_POLLING=false
VITE_SCOREGURU_LIVE_POLLING_SECONDS=60
```

| Variable | Default | Behavior |
|----------|---------|----------|
| `VITE_SCOREGURU_ENABLE_LIVE_POLLING` | `false` | Must be `true` to auto-poll live endpoints |
| `VITE_SCOREGURU_LIVE_POLLING_SECONDS` | `60` | Interval in seconds; **minimum 60** (lower values are clamped) |

When polling is **off** (default):

- Home, Live Scores, and Game Details use **manual Refresh**
- `refetchOnFocus` still refetches when the user returns to the tab (single request, not a timer)
- Backend cache still serves repeated reads cheaply when TTL has not expired

When polling is **on**:

- Live scores poll at the configured interval (≥ 60s)
- Polling **pauses when the browser tab is unfocused** (`skipPollingIfUnfocused`)
- Live **game details** poll only while the match status is live

### Enable polling locally (optional)

```env
VITE_SCOREGURU_ENABLE_LIVE_POLLING=true
VITE_SCOREGURU_LIVE_POLLING_SECONDS=60
```

Restart Vite after changing `.env`.

### Recommended production behavior

- Keep **`VITE_SCOREGURU_ENABLE_LIVE_POLLING=false`**
- Rely on manual refresh + `refetchOnFocus` + backend Redis TTLs
- Consider a background worker (Phase 2) for centralized polling instead of many browser clients

### Free quota warning

Even with Redis, each **cache miss** hits API-SPORTS. Avoid:

- Sub-60s polling intervals
- Many open tabs all polling
- Refresh spam during development

Monitor usage in the [API-FOOTBALL dashboard](https://dashboard.api-football.com/).

## Manual refresh & last updated

`RefreshControl` shows:

- **Refresh** button
- **Last updated** time from RTK Query `fulfilledTimeStamp`
- Optional helper text (e.g. polling disabled)

## Date selection

`DateSelector` uses native `type="date"` (`yyyy-MM-dd`) for schedule/today score queries on Home, Live Scores (non-live segments), and League Details games tab.

## Standings filters

Standings and league tabs use numeric **League ID** and **Season** with a **Premier League preset** (39 / 2024) for mock and dev.

## Developer diagnostics

In development, successful API responses may log:

```text
[ScoreGuru] data source: mock | api-sports
```

This is **console-only** — not shown in the public UI.

## Related docs

- [api-sports-integration.md](../backend/api-sports-integration.md) — backend provider, cache keys, endpoints

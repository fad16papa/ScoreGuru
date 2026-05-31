# API-SPORTS integration (API-FOOTBALL)

ScoreGuru loads football data through the .NET backend only. React never calls API-SPORTS directly.

## Architecture

```
HTTP request
  → FootballController / SportsController (thin)
  → IFootballScoreProvider
       → ApiSportsFootballProvider (real) or MockFootballScoreProvider (dev)
            → ISportsDataCacheService (Redis)
            → IApiSportsFootballClient (typed HttpClient)
                 → API-FOOTBALL (external)
            → FootballDataNormalizer → ScoreGuru DTOs
```

Raw API-SPORTS JSON stays inside Infrastructure. API responses use normalized DTOs only.

## Required environment variables

| Variable | Maps to | Example |
|----------|---------|---------|
| `ApiSports__FootballBaseUrl` | API-FOOTBALL base URL | `https://v3.football.api-sports.io` |
| `ApiSports__ApiKey` | API-SPORTS key | from [API-SPORTS dashboard](https://www.api-football.com/) |
| `ApiSports__RequestTimeoutSeconds` | HTTP timeout | `15` |
| `ApiSports__UseMockDataWhenMissingKey` | Dev mock fallback | `true` (Development only) |
| `Redis__ConnectionString` | Redis cache | `localhost:6379,abortConnect=false` |

**Never commit a real API key.** Use user secrets locally:

```bash
cd backend/ScoreGuru.Api
dotnet user-secrets set "ApiSports:ApiKey" "YOUR_API_SPORTS_KEY"
```

## Configure API-SPORTS key

1. Create an account at API-SPORTS / API-FOOTBALL.
2. Copy your API key from the dashboard.
3. Set `ApiSports:ApiKey` via user secrets or environment variable.
4. Restart the API.

When the key is missing:

- **Development** + `UseMockDataWhenMissingKey: true` → mock sample data (see below).
- **Production / non-Development** → startup resolution fails with a clear configuration error.

## Start Docker tools

From `ScoreGuru/` (repo folder with `docker-compose.yml`):

```bash
docker compose up -d
```

Redis is required for sports caching. PostgreSQL is required for auth/user features but not for read-only sports endpoints.

Validate compose:

```bash
docker compose config
```

## Run the backend

```bash
cd backend/ScoreGuru.Api
dotnet run
```

Default: **http://localhost:5000**

## MVP endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/sports` | Supported sports (`football` only for MVP) |
| GET | `/api/football/countries` | Countries as `CountryDto[]` |
| GET | `/api/football/leagues` | Leagues (`country`, `season` optional) |
| GET | `/api/football/scores/live` | Live fixtures as `GameSummaryDto[]` |
| GET | `/api/football/scores/today` | Fixtures by date (`date` yyyy-MM-dd, `league`, `season` optional) |
| GET | `/api/football/games/{gameId}` | `GameDetailsDto` (summary, events, statistics) |
| GET | `/api/football/standings` | `LeagueStandingsDto` (`league`, `season` required) |
| GET | `/api/football/teams` | Teams (`league`, `season`, `country` optional) |
| GET | `/api/football/teams/{teamId}/players` | `TeamRosterDto` (`season` optional) |
| GET | `/api/football/players/{playerId}` | `PlayerDto` (`season`, `team`, `league` optional) |
| GET | `/api/football/players` | `PlayerDto[]` (`team`, `league`, `season`, `search` optional) |

Sports endpoints are **public** (no Clerk token required for MVP reads).

### Response header

When mock data is active:

`X-ScoreGuru-Data-Source: mock`

When using API-SPORTS:

`X-ScoreGuru-Data-Source: api-sports`

## Test live scores

With API running:

```bash
curl -i http://localhost:5000/api/football/scores/live
```

Mock mode (no key, Development):

```bash
curl -i http://localhost:5000/api/football/scores/live
# X-ScoreGuru-Data-Source: mock
```

With a real key:

```bash
dotnet user-secrets set "ApiSports:ApiKey" "YOUR_KEY"
dotnet run --project ScoreGuru.Api
curl http://localhost:5000/api/football/scores/live
```

## Test mock data (no API key)

1. Ensure `appsettings.Development.json` has `ApiSports:UseMockDataWhenMissingKey: true`.
2. Do **not** set `ApiSports:ApiKey`.
3. Run API in Development.
4. Sample endpoints:
   - Live: `/api/football/scores/live`
   - Game details: `/api/football/games/100001`
   - Standings: `/api/football/standings?league=39&season=2024`

Logs include: `API-SPORTS mock football provider is active`.

## Redis caching

`SportsDataCacheService` stores **normalized DTOs** in Redis as JSON.

| Cache key pattern | TTL |
|-------------------|-----|
| `api-sports:football:countries` | 24 hours |
| `api-sports:football:leagues:{country}:{season}` | 12 hours |
| `api-sports:football:scores:live` | 20 seconds |
| `api-sports:football:scores:today:{date}:{league}:{season}` | 60 seconds |
| `api-sports:football:games:{gameId}` | 30s live / 15m finished |
| `api-sports:football:standings:{league}:{season}` | 15 minutes |
| `api-sports:football:teams:{league}:{season}:{country}` | 12 hours |
| `api-sports:football:players:by-id:{playerId}:{season}:{teamId}:{leagueId}` | 12 hours |

Redis reduces provider calls but **does not eliminate quota risk** when many clients poll before TTL expires. See [score-pages.md](../frontend/score-pages.md): frontend live polling is **disabled by default** (`VITE_SCOREGURU_ENABLE_LIVE_POLLING=false`, minimum 60s interval when enabled).

## Provider components

| Type | Role |
|------|------|
| `IApiSportsFootballClient` | Low-level HTTP to API-FOOTBALL |
| `IFootballScoreProvider` | Normalized reads + cache orchestration |
| `ISportsDataCacheService` | Redis get/set |
| `ApiSportsFootballClient` | Typed HttpClient, `x-apisports-key` header |
| `ApiSportsFootballProvider` | Real provider |
| `MockFootballScoreProvider` | Development fixtures |
| `FootballDataNormalizer` | Maps provider models → ScoreGuru DTOs |

## Error handling

- Provider/rate-limit failures → `503` or `429` with `ProblemDetails` (no raw API-SPORTS body).
- API key is never logged.
- Diagnostics use structured logging with path and status code only.

## Intentionally Phase 2 (not implemented)

- Background worker polling (centralized refresh instead of browser polling)
- Multi-sport providers (basketball, tennis, etc.)
- Advanced Statistics Hub / analytics
- Favorites persistence for games/teams
- Push notifications / live alerts
- Lineups depth, player pages, search across sports
- Conference/division standing panels

## Tests

```bash
cd backend
dotnet test
```

Unit tests cover `FootballDataNormalizer` mapping logic.

## Build

```bash
cd backend
dotnet build
```

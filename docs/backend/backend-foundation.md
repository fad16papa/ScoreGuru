# ScoreGuru backend foundation

Layered ASP.NET Core API with Clerk JWT validation, PostgreSQL (EF Core + Identity), and Redis.

## Solution layout

```
backend/
  ScoreGuru.sln
  ScoreGuru.Api/           # HTTP, controllers, middleware
  ScoreGuru.Application/   # DTOs, interfaces, options
  ScoreGuru.Domain/        # ApplicationUser, UserProfile
  ScoreGuru.Infrastructure/ # EF Core, Redis, Clerk auth, services
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL, pgAdmin, Redis, RedisInsight)

## Run Docker development tools

From the `ScoreGuru/` folder (where `docker-compose.yml` lives):

```bash
docker compose up -d
```

| Service       | URL / port              | Credentials (dev only)                    |
|---------------|-------------------------|-------------------------------------------|
| PostgreSQL    | `localhost:5432`        | DB `scoreguru`, user `scoreguru`, password `scoreguru_dev_password` |
| pgAdmin       | http://localhost:5050   | `admin@scoreguru.local` / `scoreguru_pgadmin_dev` |
| Redis         | `localhost:6379`        | no password                               |
| RedisInsight  | http://localhost:5540   | connect to `redis:6379` inside Docker network, or `host.docker.internal:6379` from UI |

Validate compose file:

```bash
docker compose config
```

Stop tools:

```bash
docker compose down
```

## Configuration

Defaults live in `backend/ScoreGuru.Api/appsettings.Development.json`. Override with environment variables (double underscore):

| Variable | Maps to | Example |
|----------|---------|---------|
| `ConnectionStrings__Postgres` | PostgreSQL | `Host=localhost;Port=5432;Database=scoreguru;Username=scoreguru;Password=scoreguru_dev_password` |
| `Redis__ConnectionString` | Redis | `localhost:6379` |
| `Clerk__Authority` | Clerk issuer / OIDC authority | `https://warm-redfish-28.clerk.accounts.dev` |
| `Clerk__JwksUrl` | Optional metadata override | leave empty to use Authority discovery |
| `Clerk__Audience` | JWT audience (if required) | from Clerk Dashboard |
| `Cors__AllowedOrigins__0` | CORS origin | `http://localhost:5173` |

**Do not commit real Clerk secrets.** Use User Secrets locally:

```bash
cd backend/ScoreGuru.Api
dotnet user-secrets init
dotnet user-secrets set "Clerk:Authority" "https://YOUR_INSTANCE.clerk.accounts.dev"
dotnet user-secrets set "Clerk:Audience" "YOUR_AUDIENCE_IF_REQUIRED"
```

Find **Authority** in Clerk Dashboard → **API keys** / instance URL (Frontend API domain, e.g. `https://<instance>.clerk.accounts.dev`).

## EF Core migrations

Create/update database from `backend/`:

```bash
dotnet ef database update \
  --project ScoreGuru.Infrastructure \
  --startup-project ScoreGuru.Api
```

Add a new migration later:

```bash
dotnet ef migrations add YourMigrationName \
  --project ScoreGuru.Infrastructure \
  --startup-project ScoreGuru.Api \
  --output-dir Persistence/Migrations
```

Initial migration name: **InitialIdentityUserProfile**.

## Run the API

```bash
cd backend/ScoreGuru.Api
dotnet run
```

Default URL: **http://localhost:5000** (see `Properties/launchSettings.json`).

Align frontend `.env`:

```env
VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api
```

## Test health endpoint

```bash
curl http://localhost:5000/api/health
```

Expected when Postgres and Redis are up:

```json
{
  "status": "Healthy",
  "checks": {
    "api": "Healthy",
    "database": "Healthy",
    "redis": "Healthy"
  },
  "timestampUtc": "..."
}
```

## Test `/api/auth/me` with a Clerk token

1. Sign in on the React app (`http://localhost:5173/sign-in`).
2. In the browser devtools, obtain a session JWT from Clerk (session token for your API template if configured), or use Clerk Dashboard / backend testing tools.
3. Call the API:

```bash
curl -H "Authorization: Bearer YOUR_CLERK_JWT" http://localhost:5000/api/auth/me
```

On first call, the API **creates** `ApplicationUser` + `UserProfile` in PostgreSQL and returns the `MeResponseDto` JSON shape.

Protected routes:

- `GET /api/auth/me`
- `GET /api/users/me/profile`
- `PUT /api/users/me/profile`
- `PUT /api/users/me/theme`

## Auth architecture notes

- **Clerk** issues JWTs; the API validates them (no password login, no register/login endpoints).
- **PostgreSQL** is the source of truth for ScoreGuru user data.
- **Identity** stores users/roles schema; primary login tokens are **not** issued by .NET Identity.
- **Redis** is registered (`IConnectionMultiplexer`) for future caching; not used for business logic yet.

## Build

```bash
cd backend
dotnet build
```

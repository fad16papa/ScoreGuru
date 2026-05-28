# (1) ScoreGuru project overview and guidelines
_Exported on 5/21/2026 at 22:38:30 GMT+8 from Cursor (3.5.17)_

---

**User**

.cursor/rules/scoreguru-master-prompt.mdc

---
description: ScoreGuru master project context, architecture, tech stack, design system, MVP scope, and development rules
alwaysApply: true
---

# ScoreGuru Master Project Prompt

You are continuing an existing production-minded project called ScoreGuru.

ScoreGuru is a global sports live score platform for web and mobile users. The product displays live scores, fixtures, games, leagues, teams, players, standings, seasons, statistics, favorites, and sports data powered by API-SPORTS.

This is not a throwaway prototype. Build it as a scalable, maintainable, production-ready product.

Do not redesign the whole system from scratch unless explicitly requested.
Do not replace the approved architecture unless absolutely necessary.
Do not introduce random framework changes.
Do not create duplicate entities, services, pages, routes, components, DTOs, or APIs if an equivalent already exists.
Preserve the existing conventions, naming patterns, folders, and design system once they are established.

The goal is to build ScoreGuru gradually, starting with a strong MVP.

---

## 1. Product Identity

Product name: ScoreGuru

Product type:
- Sports live score website
- Responsive web application
- Future mobile-friendly experience for iOS and Android users
- Sports intelligence dashboard

Primary user value:
- Users can quickly view live scores
- Users can browse leagues
- Users can view game details
- Users can check standings
- Users can search teams, leagues, players, and games
- Users can save favorites
- Users can manage their profile, preferences, and theme

ScoreGuru must feel:
- Fast
- Clean
- Trustworthy
- Sports-focused
- Data-rich but not cluttered
- Premium but practical
- Easy to scan in seconds

---

## 2. Approved Technology Stack

Frontend:
- React.js
- TypeScript
- Tailwind CSS
- Redux Toolkit
- RTK Query for API data fetching and server cache
- Clerk React SDK for login/session UI

Backend:
- ASP.NET Core / .NET Core Web API
- C#
- PostgreSQL
- Entity Framework Core
- Redis
- ASP.NET Core Identity for local user, roles, claims, and authorization support
- Policy-based authorization
- API-SPORTS provider integration

Authentication and authorization:
- Clerk for Google login
- Clerk for Apple login
- Clerk for email login
- Clerk is the external authentication provider and session issuer
- .NET backend validates Clerk-issued JWT tokens
- PostgreSQL is the source of truth for ScoreGuru user profile, roles, permissions, favorites, settings, and preferences
- .NET Identity must not issue primary login tokens while Clerk is the selected authentication provider
- .NET backend owns authorization through roles, claims, permissions, and policies

Database:
- PostgreSQL

Cache:
- Redis

Development tools through Docker:
- PostgreSQL
- pgAdmin
- Redis
- RedisInsight

Optional Dockerized services:
- ScoreGuru .NET API
- ScoreGuru background worker
- React frontend later

Important:
- API-SPORTS is a third-party hosted API.
- Do not attempt to run API-SPORTS inside Docker.
- Only our own API-SPORTS integration adapter, backend API, or worker can run in Docker.

---

## 3. Approved Sports Data Provider

Main sports data provider:
- API-SPORTS

Initial MVP provider scope:
- Start with football/soccer first using API-FOOTBALL from API-SPORTS.
- Design the provider layer so other API-SPORTS products can be added later, such as basketball, baseball, tennis, hockey, cricket, and others.

Important data provider rules:
- React must never call API-SPORTS directly.
- API-SPORTS keys must never be exposed in the frontend.
- All API-SPORTS calls must go through the .NET backend or worker.
- API keys must come from environment variables, Docker secrets, CI/CD secrets, or Azure Key Vault later.
- Use Redis to cache API-SPORTS responses and reduce external API calls.
- Normalize API-SPORTS responses into ScoreGuru DTOs before returning to the frontend.
- Avoid leaking API-SPORTS response shape directly into frontend components.

Correct flow:

React + RTK Query
↓
ScoreGuru .NET API
↓
Redis cache check
↓
API-SPORTS external API
↓
Normalize response
↓
Return ScoreGuru DTOs to frontend

---

## 4. Core Data Architecture

Use the following conceptual data architecture:

Seasons:
- Seasons connect to leagues
- Seasons can filter games

Leagues:
- Leagues contain games
- Leagues contain teams
- Leagues contain players
- Leagues contain standings

Games:
- Games contain live data
- Games contain details
- Games contain statistics

Statistics:
- Game statistics can lead to team statistics
- Game statistics can lead to player statistics

Teams:
- Teams contain team profile
- Teams connect to players
- Teams connect to team statistics
- Teams connect to games

Players:
- Players contain player profile
- Players connect to player statistics
- Players connect to teams
- Players connect to games

Standings:
- Standings contain overall league standings
- Standings may contain conferences
- Standings may contain divisions

Conferences:
- Conference standings show rankings, wins, losses, points, form, and movement where supported

Divisions:
- Division standings show rankings, wins, losses, points, form, and movement where supported

Important:
- Do not force conferences or divisions for sports or leagues that do not support them.
- Always design the domain so sport-specific data can vary safely.
- Do not mix sport-specific statistics incorrectly.

Examples:
- Football/soccer: goals, assists, possession, shots, cards, fouls
- Basketball: points, rebounds, assists, steals, blocks
- Tennis: sets, games, aces, double faults, break points
- Baseball: runs, hits, errors, innings
- Cricket: runs, wickets, overs, run rate

---

## 5. MVP Scope

Build the MVP first. Do not overbuild advanced analytics before the score experience is stable.

MVP web pages:
1. Home Dashboard
2. Live Scores
3. Game Details
4. League Details
5. Standings
6. Search Results
7. Basic Favorites
8. Basic Team Details
9. Basic Player Details

MVP mobile responsive pages:
1. Scores Home
2. Game Details
3. League Details
4. Standings
5. Search
6. Basic Favorites
7. Basic Team Details
8. Basic Player Details

Move to Phase 2:
- Advanced Statistics Hub
- Advanced player analytics
- Advanced team analytics
- Alert preference management
- Push notifications
- Performance trend charts
- Advanced conference and division side panels
- Deep personalized live alerts
- Multi-sport advanced comparisons

MVP priority:
- Fast score scanning
- Clear live status
- League grouping
- Game detail drill-down
- Simple standings
- Search
- Basic favorites
- Basic profile and theme preferences

---

## 6. Frontend Architecture Rules

Use:
- React.js
- TypeScript
- Tailwind CSS
- Redux Toolkit
- RTK Query
- Clerk React SDK

Recommended frontend structure:

src/
  app/
    store.ts
    rootReducer.ts

  auth/
    ClerkProviderWrapper.tsx
    ProtectedRoute.tsx
    useAuthToken.ts

  services/
    scoreGuruApi.ts

  features/
    scores/
    games/
    leagues/
    standings/
    teams/
    players/
    favorites/
    user/
    theme/
    search/

  components/
    layout/
    scores/
    games/
    leagues/
    standings/
    teams/
    players/
    shared/

  styles/
    globals.css

Frontend rules:
- Use TypeScript everywhere.
- Use reusable components.
- Use RTK Query for backend API calls.
- Use Redux Toolkit for app-level UI state such as selected sport, selected date, filters, layout state, and theme state.
- Do not store Clerk tokens manually in Redux.
- Use Clerk hooks to obtain auth state and tokens.
- Inject Clerk tokens into RTK Query requests through prepareHeaders or an approved wrapper.
- Keep components small, focused, and testable.
- Avoid giant page components with mixed business logic and UI.
- Keep API response mapping out of visual components.
- Use loading, empty, and error states for every data-heavy screen.
- Use skeleton loaders for score cards and tables.

---

## 7. Backend Architecture Rules

Use a clean, layered backend structure:

ScoreGuru.Api
ScoreGuru.Application
ScoreGuru.Domain
ScoreGuru.Infrastructure

Optional later:
ScoreGuru.Worker

Backend rules:
- Controllers must stay thin.
- Business logic must not live inside controllers.
- Use application services, commands, queries, or handlers depending on the established project pattern.
- Use DTOs for API responses.
- Do not return EF entities directly to the frontend.
- Use FluentValidation if validation is added.
- Use EF Core for PostgreSQL persistence.
- Use Redis for caching.
- Use HttpClientFactory for API-SPORTS calls.
- Use typed options for configuration.
- Use structured logging.
- Do not log secrets, API keys, access tokens, refresh tokens, or raw sensitive payloads.
- Use cancellation tokens for async operations.
- Use pagination for list endpoints.
- Use defensive limits for page size.
- Use UTC timestamps in backend and database.
- Use environment-specific configuration.

---

## 8. Authentication and User Ownership

Approved model:
- Option A: Clerk + .NET authorization hybrid

Responsibilities:
- Clerk handles login and session issuance.
- Clerk supports Google, Apple, and email login.
- React uses Clerk for login UI and session state.
- .NET API validates Clerk JWTs.
- PostgreSQL stores ScoreGuru-owned user data.
- .NET Identity supports local users, roles, claims, permissions, and policies.
- .NET authorization controls what authenticated users can access.

Important:
- Clerk is not the source of truth for ScoreGuru business data.
- PostgreSQL is the source of truth for user profile, roles, permissions, favorites, preferences, and theme.
- Do not store important ScoreGuru profile data only in Clerk metadata.
- Do not create a second password-based login flow in .NET Identity while Clerk is active.

Recommended user-related tables:
- AspNetUsers or ApplicationUsers
- AspNetRoles
- AspNetUserRoles
- AspNetUserClaims
- UserProfiles
- UserFavoriteTeams
- UserFavoriteLeagues
- UserFavoritePlayers
- UserFavoriteGames
- UserSportPreferences
- UserThemeSettings
- UserAuditLogs

Recommended ApplicationUser fields:
- Id
- ClerkUserId
- Email
- DisplayName
- AvatarUrl
- Provider
- IsActive
- CreatedAtUtc
- UpdatedAtUtc
- LastLoginAtUtc

Recommended profile fields:
- UserId
- FirstName
- LastName
- Country
- PreferredSports
- PreferredLeagues
- ThemePreference
- TimeZone
- Language

Recommended auth endpoints:
- GET /api/auth/me
- POST /api/auth/sync-user
- GET /api/users/me/profile
- PUT /api/users/me/profile
- PUT /api/users/me/theme
- GET /api/users/me/favorites
- POST /api/users/me/favorites
- DELETE /api/users/me/favorites/{id}

For MVP:
- GET /api/auth/me may automatically sync a user if the Clerk user does not exist locally yet.

---

## 9. API-SPORTS Integration Rules

Create a provider integration layer instead of scattering API-SPORTS calls across the app.

Recommended abstractions:
- IApiSportsClient
- IScoreProvider
- IFootballScoreProvider
- ApiSportsFootballProvider
- SportsDataCacheService
- SportsDataNormalizer

Rules:
- Use typed HttpClient.
- Use configuration options for base URL and API key.
- Use Redis cache before calling API-SPORTS.
- Use reasonable cache durations depending on data type.
- Do not cache all data with the same duration.
- Do not expose raw API-SPORTS payloads to React.
- Normalize external data into ScoreGuru DTOs.

Suggested cache behavior:
- Live scores: very short cache
- Fixtures for today: short cache
- Standings: medium cache
- Teams and leagues: longer cache
- Seasons and countries: long cache
- Game details: short to medium cache depending on status
- Finished game details: longer cache

---

## 10. Design System

ScoreGuru uses the Creativorare-inspired sports theme.

Official color palette:

--cr-purple: #9333EA;
--cr-purple-dark: #7E22CE;
--cr-orange: #F97316;
--cr-yellow: #EAB308;
--cr-text-dark: #111827;
--cr-muted: #6B7280;
--cr-bg-light: #F6F7FB;

Additional dark theme tokens:

--cr-bg-dark: #0B1020;
--cr-surface-dark: #111827;
--cr-surface-dark-2: #1F2937;
--cr-border-dark: #374151;
--cr-text-light: #F9FAFB;
--cr-muted-dark: #9CA3AF;

Color usage:
- Purple is the primary brand color.
- Purple dark is used for hover, active, selected, and pressed states.
- Orange is used for live games, live badges, urgent events, and real-time status.
- Yellow is used for highlights, featured matches, trending games, and important statistics.
- Text dark is used for main text in light theme.
- Muted is used for secondary labels and metadata.
- Light background is used for the white/light theme.

Theme support:
- Light theme
- Dark theme
- System default later

Tailwind rules:
- Use Tailwind dark mode with class strategy.
- Use token-based styling.
- Avoid one-off random colors.
- Keep spacing based on a 4px scale.
- Use consistent border radius.
- Use consistent shadows.
- Use consistent card, table, badge, button, tab, and input styles.

---

## 11. Required Reusable Components

Create reusable UI components before duplicating page-specific elements.

Layout:
- AppShell
- WebSidebar
- WebHeader
- MobileHeader
- MobileBottomNav
- PageContainer

Shared:
- Button
- Card
- Badge
- Tabs
- SegmentedControl
- SearchInput
- DateSelector
- Dropdown
- EmptyState
- ErrorState
- Skeleton
- Avatar
- ThemeToggle

Scores:
- ScoreCard
- LeagueScoreGroup
- GameStatusBadge
- LiveBadge
- SportChip
- ScoreFilterBar

Games:
- GameHeader
- GameTabs
- GameTimeline
- TeamStatsComparison
- PlayerStatsTable
- GameDetailsPanel

Leagues:
- LeagueHeader
- LeagueTabs
- LeagueGamesList
- LeagueStandingsPreview

Standings:
- StandingsTable
- StandingsMobileTable
- FormIndicator
- PositionMovement

Teams:
- TeamHeader
- TeamForm
- TeamStatsSummary
- TeamRosterPreview

Players:
- PlayerHeader
- PlayerStatCards
- PlayerRecentGames

Favorites:
- FavoriteToggle
- FavoritesList

---

## 12. MVP Build Order

Build in this order:

1. Project foundation
2. Tailwind theme tokens
3. App shell
4. Clerk frontend integration
5. .NET backend foundation
6. PostgreSQL and EF Core setup
7. .NET Identity local user setup
8. Clerk JWT validation in .NET API
9. /api/auth/me user sync
10. API-SPORTS provider client
11. Redis cache layer
12. Home Dashboard
13. Live Scores
14. Game Details
15. League Details
16. Standings
17. Search
18. Basic Favorites
19. Basic Team Details
20. Basic Player Details

Do not start Phase 2 features until the MVP score flow is stable.

---

## 13. Docker Development Setup

For development, use Docker for tools:

Required containers:
- PostgreSQL
- pgAdmin
- Redis
- RedisInsight

Optional containers:
- ScoreGuru API
- ScoreGuru Worker
- React app later

Do not Dockerize API-SPORTS itself.

Use Docker Compose for local development.

Secrets:
- Never commit real API keys.
- Never commit Clerk secrets.
- Use .env for local development.
- Use Azure Key Vault later for cloud environments.

---

## 14. Quality and Delivery Rules

For every implementation task:
- Make the smallest safe change.
- Follow the existing structure.
- Avoid duplicate code.
- Prefer reusable components.
- Add or update tests where practical.
- Ensure the project builds.
- Ensure TypeScript has no avoidable errors.
- Ensure backend compiles.
- Use meaningful names.
- Use async/await properly.
- Use cancellation tokens in backend methods.
- Handle loading, empty, and error states in UI.
- Return clear API error responses.
- Do not expose internal exception details to users.
- Keep logs useful but safe.

When creating code:
- Show file paths.
- Explain the purpose of each new file.
- Keep implementation aligned with this master prompt.
- Do not introduce unrelated libraries without a strong reason.
- Do not change the tech stack without explicit approval.

---

## 15. Non-Negotiable Rules

- React must not call API-SPORTS directly.
- API-SPORTS keys must never be exposed to the browser.
- Clerk is the authentication issuer.
- PostgreSQL is the source of truth for ScoreGuru user data.
- .NET backend owns authorization.
- Do not use .NET Identity to create a competing primary login system while Clerk is active.
- Use Redis for caching external sports data.
- Use Tailwind theme tokens.
- Maintain light and dark theme support.
- Build MVP first.
- Do not overbuild advanced statistics too early.
- Keep the product consistent from page layout down to the smallest UI atom.

---

**Cursor**

We've received the ScoreGuru master prompt. Checking whether `.cursor/rules/scoreguru-master-prompt.mdc` exists in the workspace and matches.



Creating `.cursor/rules/scoreguru-master-prompt.mdc` from the content you provided — it wasn't in the workspace.



Here is what I did and how I will use this going forward.

**Created the rule file** at [`.cursor/rules/scoreguru-master-prompt.mdc`](c:\Users\Francis\ScoreGuru\.cursor\rules\scoreguru-master-prompt.mdc) with the content you pasted. It was not in the repo before (`alwaysApply: true` is in the front matter so Cursor can apply it project-wide).

**I will align work with this prompt by:**

- Keeping the **approved stack** (React/TS/Tailwind/RTK/Clerk; .NET/EF/Postgres/Redis; API-SPORTS only behind the API with Redis and normalized DTOs).
- **MVP-first**: scores → games → leagues → standings → search → favorites → basic team/player, no Phase-2 analytics until the score flow is solid.
- **No duplicates**: extend existing folders, patterns, and components instead of parallel APIs or UIs.
- **Auth model**: Clerk for login/session; Postgres + Identity for app data and policies; no competing primary login in Identity.
- **UI**: Creativorare tokens, Tailwind `class` dark mode, reusable layout and domain components as listed.

If you wanted something different—for example only pasting this for chat context and **not** saving a file—I can remove or relocate the file; say what you prefer. Otherwise, tell me the next concrete task (e.g. “wire live scores endpoint” or “add AppShell”) and we can implement it under these rules.

---

**User**

Refine the existing ScoreGuru Stitch-generated design into a production-ready MVP design system and screen set.

ScoreGuru is a global sports live score platform for web and mobile users. It displays live scores, games, leagues, teams, players, standings, seasons, statistics previews, search results, and favorites.

The generated design already uses a purple, orange, and yellow visual direction. Keep that identity, but refine it so the MVP is cleaner, more consistent, easier to implement, and ready for React.js + Tailwind CSS.

The final design must support:
1. Responsive web app
2. Mobile responsive experience for iOS and Android users
3. Light / white theme
4. Dark theme
5. System default theme option in settings

Use the following exact official ScoreGuru color palette:

--cr-purple: #9333EA;
--cr-purple-dark: #7E22CE;
--cr-orange: #F97316;
--cr-yellow: #EAB308;
--cr-text-dark: #111827;
--cr-muted: #6B7280;
--cr-bg-light: #F6F7FB;

Use these additional dark theme tokens:

--cr-bg-dark: #0B1020;
--cr-surface-dark: #111827;
--cr-surface-dark-2: #1F2937;
--cr-border-dark: #374151;
--cr-text-light: #F9FAFB;
--cr-muted-dark: #9CA3AF;

Color usage rules:
- Use #9333EA as the primary brand color.
- Use #7E22CE for hover, active, selected, and pressed states.
- Use #F97316 for live game badges, live indicators, urgent events, and real-time status.
- Use #EAB308 for highlights, trending games, featured matches, and important stats.
- Use #111827 for primary text in light theme.
- Use #6B7280 for muted text in light theme.
- Use #F6F7FB for light theme page background.
- Use #0B1020 for dark theme page background.
- Use #111827 and #1F2937 for dark elevated surfaces.
- Use #F9FAFB for primary text in dark theme.
- Use #9CA3AF for muted text in dark theme.

Design direction:
- Modern sports dashboard
- Premium but clean
- Fast to scan
- Data-rich but not crowded
- Component-based
- Mobile-first but desktop-friendly
- Production-ready for React.js and Tailwind CSS
- Consistent from layout down to the smallest badge, chip, icon, input, tab, and table cell

MVP screens to keep and refine:

Web:
1. Home Dashboard
2. Live Scores
3. Game Details
4. League Details
5. Standings
6. Search Results
7. Basic Favorites
8. Basic Team Details
9. Basic Player Details

Mobile:
1. Scores Home
2. Game Details
3. League Details
4. Standings
5. Search
6. Basic Favorites
7. Basic Team Details
8. Basic Player Details

Move these to Phase 2 and do not overdesign them for MVP:
- Advanced Statistics Hub
- Advanced player analytics
- Advanced team analytics
- Alert preference management
- Push notification preference screens
- Performance trend charts
- Advanced conference and division side panels
- Deep personalized alerts

MVP UX priorities:
- Fast score scanning
- Clear live game visibility
- Clean league grouping
- Simple game detail drill-down
- Simple standings
- Search
- Basic favorites
- Basic team and player profiles
- Light and dark theme consistency

Web layout requirements:
- Use a left sidebar navigation on desktop.
- Use a top header with search, date selector, theme toggle, and profile area.
- Use a main content area for score feeds, league views, and details.
- Use optional right panels only when they improve MVP clarity.
- Avoid too many side panels on MVP pages.
- Keep pages responsive for tablet.

Web sidebar items:
1. Home
2. Live Scores
3. Leagues
4. Standings
5. Teams
6. Players
7. Favorites
8. Settings

Mobile navigation requirements:
- Use bottom navigation.
- Keep navigation thumb-friendly.
- Use compact top headers.
- Use swipeable sport chips.
- Use sticky filter bars where useful.
- Avoid squeezing desktop tables directly into mobile.
- Mobile standings should use a readable sticky team column or compact card/table hybrid.

Mobile bottom navigation:
1. Scores
2. Live
3. Leagues
4. Search
5. Favorites

Core filter tabs:
- All
- Live
- Upcoming
- Finished
- Favorites

Sport category chips:
- Football
- Basketball
- Tennis
- Baseball
- Cricket
- Hockey
- Volleyball
- Esports
- More

Required reusable components:
- App header
- Web sidebar
- Mobile bottom navigation
- Mobile header
- Sport category chip
- Date selector
- League group header
- Game score card
- Team logo avatar
- Player avatar
- Live badge
- Status badge
- Favorite button
- Statistic comparison row
- Standings table
- Mobile standings table
- Player stats card
- Team stats card
- Empty state card
- Loading skeleton
- Error state
- Filter dropdown
- Search input
- Tab navigation
- Segmented control
- Notification badge placeholder
- Chart card placeholder for later
- Timeline event item
- Form indicator chips
- Pagination or load more
- Bottom sheet filters for mobile
- Theme toggle

Atomic design requirements:
Define and apply a full design system:
- Color tokens
- Typography tokens
- Spacing tokens
- Radius tokens
- Shadow tokens
- Border tokens
- Icon rules
- Button variants
- Card variants
- Table variants
- Badge variants
- Input variants
- Navigation variants
- Empty states
- Loading states
- Error states

Spacing:
- Use a 4px base spacing scale.
- Cards should use consistent padding.
- Tables should use consistent row heights.
- Mobile touch targets must be at least 44px.
- Components should align to a clear grid.
- Avoid random margins and spacing that differ per screen.

Typography:
- Use large bold numbers for scores.
- Use clear readable team names.
- Use smaller readable metadata.
- Use consistent font sizes for:
  - Page title
  - Section title
  - Card title
  - Body text
  - Metadata
  - Labels
  - Scores
  - Table values

Light theme:
- Main background: #F6F7FB
- Card background: #FFFFFF
- Main text: #111827
- Muted text: #6B7280
- Borders: soft gray
- Primary buttons: #9333EA
- Hover/active: #7E22CE
- Live badges: #F97316
- Highlights: #EAB308

Dark theme:
- Main background: #0B1020
- Card background: #111827
- Elevated surface: #1F2937
- Main text: #F9FAFB
- Muted text: #9CA3AF
- Borders: #374151
- Primary buttons: #9333EA
- Hover/active: #7E22CE
- Live badges: #F97316
- Highlights: #EAB308

Screen-specific instructions:

1. Web Home Dashboard
- Show today’s live games count.
- Show sport chips.
- Show date selector.
- Show live games grouped by league.
- Show trending matches.
- Show favorite leagues.
- Show a compact standings preview.
- Avoid heavy analytics.

2. Web Live Scores
- Show all games grouped by sport and league.
- Include filters for sport, date, league, and status.
- Show live score cards with clear live badges.
- Include loading, empty, and error states.

3. Web Game Details
- Show team logos, team names, score, game status, and time.
- Include tabs: Summary, Live, Stats, Details.
- Show event timeline.
- Show team statistics comparison.
- Show basic game metadata.
- Keep player statistics simple for MVP.

4. Web League Details
- Show league logo, country, sport, and season selector.
- Include tabs: Games, Standings, Teams, Players.
- Show games grouped by date.
- Show standings preview.
- Show teams list.

5. Web Standings
- Show league selector and season selector.
- Include tabs: Overall, Home, Away, Form.
- Add Conference and Division only as optional states.
- Use a clear table with position, team, played, wins, draws where applicable, losses, points, goal difference where applicable, form, and movement.
- Make table readable and not overcrowded.

6. Web Search Results
- Show global search input.
- Group results by Leagues, Teams, Players, and Games.
- Include recent searches and empty state.

7. Web Favorites
- Show favorite teams, leagues, players, and games.
- Keep alert settings as a placeholder only.
- Do not overbuild notification preferences in MVP.

8. Web Team Details
- Keep basic only.
- Show team header, league, country, recent form, upcoming games, recent results, and basic team stats.
- Avoid advanced analytics.

9. Web Player Details
- Keep basic only.
- Show player header, team, position, nationality, age if available, basic season stats, and recent games.
- Avoid deep career analytics.

Mobile screens:
- Use the same content hierarchy but simplify layout.
- Prioritize score scanning and thumb-friendly interaction.
- Use bottom sheets for filters.
- Use compact cards.
- Avoid dense tables unless optimized for mobile.

Important correction:
Do not mix sport-specific statistics incorrectly.
For football/soccer use football stats.
For basketball use basketball stats.
For tennis use tennis stats.
For baseball use baseball stats.
For cricket use cricket stats.

React.js and Tailwind CSS implementation requirements:
- Design must map cleanly into React components.
- Use reusable component patterns.
- Use Tailwind-friendly spacing, colors, radius, and shadows.
- Use dark mode class strategy.
- Avoid random one-off colors.
- Avoid designs that require complex custom CSS for basic layouts.
- Design all components so they can be implemented with clean Tailwind classes.

Output required:
- Refined MVP design system
- Light theme screens
- Dark theme screens
- Web desktop screens
- Tablet responsive view
- Mobile responsive screens
- Component library
- Navigation flow
- Screen-to-screen flow
- Basic interaction notes
- React + Tailwind design implementation notes

The final design should feel visually unified, MVP-ready, and suitable for development in React.js, Tailwind CSS, Redux Toolkit, RTK Query, .NET Core backend, PostgreSQL, Redis, Clerk, and API-SPORTS.

---

**Cursor**

Exploring the repo for existing Stitch-generated designs, then producing a production-ready design-system document and implementation mapping.



---

**User**

Refine the existing ScoreGuru Stitch-generated design into a production-ready MVP design system and screen set.

ScoreGuru is a global sports live score platform for web and mobile users. It displays live scores, games, leagues, teams, players, standings, seasons, statistics previews, search results, and favorites.

The generated design already uses a purple, orange, and yellow visual direction. Keep that identity, but refine it so the MVP is cleaner, more consistent, easier to implement, and ready for React.js + Tailwind CSS.

The final design must support:
1. Responsive web app
2. Mobile responsive experience for iOS and Android users
3. Light / white theme
4. Dark theme
5. System default theme option in settings

Use the following exact official ScoreGuru color palette:

--cr-purple: #9333EA;
--cr-purple-dark: #7E22CE;
--cr-orange: #F97316;
--cr-yellow: #EAB308;
--cr-text-dark: #111827;
--cr-muted: #6B7280;
--cr-bg-light: #F6F7FB;

Use these additional dark theme tokens:

--cr-bg-dark: #0B1020;
--cr-surface-dark: #111827;
--cr-surface-dark-2: #1F2937;
--cr-border-dark: #374151;
--cr-text-light: #F9FAFB;
--cr-muted-dark: #9CA3AF;

Color usage rules:
- Use #9333EA as the primary brand color.
- Use #7E22CE for hover, active, selected, and pressed states.
- Use #F97316 for live game badges, live indicators, urgent events, and real-time status.
- Use #EAB308 for highlights, trending games, featured matches, and important stats.
- Use #111827 for primary text in light theme.
- Use #6B7280 for muted text in light theme.
- Use #F6F7FB for light theme page background.
- Use #0B1020 for dark theme page background.
- Use #111827 and #1F2937 for dark elevated surfaces.
- Use #F9FAFB for primary text in dark theme.
- Use #9CA3AF for muted text in dark theme.

Design direction:
- Modern sports dashboard
- Premium but clean
- Fast to scan
- Data-rich but not crowded
- Component-based
- Mobile-first but desktop-friendly
- Production-ready for React.js and Tailwind CSS
- Consistent from layout down to the smallest badge, chip, icon, input, tab, and table cell

MVP screens to keep and refine:

Web:
1. Home Dashboard
2. Live Scores
3. Game Details
4. League Details
5. Standings
6. Search Results
7. Basic Favorites
8. Basic Team Details
9. Basic Player Details

Mobile:
1. Scores Home
2. Game Details
3. League Details
4. Standings
5. Search
6. Basic Favorites
7. Basic Team Details
8. Basic Player Details

Move these to Phase 2 and do not overdesign them for MVP:
- Advanced Statistics Hub
- Advanced player analytics
- Advanced team analytics
- Alert preference management
- Push notification preference screens
- Performance trend charts
- Advanced conference and division side panels
- Deep personalized alerts

MVP UX priorities:
- Fast score scanning
- Clear live game visibility
- Clean league grouping
- Simple game detail drill-down
- Simple standings
- Search
- Basic favorites
- Basic team and player profiles
- Light and dark theme consistency

Web layout requirements:
- Use a left sidebar navigation on desktop.
- Use a top header with search, date selector, theme toggle, and profile area.
- Use a main content area for score feeds, league views, and details.
- Use optional right panels only when they improve MVP clarity.
- Avoid too many side panels on MVP pages.
- Keep pages responsive for tablet.

Web sidebar items:
1. Home
2. Live Scores
3. Leagues
4. Standings
5. Teams
6. Players
7. Favorites
8. Settings

Mobile navigation requirements:
- Use bottom navigation.
- Keep navigation thumb-friendly.
- Use compact top headers.
- Use swipeable sport chips.
- Use sticky filter bars where useful.
- Avoid squeezing desktop tables directly into mobile.
- Mobile standings should use a readable sticky team column or compact card/table hybrid.

Mobile bottom navigation:
1. Scores
2. Live
3. Leagues
4. Search
5. Favorites

Core filter tabs:
- All
- Live
- Upcoming
- Finished
- Favorites

Sport category chips:
- Football
- Basketball
- Tennis
- Baseball
- Cricket
- Hockey
- Volleyball
- Esports
- More

Required reusable components:
- App header
- Web sidebar
- Mobile bottom navigation
- Mobile header
- Sport category chip
- Date selector
- League group header
- Game score card
- Team logo avatar
- Player avatar
- Live badge
- Status badge
- Favorite button
- Statistic comparison row
- Standings table
- Mobile standings table
- Player stats card
- Team stats card
- Empty state card
- Loading skeleton
- Error state
- Filter dropdown
- Search input
- Tab navigation
- Segmented control
- Notification badge placeholder
- Chart card placeholder for later
- Timeline event item
- Form indicator chips
- Pagination or load more
- Bottom sheet filters for mobile
- Theme toggle

Atomic design requirements:
Define and apply a full design system:
- Color tokens
- Typography tokens
- Spacing tokens
- Radius tokens
- Shadow tokens
- Border tokens
- Icon rules
- Button variants
- Card variants
- Table variants
- Badge variants
- Input variants
- Navigation variants
- Empty states
- Loading states
- Error states

Spacing:
- Use a 4px base spacing scale.
- Cards should use consistent padding.
- Tables should use consistent row heights.
- Mobile touch targets must be at least 44px.
- Components should align to a clear grid.
- Avoid random margins and spacing that differ per screen.

Typography:
- Use large bold numbers for scores.
- Use clear readable team names.
- Use smaller readable metadata.
- Use consistent font sizes for:
  - Page title
  - Section title
  - Card title
  - Body text
  - Metadata
  - Labels
  - Scores
  - Table values

Light theme:
- Main background: #F6F7FB
- Card background: #FFFFFF
- Main text: #111827
- Muted text: #6B7280
- Borders: soft gray
- Primary buttons: #9333EA
- Hover/active: #7E22CE
- Live badges: #F97316
- Highlights: #EAB308

Dark theme:
- Main background: #0B1020
- Card background: #111827
- Elevated surface: #1F2937
- Main text: #F9FAFB
- Muted text: #9CA3AF
- Borders: #374151
- Primary buttons: #9333EA
- Hover/active: #7E22CE
- Live badges: #F97316
- Highlights: #EAB308

Screen-specific instructions:

1. Web Home Dashboard
- Show today’s live games count.
- Show sport chips.
- Show date selector.
- Show live games grouped by league.
- Show trending matches.
- Show favorite leagues.
- Show a compact standings preview.
- Avoid heavy analytics.

2. Web Live Scores
- Show all games grouped by sport and league.
- Include filters for sport, date, league, and status.
- Show live score cards with clear live badges.
- Include loading, empty, and error states.

3. Web Game Details
- Show team logos, team names, score, game status, and time.
- Include tabs: Summary, Live, Stats, Details.
- Show event timeline.
- Show team statistics comparison.
- Show basic game metadata.
- Keep player statistics simple for MVP.

4. Web League Details
- Show league logo, country, sport, and season selector.
- Include tabs: Games, Standings, Teams, Players.
- Show games grouped by date.
- Show standings preview.
- Show teams list.

5. Web Standings
- Show league selector and season selector.
- Include tabs: Overall, Home, Away, Form.
- Add Conference and Division only as optional states.
- Use a clear table with position, team, played, wins, draws where applicable, losses, points, goal difference where applicable, form, and movement.
- Make table readable and not overcrowded.

6. Web Search Results
- Show global search input.
- Group results by Leagues, Teams, Players, and Games.
- Include recent searches and empty state.

7. Web Favorites
- Show favorite teams, leagues, players, and games.
- Keep alert settings as a placeholder only.
- Do not overbuild notification preferences in MVP.

8. Web Team Details
- Keep basic only.
- Show team header, league, country, recent form, upcoming games, recent results, and basic team stats.
- Avoid advanced analytics.

9. Web Player Details
- Keep basic only.
- Show player header, team, position, nationality, age if available, basic season stats, and recent games.
- Avoid deep career analytics.

Mobile screens:
- Use the same content hierarchy but simplify layout.
- Prioritize score scanning and thumb-friendly interaction.
- Use bottom sheets for filters.
- Use compact cards.
- Avoid dense tables unless optimized for mobile.

Important correction:
Do not mix sport-specific statistics incorrectly.
For football/soccer use football stats.
For basketball use basketball stats.
For tennis use tennis stats.
For baseball use baseball stats.
For cricket use cricket stats.

React.js and Tailwind CSS implementation requirements:
- Design must map cleanly into React components.
- Use reusable component patterns.
- Use Tailwind-friendly spacing, colors, radius, and shadows.
- Use dark mode class strategy.
- Avoid random one-off colors.
- Avoid designs that require complex custom CSS for basic layouts.
- Design all components so they can be implemented with clean Tailwind classes.

Output required:
- Refined MVP design system
- Light theme screens
- Dark theme screens
- Web desktop screens
- Tablet responsive view
- Mobile responsive screens
- Component library
- Navigation flow
- Screen-to-screen flow
- Basic interaction notes
- React + Tailwind design implementation notes

The final design should feel visually unified, MVP-ready, and suitable for development in React.js, Tailwind CSS, Redux Toolkit, RTK Query, .NET Core backend, PostgreSQL, Redis, Clerk, and API-SPORTS.@c:\Users\Admin\Downloads\stitch_scoreguru_design_system_mockups.zip 

---

**Cursor**

Extracting and reviewing the Stitch mockups, then producing a production-ready design-system document mapped to React and Tailwind.



Creating the production MVP design-system document: consolidating Stitch’s Material-style tokens into the official `cr-*` palette, aligning typography and spacing, and documenting screens, components, navigation, and Tailwind mapping.



Fixing a CSS typo and correcting the component section numbering.



Here’s what was produced from your Stitch archive and your requirements.

## Deliverable

**Authoritative spec:** [`docs/design/mvp-design-system.md`](c:\Users\Francis\ScoreGuru\docs\design\mvp-design-system.md)

The zip is unpacked at **`docs/_stitch_extract/`** for pixel reference; the markdown doc **overrides** Stitch where it conflicts (e.g. `#0c1322` → official `#0B1020`, brand primary **`#9333EA`** instead of lavender `primary`).

## What the doc contains

1. **Stitch → production** — One mapping table: retire Material-style names for new code, adopt **`cr-*`** + CSS variables.
2. **Full token set** — Official purple / orange / yellow, light + dark surfaces, borders, text, semantic usage rules.
3. **Typography, spacing (4px), radius, shadows, icons** — Plus Jakarta Sans + Inter, tabular nums for scores/tables, **44px** touch targets.
4. **Component library** — Every component you listed, with layout, states, and Tailwind-friendly notes (§3).
5. **Breakpoints** — Desktop sidebar from `md`, mobile patterns below `md`.
6. **All MVP web screens** (§5) + **mobile mapping** (§6) including sticky filters, bottom sheets, mobile standings behavior.
7. **Navigation + screen flow** — ASCII diagram; web sidebar order (incl. **Teams, Players, Settings** missing from some Stitch HTML); mobile bottom nav **Scores / Live / Leagues / Search / Favorites**; **Settings** for **Light | Dark | System**.
8. **Interactions** — Debounced search, theme persistence, polling note for live data, a11y on badges.
9. **Sport-specific stats** — Strict label sets per sport; **`sportKey`** on game details (§12).
10. **Phase 2** — Statistics Hub + advanced analytics Stitch folders called out as **out of MVP** (§13).
11. **React + Tailwind** — `darkMode: 'class'`, sample `theme.extend.colors`, `globals.css` variable strategy, folder hints, Redux vs RTK Query split (§14).
12. **Light/dark QA checklist** (§15).

## Note on “light theme screens” / “dark theme screens”

The spec is **theme-token-driven**: each screen is described once with **semantic roles** (background, surface, border, badges) so light and dark stay **paired** without duplicating whole layouts. For **visual** pixel proofs, use the existing **`*_dual_theme`** folders under `docs/_stitch_extract/`; implementation should follow **`mvp-design-system.md`**, not the old hex in the HTML `tailwind.config` blocks.

If you want next steps in the repo (e.g. a real `tailwind.config.ts` + `globals.css` in a Vite React app wired to these variables), say the word and we can scaffold it to match §14.

---

**User**

We are starting the ScoreGuru frontend foundation.

Before writing code, read and follow these files:
- .cursor/rules/scoreguru-master-prompt.mdc
- docs/design/mvp-design-system.md

Implement only the frontend foundation first.

Tech stack:
- React.js
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router
- RTK Query later
- Clerk later, not in this task

Create or configure:

1. Tailwind CSS setup using darkMode: 'class'.
2. Global CSS variables based on docs/design/mvp-design-system.md.
3. Tailwind color tokens mapped to CSS variables.
4. Font family tokens:
   - Plus Jakarta Sans for headings and scores.
   - Inter for body, labels, and tables.
5. Light and dark theme support.
6. Redux store foundation.
7. Theme slice with:
   - light
   - dark
   - system
8. Theme persistence using localStorage key:
   - scoreguru-theme
9. React Router setup.
10. Main AppShell layout.
11. Desktop WebSidebar using the final sidebar order:
   - Home
   - Live Scores
   - Leagues
   - Standings
   - Teams
   - Players
   - Favorites
   - Settings
12. Desktop AppHeader with:
   - Search placeholder
   - Date selector placeholder
   - Theme toggle
   - Notification placeholder
   - Avatar placeholder
13. MobileHeader.
14. MobileBottomNav using the final mobile order:
   - Scores
   - Live
   - Leagues
   - Search
   - Favorites
15. Shared reusable components:
   - Button
   - Card
   - Badge
   - Tabs
   - SearchInput
   - Skeleton
   - EmptyState
   - ThemeToggle
16. Placeholder MVP pages:
   - Home
   - Live Scores
   - Leagues
   - Standings
   - Search
   - Favorites
   - Teams
   - Players
   - Settings

Important rules:
- Do not implement API-SPORTS yet.
- Do not add Clerk yet.
- Do not create backend code yet.
- Do not build advanced Statistics Hub.
- Do not add random UI libraries.
- Do not use hardcoded hex colors in JSX.
- Use ScoreGuru cr-* Tailwind tokens only.
- Keep the UI responsive and aligned with docs/design/mvp-design-system.md.
- Keep components reusable and clean.

After implementation, provide:
- Files created or modified
- How to run the app
- Any known issues

---

**Cursor**

Building the frontend foundation: reading project rules and design docs, then scaffolding the React app.



Implementing the foundation: adding the Tailwind Vite plugin, replacing global styles with design tokens, and creating the app structure.



Creating Redux theme logic, layout, shared components, and pages.



Here’s what was implemented for the **ScoreGuru frontend foundation** under [`ScoreGuru/scoreguru-web`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web). It follows the master prompt and [`docs/design/mvp-design-system.md`](c:\Users\Francis\ScoreGuru\docs\design\mvp-design-system.md): **`darkMode: 'class'`**, official **`cr-*`** tokens (no hex in JSX), Plus Jakarta Sans + Inter, Redux theme slice with **`localStorage` key `scoreguru-theme`**, Router + `AppShell`, and the requested nav order.

### Files created or modified

**Config / entry**
- [`ScoreGuru/scoreguru-web/vite.config.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\vite.config.ts) — `@tailwindcss/vite` plugin  
- [`ScoreGuru/scoreguru-web/index.html`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\index.html) — fonts, title **ScoreGuru**  
- [`ScoreGuru/scoreguru-web/src/main.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\main.tsx) — `Provider`, `ThemeRootSync`, `App`  
- [`ScoreGuru/scoreguru-web/src/App.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\App.tsx)  
- [`ScoreGuru/scoreguru-web/src/AppRoutes.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\AppRoutes.tsx) — routes + `AppShell` layout  
- [`ScoreGuru/scoreguru-web/src/index.css`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\index.css) — Tailwind v4, `@custom-variant dark`, `:root` variables, `@theme inline` color + font tokens  

**Redux / theme**
- [`ScoreGuru/scoreguru-web/src/app/store.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\app\store.ts)  
- [`ScoreGuru/scoreguru-web/src/app/hooks.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\app\hooks.ts)  
- [`ScoreGuru/scoreguru-web/src/app/ThemeRootSync.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\app\ThemeRootSync.tsx) — applies `dark` on `<html>`, listens for **system**  
- [`ScoreGuru/scoreguru-web/src/app/themePersistListener.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\app\themePersistListener.ts) — persists `setThemePreference` to `localStorage`  
- [`ScoreGuru/scoreguru-web/src/features/theme/types.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\features\theme\types.ts) — `ThemePreference`, `THEME_STORAGE_KEY` (**`scoreguru-theme`**)  
- [`ScoreGuru/scoreguru-web/src/features/theme/themeStorage.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\features\theme\themeStorage.ts)  
- [`ScoreGuru/scoreguru-web/src/features/theme/themeSlice.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\features\theme\themeSlice.ts)  
- [`ScoreGuru/scoreguru-web/src/lib/themeDom.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\lib\themeDom.ts)  

**Layout**
- [`ScoreGuru/scoreguru-web/src/components/layout/AppShell.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\AppShell.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/layout/WebSidebar.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\WebSidebar.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/layout/AppHeader.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\AppHeader.tsx) — search (links to `/search`), Today placeholder, theme toggle, notification dot, avatar **SG**  
- [`ScoreGuru/scoreguru-web/src/components/layout/MobileHeader.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\MobileHeader.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/layout/MobileBottomNav.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\MobileBottomNav.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/layout/PageContainer.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\PageContainer.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/layout/navigationConfig.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\navigationConfig.ts) — sidebar + mobile nav items  
- [`ScoreGuru/scoreguru-web/src/components/layout/navIcons.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\navIcons.tsx)  

**Shared UI**
- [`ScoreGuru/scoreguru-web/src/components/shared/Button.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\Button.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/shared/Card.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\Card.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/shared/Badge.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\Badge.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/shared/Tabs.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\Tabs.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/shared/SearchInput.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\SearchInput.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/shared/Skeleton.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\Skeleton.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/shared/EmptyState.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\EmptyState.tsx)  
- [`ScoreGuru/scoreguru-web/src/components/shared/ThemeToggle.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\shared\ThemeToggle.tsx) — **cycle** (header) + **menu** (settings)  

**Pages**
- [`ScoreGuru/scoreguru-web/src/pages/HomePage.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\pages\HomePage.tsx)  
- [`ScoreGuru/scoreguru-web/src/pages/MvpPages.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\pages\MvpPages.tsx) — Live Scores, Leagues, Standings, Teams, Players, Favorites, Search  
- [`ScoreGuru/scoreguru-web/src/pages/SettingsPage.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\pages\SettingsPage.tsx)  

**Removed**
- [`ScoreGuru/scoreguru-web/src/App.css`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\App.css) — deleted (replaced by Tailwind + `index.css`)

### How to run

```bash
cd ScoreGuru/scoreguru-web
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

### Behaviour notes

- **Theme:** `light` | `dark` | `system`; `ThemeRootSync` sets `class="dark"` on `<html>` when needed; **`scoreguru-theme`** in `localStorage` is updated on every `setThemePreference`.  
- **System:** `prefers-color-scheme` changes re-apply while preference is **system**.  
- **Nav:** Desktop sidebar order matches your list; mobile bottom bar is **Scores → Live → Leagues → Search → Favorites**. **`NavLink` `end`** on `/` avoids the home tab staying active on every route.  
- **Design tokens:** Utilities are `bg-cr-*`, `text-cr-*`, `border-cr-*`, `font-jakarta`, `font-inter`, plus structural `cr-border-light` from CSS.  

### Known issues / follow-ups

1. **Theme flash (FOUC):** First paint may be light until JS runs and applies the stored/system theme; fixing usually needs a tiny inline script in `index.html` (not added here).  
2. **Header search:** Read-only + link to `/search` — good for placeholder; wire real focus/debounce when search is implemented.  
3. **`!border-0` on mobile `ThemeToggle`:** Used so the cycle button matches a minimal header; still only Tailwind tokens (no hex).  
4. **Game / league / player detail routes:** Not in your placeholder list; add when you wire data.  

`npm run build` and `npm run lint` both complete with **exit code 0**.

---

**User**

We completed the ScoreGuru frontend foundation.

Now do a small Phase 1.1 hardening pass only.

Read and follow:
- .cursor/rules/scoreguru-master-prompt.mdc
- docs/design/mvp-design-system.md

Tasks:

1. Fix the theme flash issue on first paint.
   - Add a tiny inline script in index.html before React loads.
   - It should read localStorage key scoreguru-theme.
   - Supported values: light, dark, system.
   - If preference is dark, add class="dark" to document.documentElement.
   - If preference is system, use window.matchMedia('(prefers-color-scheme: dark)').
   - If no preference exists, default to system.
   - Do not introduce a new package.

2. Add a basic NotFoundPage route.
   - Keep it styled with existing Card/Button/EmptyState components.
   - No random colors.
   - Use ScoreGuru tokens only.

3. Add placeholder detail routes for future MVP pages:
   - /games/:gameId
   - /leagues/:leagueId
   - /teams/:teamId
   - /players/:playerId

4. Each detail placeholder should use the current layout and display a clean MVP placeholder state:
   - Game Details coming soon
   - League Details coming soon
   - Team Details coming soon
   - Player Details coming soon

5. Do not add Clerk yet.
6. Do not add API-SPORTS yet.
7. Do not add backend code yet.
8. Do not build advanced Statistics Hub.

After implementation, run:
- npm run build
- npm run lint

Then provide:
- Files changed
- Build/lint result
- Any known issues

---

**Cursor**

Implementing the theme bootstrap script, NotFound page, and placeholder detail routes. Checking the current routes and `index.html`.



Implementing the inline theme bootstrap, route title helper, NotFound and detail placeholder pages, and updating routes.



Phase 1.1 hardening is in place. Summary below.

### Files changed

| File | Change |
|------|--------|
| [`ScoreGuru/scoreguru-web/index.html`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\index.html) | Inline IIFE in `<head>` reads `localStorage['scoreguru-theme']`, defaults invalid/missing to `system`, applies `document.documentElement.classList` `dark` per light / dark / `prefers-color-scheme`. |
| [`ScoreGuru/scoreguru-web/src/components/layout/navigationConfig.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\navigationConfig.ts) | Added `getMobileHeaderTitle(pathname)` for exact routes, `/games|leagues|teams|players/:id`, else **Not found**. |
| [`ScoreGuru/scoreguru-web/src/components/layout/AppShell.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\AppShell.tsx) | Uses `getMobileHeaderTitle` instead of `routeTitles` only. |
| [`ScoreGuru/scoreguru-web/src/pages/NotFoundPage.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\pages\NotFoundPage.tsx) | **404** page: `PageContainer` + `Card` + `EmptyState` + `Button` (back / home), all `cr-*` classes. |
| [`ScoreGuru/scoreguru-web/src/pages/DetailPlaceholderPages.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\pages\DetailPlaceholderPages.tsx) | Placeholders for game / league / team / player with id from `useParams` and the requested “…coming soon” copy. |
| [`ScoreGuru/scoreguru-web/src/AppRoutes.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\AppRoutes.tsx) | Routes: `/games/:gameId`, `/leagues/:leagueId`, `/teams/:teamId`, `/players/:playerId`; catch‑all `*` → `NotFoundPage` (removed `Navigate` to `/`). |

### Build / lint

- **`npm run build`** — success (Vite production build completed).
- **`npm run lint`** — success (`eslint .`, exit code **0**).

### Known issues

1. **System theme before JS** — The inline script only runs once on first paint. **`prefers-color-scheme` changes** while the tab is open are still handled after load by **`ThemeRootSync`** (same as before).
2. **Mobile header “Not found”** — Any path that isn’t an exact menu route or a supported detail pattern shows **Not found** in the mobile header, including the 404 page itself (intended).
3. **Static vs dynamic `/leagues`** — `/leagues` stays the index route; `/leagues/:leagueId` is registered after it so list vs detail behavior stays correct.

No new packages, Clerk, API-SPORTS, backend, or Statistics Hub work was added.

---

**User**

Now implement the ScoreGuru Clerk authentication foundation.

Read and follow:
- .cursor/rules/scoreguru-master-prompt.mdc
- docs/design/mvp-design-system.md

Tech stack:
- React.js
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router
- Clerk React SDK

Architecture rules:
- Clerk is the authentication issuer.
- Clerk handles Google, Apple, and email login.
- Do not create custom password login.
- Do not store Clerk tokens manually in Redux.
- Do not store Clerk tokens manually in localStorage.
- PostgreSQL user sync will be handled later by the .NET backend.
- RTK Query backend token attachment will be added after backend foundation exists.
- Do not create a Redux auth slice unless strictly needed.

Tasks:

1. Install and configure Clerk React SDK.

2. Add ClerkProvider at the correct app root level.

3. Read Clerk publishable key from:
   - VITE_CLERK_PUBLISHABLE_KEY

4. Create or update .env.example with:
   - VITE_CLERK_PUBLISHABLE_KEY=
   - VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api

5. Add authentication routes:
   - /sign-in
   - /sign-up

6. Create:
   - SignInPage
   - SignUpPage
   - ProtectedRoute
   - AuthLoadingState if needed

7. Use Clerk components for sign in and sign up.
   - Keep the pages visually aligned with ScoreGuru tokens.
   - Use existing Card, Button, or layout components where appropriate.
   - Do not hardcode random colors.

8. Protect these routes:
   - /favorites
   - /settings

9. Keep these routes public:
   - /
   - /live
   - /leagues
   - /standings
   - /search
   - /teams
   - /players
   - /games/:gameId
   - /leagues/:leagueId
   - /teams/:teamId
   - /players/:playerId

10. Update AppHeader:
   - If signed out, show Sign in button.
   - If signed in, show Clerk UserButton.

11. Update MobileHeader where appropriate:
   - If signed out, show compact Sign in action or icon.
   - If signed in, show Clerk UserButton or profile action.

12. Add safe handling when Clerk publishable key is missing in development.
   - Show a clear developer-friendly message.
   - Do not crash with an unclear error.

13. Do not implement backend yet.

14. Do not implement API-SPORTS yet.

15. Do not build Statistics Hub.

16. Do not change the existing theme architecture except where needed for Clerk UI integration.

After implementation, run:
- npm run build
- npm run lint

Then provide:
- Files created or modified
- Environment variables needed
- How to test sign-in/sign-up
- Build/lint result
- Any known issues

---

**Cursor**

Implementing Clerk authentication: reviewing the app structure and integrating the Clerk provider, auth pages, and protected routes.



Installing `@clerk/clerk-react` and implementing the auth flow, protected routes, and UI updates.



Creating auth files and updating routes and headers.



Fixing `ClerkPublishableKeyMissing` (removing unsupported `Button asChild`), simplifying `clerkAppearance`, and adding auth pages and session controls.



Updating `App.tsx`, `AppRoutes`, headers, and `navigationConfig`. Moving `BrowserRouter` into `App.tsx` so it can wrap routes with `ClerkProvider`.



Summary of the **Clerk authentication foundation**:

### Files created
- [`ScoreGuru/scoreguru-web/src/auth/clerkAppearance.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\auth\clerkAppearance.ts) — `appearance.variables` with ScoreGuru primary `#9333ea` and supporting colors.
- [`ScoreGuru/scoreguru-web/src/auth/AuthLoadingState.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\auth\AuthLoadingState.tsx) — session loading UI (skeleton + text).
- [`ScoreGuru/scoreguru-web/src/auth/ProtectedRoute.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\auth\ProtectedRoute.tsx) — `useAuth()` + `Navigate` to `/sign-in` with `state.from`.
- [`ScoreGuru/scoreguru-web/src/auth/ClerkPublishableKeyMissing.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\auth\ClerkPublishableKeyMissing.tsx) — dev/prod messaging when `VITE_CLERK_PUBLISHABLE_KEY` is missing (no `react-router` dependency).
- [`ScoreGuru/scoreguru-web/src/auth/useSafeAuthRedirectPath.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\auth\useSafeAuthRedirectPath.ts) — safe post-auth redirect path (`fallbackRedirectUrl` for Clerk).
- [`ScoreGuru/scoreguru-web/src/pages/SignInPage.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\pages\SignInPage.tsx) — `<SignIn routing="path" path="/sign-in" />` in `Card` + `AuthPageChrome`.
- [`ScoreGuru/scoreguru-web/src/pages/SignUpPage.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\pages\SignUpPage.tsx) — `<SignUp routing="path" path="/sign-up" />` + links.
- [`ScoreGuru/scoreguru-web/src/components/layout/AuthPageChrome.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\AuthPageChrome.tsx) — auth shell: logo, optional subtitle, `ThemeToggle`.
- [`ScoreGuru/scoreguru-web/src/components/layout/SessionControls.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\SessionControls.tsx) — `DesktopSessionControls` / `MobileSessionControls` (`SignedIn` / `SignedOut`, `UserButton`, sign-in links).

### Files modified
- [`ScoreGuru/scoreguru-web/package.json`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\package.json) / `package-lock.json` — dependency **`@clerk/clerk-react` ^5.61.6**.
- [`ScoreGuru/scoreguru-web/src/App.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\App.tsx) — `ClerkProvider` + `BrowserRouter` when key is set; otherwise `ClerkPublishableKeyMissing`.
- [`ScoreGuru/scoreguru-web/src/AppRoutes.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\AppRoutes.tsx) — `/sign-in`, `/sign-up`, `/live`, nested `ProtectedRoute` for `/favorites` + `/settings`, no `BrowserRouter` here.
- [`ScoreGuru/scoreguru-web/src/components/layout/AppHeader.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\AppHeader.tsx) — `SignedIn` **Settings** link, `DesktopSessionControls`.
- [`ScoreGuru/scoreguru-web/src/components/layout/AppShell.tsx`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\AppShell.tsx) — `MobileSessionControls` + `ThemeToggle` in `MobileHeader`.
- [`ScoreGuru/scoreguru-web/src/components/layout/navigationConfig.ts`](c:\Users\Francis\ScoreGuru\ScoreGuru\scoreguru-web\src\components\layout\navigationConfig.ts) — `routeTitles['/live'] = 'Live'`.

`.env.example` already documents the keys (from earlier work); it should still list `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_SCOREGURU_API_BASE_URL`.

### Environment variables
| Variable | Purpose |
|----------|--------|
| **`VITE_CLERK_PUBLISHABLE_KEY`** | Clerk publishable key (required for the real app; empty/omit → blocking screen). |
| **`VITE_SCOREGURU_API_BASE_URL`** | Reserved for later RTK Query (not used yet). |

Example `.env` in `scoreguru-web`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api
```

### How to test sign-in / sign-up
1. Copy `.env.example` → `.env` and set **`VITE_CLERK_PUBLISHABLE_KEY`** from [Clerk Dashboard → API keys](https://dashboard.clerk.com/).
2. In Clerk: enable **Google / Apple / Email** as you like; set frontend paths to **`/sign-in`** and **`/sign-up`** (and allow your dev origin, e.g. `http://localhost:5173`).
3. Run **`npm run dev`**, open the app, use **Sign in** (header / mobile icon) or visit `/sign-in` and `/sign-up`.
4. Confirm **`/favorites`** and **`/settings`** redirect to `/sign-in` when signed out and work when signed out → signed in; confirm **`UserButton`** and **Settings** (desktop, when signed in).

### Build / lint
- **`npm run build`** — succeeded (`tsc -b` + Vite).
- **`npm run lint`** — succeeded (`eslint .`, exit code **0**).

### Known issues / notes
1. **No Redux auth slice** — only Clerk + `ProtectedRoute`; tokens stay in Clerk’s client, not Redux/localStorage.
2. **`ClerkPublishableKeyMissing`** uses `<a href="/">` (not `Link`) because there is no router when the key is missing.
3. **Clerk appearance** — only `variables` (brand colors, radius) is set; full dark-mode parity for Clerk’s internal surfaces may need **`@clerk/themes`** later (not added per scope).
4. **Dashboard config** — you must align Clerk **allowed origins** and **sign-in/sign-up URLs** with `/sign-in` and `/sign-up` or OAuth will fail.
5. **`/live`** — added as a public alias of the live scores page, matching your public-route list (`LiveScoresPage` is shared with `/live-scores`).

---

**User**

how to do this? 
In Clerk: enable Google / Apple / Email as you like; set frontend paths to /sign-in and /sign-up (and allow your dev origin, e.g. http://localhost:5173).

---

**Cursor**

Here’s a concise way to do it in the **Clerk Dashboard** (wording may vary slightly by Clerk version, but the flow is the same).

### 1. Open your Clerk application
1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com) and sign in.  
2. Open the **application** you use for ScoreGuru (the one whose **publishable key** matches `VITE_CLERK_PUBLISHABLE_KEY`).

### 2. Allow your dev URL (localhost)
1. In the sidebar, open **Configure** → **Domains** (or **Sessions** / **Allowed origins** depending on layout).  
2. Under **Frontend API** / **Allowed origins** (or **Satellites** / **Development**), ensure your Vite dev origin is allowed, typically:  
   - **`http://localhost:5173`**  
3. If there’s a **Paths** or **Redirect allow list**, add the same origin if Clerk asks for full URLs.

(Exact labels: look for “Development instance”, “Allowed origins”, or “Redirect URLs”.)

### 3. Set sign-in and sign-up URLs to `/sign-in` and `/sign-up`
1. Go to **Configure** → **Paths** (sometimes under **Authentication** or **User & authentication**).  
2. Set:  
   - **Sign-in URL** → `/sign-in`  
   - **Sign-up URL** → `/sign-up`  
3. Save. That matches your React routes (`SignInPage` / `SignUpPage` with `routing="path"`).

### 4. Enable Google, Apple, and Email
1. Go to **Configure** → **SSO connections** or **User & authentication** → **Social connections** (or **Web3 / Email**).  
2. **Google**  
   - Turn **on** or **Connect**.  
   - Follow the wizard (OAuth client ID/secret from Google Cloud Console if Clerk doesn’t host it for you).  
3. **Apple**  
   - Turn **on** or **Connect**.  
   - Apple requires a Service ID / key / bundle setup; Clerk’s wizard walks through it.  
4. **Email**  
   - Under **Email, phone, username** (or **Authentication strategies**), enable **Email address** and choose how sign-in works, e.g. **Email verification code** or **magic link** (no custom password app—Clerk handles it).

Disable or don’t enable **Username + password** if you want to stay aligned with “no custom password login” and rely on Clerk’s email/social flows only.

### 5. Redirect URLs after OAuth (if Clerk shows them)
In **Paths** or **OAuth** settings, **Allowed redirect URLs** often need your app origin, e.g.  
- `http://localhost:5173`  
- `http://localhost:5173/sign-in`  
- `http://localhost:5173/sign-up`  

Clerk often fills these automatically when you set the dev domain; if OAuth fails with “redirect_uri mismatch”, add the URLs Clerk shows in the error to **Google** / **Apple** console and to Clerk’s allow list.

### 6. Test locally
1. `.env` has `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` for that same app.  
2. `npm run dev` → open `http://localhost:5173/sign-in`.  
3. Try **Google**, **Apple**, and **Email** as you enabled them.

---

**Docs (official, stay up to date):**  
- [Clerk: Configure redirect URLs / paths](https://clerk.com/docs/deployments/overview) (also search their docs for “paths”, “allowed origins”, “development”).  
- [Social connections (Google, Apple, etc.)](https://clerk.com/docs/authentication/social-connections/overview)  
- [Email / SMS strategies](https://clerk.com/docs/authentication/configuration/sign-up-sign-in-options)

If you tell me whether you’re on Clerk’s **Development** or **Production** instance, I can narrow the exact menu names for your screenshot (they renamed sidebars occasionally).

---

**User**

this what I can see in my clerk dashboard 

---

**Cursor**

You're in the right area. Your **Email** setup already matches what ScoreGuru needs for email login (sign-up + sign-in with verification code). Here’s what to do next in **this** dashboard layout.

## What you already have (Email tab)

From your screenshot, these are good for MVP:

| Setting | Your state | Notes |
|--------|------------|--------|
| Sign-up with email | On | Users can register with email |
| Require email address | On | Required |
| Verify at sign-up | On | Good |
| Verification method | **Email verification code** | Matches “email login” via Clerk (not a custom password form in your app) |
| Sign-in with email | On | Good |
| Sign-in → Email verification code | On | Users sign in with a code |

You do **not** need to turn on “Email verification link” unless you prefer magic links.

**Password tab:** Open it and check whether **password** sign-in is enabled. ScoreGuru’s plan is Clerk-only auth without a custom .NET password flow; in Clerk you can still allow password if you want, but many teams use **email code only** and leave password off for a simpler MVP. If Password is on and you want code-only, disable password there.

---

## Step 2 — Google & Apple (SSO)

In the **left sidebar**, under **User & authentication**:

1. Click **SSO connections** (below “User & authentication”).
2. Enable **Google** and/or **Apple** (toggle or “Add connection”).
3. Follow Clerk’s prompts (often one-click for dev; production may need Google/Apple developer credentials).

Those providers will then show on your `/sign-in` and `/sign-up` Clerk components automatically.

---

## Step 3 — Paths: `/sign-in` and `/sign-up`

Still in the sidebar, under **Developers**:

1. Click **Paths**.
2. Set (or confirm):
   - **Sign-in URL** → `/sign-in`
   - **Sign-up URL** → `/sign-up`
3. Save.

That aligns with your React routes.

---

## Step 4 — Dev origin: `http://localhost:5173`

Under **Developers**:

1. Click **Domains** (or check **Paths** for redirect / allowed URLs, depending on what Clerk shows).
2. For the **Development** instance (you’re on **Development** in the top bar), ensure:
   - **`http://localhost:5173`** is allowed as a frontend / development URL.

If you use a different Vite port, use that instead (check the terminal when you run `npm run dev`).

---

## Step 5 — Match `.env` to this app

1. **Developers** → **API keys**.
2. Copy the **Publishable key** for this **ScoreGuru** app (Development).
3. Put it in `scoreguru-web/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

4. Restart dev server: `npm run dev`.

---

## Quick test checklist

1. Open `http://localhost:5173/sign-in`.
2. You should see Clerk UI with **email** (and **Google** / **Apple** after SSO connections are on).
3. Sign in with email → enter code from inbox.
4. Visit `/favorites` or `/settings` → should work when signed in; should redirect to `/sign-in` when signed out.

---

## If something fails

| Problem | Where to look |
|--------|----------------|
| “Invalid publishable key” | **API keys** + `.env` + restart Vite |
| OAuth / Google redirect error | **SSO connections** + **Domains** / **Paths** allow list |
| Email code never arrives | Clerk **Email** tab + check spam; dev instances sometimes throttle |
| Wrong app in dashboard | Top-left **ScoreGuru** + **Development** must match your `pk_test_...` key |

If you send a screenshot of **SSO connections** or **Developers → Paths**, we can confirm Google/Apple and URLs line-by-line with your screen.

---

**User**

for sign and sign-up 

---

**Cursor**

Your **Paths** screen is still pointing auth at Clerk’s **Account Portal** (`warm-redfish-28.accounts.dev`). ScoreGuru uses **your** pages at `/sign-in` and `/sign-up`, so switch each component to the **development host**.

## 1. Set the development host (if you haven’t)

1. Sidebar → **Developers** → **Domains** (not Paths).
2. Find **Development host** / **Application URL** (wording varies).
3. Set it to your Vite URL, usually:
   - **`http://localhost:5173`**
4. Save.

`$DEVHOST` on the Paths page should resolve to that URL.

---

## 2. `<SignIn />` — use your app, not Account Portal

On **Paths** → **Component paths** → **`<SignIn />`**:

1. Select **“Sign-in page on development host”** (not “Account Portal”).
2. In the path field (after `$DEVHOST`), enter:
   - **`/sign-in`**
3. Full URL should look like:  
   `http://localhost:5173/sign-in`

---

## 3. `<SignUp />` — same for sign-up

Under **`<SignUp />`**:

1. Select **“Sign-up page on development host”**.
2. Path:
   - **`/sign-up`**
3. Full URL:  
   `http://localhost:5173/sign-up`

---

## 4. Signing out (optional but useful)

Under **Signing out**:

1. Choose **“Page on development host”** (not Account Portal).
2. Use something like **`/`** (home) or **`/sign-in`** if you want users to land on sign-in after logout.

Your `UserButton` already uses `afterSignOutUrl="/"`, which matches sending people home.

---

## 5. Save and test

1. Click **Save** on the Paths page.
2. Restart dev server if it’s running: `npm run dev`.
3. Open:
   - `http://localhost:5173/sign-in`
   - `http://localhost:5173/sign-up`

You should see the Clerk widgets **inside** ScoreGuru (your `Card` + layout), not the hosted `accounts.dev` page.

---

## How this fits your React app

You already have:

- Routes: `/sign-in`, `/sign-up`
- `<SignIn path="/sign-in" routing="path" />` and `<SignUp path="/sign-up" routing="path" />`

The dashboard Paths setting tells Clerk **where** those live when it redirects (OAuth, “Sign in” links, etc.). Account Portal URLs are only for Clerk’s hosted pages; you don’t want those for this setup.

---

## If Google/Apple still open `accounts.dev`

1. Confirm **SSO connections** has Google/Apple enabled.
2. Confirm **Domains** includes `http://localhost:5173`.
3. After changing Paths, try sign-in again in a **private/incognito** window (old redirects can be cached).

---

**Summary:** For sign-in and sign-up, pick **development host** + paths **`/sign-in`** and **`/sign-up`**, not the Account Portal options. If you want, share a screenshot after you switch those two radios and we can confirm the URLs look right before you save.

---

**User**

i cant change the url 

---

**Cursor**

Checking how the app configures Clerk URLs — we may not need to change the Domains page.



You’re not doing anything wrong — **that Domains screen is not where you set `localhost:5173`.**

## What that page is

**Configure → Developers → Domains → Primary**

Shows Clerk’s **own** development domain, for example:

`warm-redfish-28.clerk.accounts.dev`

That URL is **assigned by Clerk** for your dev instance (Frontend API / hosted Account Portal). In Development you usually **cannot** replace it with `localhost`, and you **don’t need to** for ScoreGuru.

| URL | What it is |
|-----|------------|
| `warm-redfish-28.clerk.accounts.dev` | Clerk’s domain (this page) |
| `http://localhost:5173` | **Your** React app (Vite) |

Your app and Clerk’s domain are two different things.

---

## Where sign-in / sign-up actually live

You want users on **your** app:

- `http://localhost:5173/sign-in`
- `http://localhost:5173/sign-up`

That is configured on **Paths**, not **Domains**.

1. Sidebar → **Developers** → **Paths** (under Domains).
2. **`<SignIn />`** → choose **“Sign-in page on development host”** (not Account Portal).
3. Path: **`/sign-in`** (after `$DEVHOST`).
4. **`<SignUp />`** → **“Sign-up page on development host”**.
5. Path: **`/sign-up`**.
6. **Save**.

`$DEVHOST` should resolve to something like `http://localhost:5173` in Development. You don’t type that on the Domains page.

---

## If Paths still won’t let you pick a host

Some Clerk UIs only show the path when **development host** is selected, or `$DEVHOST` is fixed for the instance.

You can still run auth **without** changing the Domains URL:

1. Open the app directly:
   - `http://localhost:5173/sign-in`
   - `http://localhost:5173/sign-up`
2. Your code already embeds Clerk there (`<SignIn path="/sign-in" />`, `<SignUp path="/sign-up" />`).

For redirects (OAuth, “already signed in”, etc.), set URLs in code on `ClerkProvider` (Clerk recommends this as dashboard Paths are being deprecated):

```tsx
<ClerkProvider
  publishableKey={publishableKey}
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  appearance={getClerkAppearance()}
>
```

I can add those two props in `App.tsx` for you if you want — then the dashboard Paths matter less.

---

## Quick checklist

1. **`.env`** — `VITE_CLERK_PUBLISHABLE_KEY` from **this** ScoreGuru Development app (Developers → API keys).
2. **`npm run dev`** — note the port (often **5173**).
3. Test **`http://localhost:5173/sign-in`** — you should see ScoreGuru + Clerk form, not only `accounts.dev`.
4. **Domains page** — leave `warm-redfish-28.clerk.accounts.dev` as-is; no change needed.

---

## When things go wrong

| Symptom | Likely cause |
|--------|----------------|
| Browser opens `accounts.dev/sign-in` | Paths still on **Account Portal** → switch to **development host** or use `signInUrl` / `signUpUrl` on `ClerkProvider` |
| Blank / error on `/sign-in` | Wrong publishable key or dev server not running |
| OAuth redirect error | Paths + use same port as Vite (`5173`) |

**Bottom line:** You can’t change the URL on **Domains** because that’s Clerk’s domain. Use **Paths** (development host + `/sign-in` and `/sign-up`) or open those routes directly in the browser; optional `signInUrl` / `signUpUrl` on `ClerkProvider` makes redirects reliable without touching Domains.

If you send a screenshot of **Paths** after selecting “development host” for Sign-in, we can confirm the full URL before you save.

---

**User**

this is the path

---

**Cursor**

You’re on the right page. Two things on this screen explain why sign-in still goes to `accounts.dev`:

1. **Fallback development host** is empty — `$DEVHOST` has nothing to point at.  
2. **Sign-in** and **Sign-up** are still set to **Account Portal** (the `warm-redfish-28.accounts.dev` URLs).

Do this in order:

---

### Step 1 — Set your dev app URL

At the top, **Fallback development host**, enter exactly:

```text
http://localhost:5173
```

(If Vite uses another port, use that instead — check the terminal when you run `npm run dev`.)

Save if there’s a **Save** button on the page.

That value becomes **`$DEVHOST`** for everything below.

---

### Step 2 — `<SignIn />`

1. Select **“Sign-in page on development host”** (not Account Portal).  
2. In the path field (after `$DEVHOST`), enter:

   ```text
   /sign-in
   ```

   You should see something like:  
   `http://localhost:5173/sign-in`

---

### Step 3 — `<SignUp />`

1. Select **“Sign-up page on development host”**.  
2. Path:

   ```text
   /sign-up
   ```

   → `http://localhost:5173/sign-up`

---

### Step 4 — Signing out (optional)

1. Select **“Page on development host”**.  
2. Path:

   ```text
   /
   ```

   → home after sign-out (matches your app’s `afterSignOutUrl="/"`).

---

### Step 5 — Save and test

1. Save on the Paths page.  
2. Restart: `npm run dev`.  
3. Open: `http://localhost:5173/sign-in`

You should get ScoreGuru’s page with the Clerk form embedded, not only the hosted `accounts.dev` page.

---

### Why the Account Portal URLs look “locked”

While **Account Portal** is selected, Clerk shows `https://warm-redfish-28.accounts.dev/sign-in` — that’s normal and not editable. Switch the **radio** to **development host**; then you edit the path (`/sign-in`), not the Clerk domain.

---

### If “development host” stays disabled

That usually means **Fallback development host** is still empty. Fill in `http://localhost:5173` first, save, then try the radios again.

---

**Summary:** Fill **Fallback development host** → switch Sign-in / Sign-up to **development host** → paths `/sign-in` and `/sign-up` → save → test `localhost:5173/sign-in`.

If you want, we can also add `signInUrl="/sign-in"` and `signUpUrl="/sign-up"` on `ClerkProvider` in code so redirects work even if the dashboard is misconfigured.

Your Clerk setup is working. The screenshots show exactly what we wanted:

- **`http://localhost:5173/sign-in`** — ScoreGuru shell + embedded Clerk `<SignIn />`
- **`http://localhost:5173/sign-up`** — same for sign-up
- **Development mode** banner — normal for a Clerk dev instance
- **Social + email** — providers you enabled in the dashboard are showing

Paths + **Fallback development host** (`http://localhost:5173`) are doing their job; users stay on your app instead of only `accounts.dev`.

### Quick tests to finish verification

1. **Email** — enter email → **Continue** → enter the code from your inbox.
2. **Google / Apple** — complete OAuth (if enabled in **SSO connections**).
3. **Protected routes** — while signed out, open `/favorites` or `/settings` → should redirect to `/sign-in`. After sign-in → those pages should load.
4. **Header** — signed in → **UserButton**; signed out → **Sign in**.
5. **Cross-link** — “Sign up” / “Sign in” between the two pages.

### Optional Clerk dashboard tweaks (not required for MVP)

| What you see | Where to change |
|--------------|-----------------|
| **Facebook** on sign-in but not in your plan | **SSO connections** → turn Facebook off if you only want Google + Apple |
| **Password** on sign-up, **email code** on sign-in | **User & authentication** → **Password** / **Email** tabs — align strategies (e.g. email code only, or allow password on both) |
| Clerk card vs dark ScoreGuru background | Later: tune `appearance` in `clerkAppearance.ts` or Clerk **Customization** |

### You can ignore for now

- **“Development mode”** on the Clerk card — goes away in production with a production Clerk instance.
- Hosted `warm-redfish-28.accounts.dev` on the **Domains** page — still correct; your app uses `localhost` via Paths.

If something fails on a specific step (OAuth redirect, email code, protected route), say which one and we can narrow it down.

---

**User**

Now implement the ScoreGuru backend foundation.

Read and follow:
- .cursor/rules/scoreguru-master-prompt.mdc
- docs/design/mvp-design-system.md

Architecture decision:
- Clerk is the authentication issuer.
- .NET validates Clerk-issued JWT tokens.
- PostgreSQL is the source of truth for ScoreGuru user data.
- ASP.NET Core Identity is used for local ApplicationUser, roles, claims, and authorization support.
- .NET Identity must not issue primary login tokens.
- Do not create password login.
- Do not create register/login endpoints.
- Do not implement API-SPORTS yet.

Backend tech stack:
- ASP.NET Core Web API
- C#
- PostgreSQL
- EF Core
- ASP.NET Core Identity
- Redis
- Docker Compose for development tools

Create the backend solution under:
- ScoreGuru/backend/

Solution/projects:
1. ScoreGuru.Api
2. ScoreGuru.Application
3. ScoreGuru.Domain
4. ScoreGuru.Infrastructure

Project references:
- Api references Application and Infrastructure
- Application references Domain
- Infrastructure references Application and Domain
- Domain references no other project

Implement:

1. Domain entities:
   - ApplicationUser extending IdentityUser<Guid>
   - UserProfile

ApplicationUser fields:
- ClerkUserId
- DisplayName
- AvatarUrl
- Provider
- IsActive
- CreatedAtUtc
- UpdatedAtUtc
- LastLoginAtUtc
- Profile navigation property

UserProfile fields:
- Id
- UserId
- FirstName
- LastName
- Country
- PreferredSports
- PreferredLeagues
- ThemePreference
- TimeZone
- Language
- CreatedAtUtc
- UpdatedAtUtc
- User navigation property

2. Infrastructure persistence:
   - ScoreGuruDbContext
   - Inherit from IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
   - Configure ApplicationUser
   - Configure UserProfile one-to-one with ApplicationUser
   - Add unique index on ClerkUserId
   - Add unique index on normalized email through Identity defaults
   - Use snake_case table/column naming only if already configured cleanly, otherwise keep EF default for now

3. PostgreSQL configuration:
   - Use Npgsql EF Core provider
   - Connection string from configuration:
     ConnectionStrings__Postgres

4. Redis configuration:
   - Add Redis connection using StackExchange.Redis
   - Configuration key:
     Redis__ConnectionString
   - Register IConnectionMultiplexer
   - Do not build caching services yet unless needed for health checks

5. Clerk JWT validation:
   - Configure JWT bearer authentication
   - Validate Clerk-issued JWT tokens
   - Read configuration from:
     Clerk__Authority
     Clerk__JwksUrl
     Clerk__Audience
   - Use standard ASP.NET Core authentication and authorization
   - Do not manually parse tokens in controllers
   - Map the Clerk user id from JWT claims into the current user context
   - Use a helper service if needed:
     ICurrentUserService

6. Auth user sync:
   - Implement GET /api/auth/me
   - Requires authentication
   - Reads Clerk user id from JWT claims
   - Reads email, name/display name, avatar if present from claims
   - If ApplicationUser with ClerkUserId does not exist:
     - Create ApplicationUser
     - Create UserProfile
     - Set IsActive = true
     - Set CreatedAtUtc
     - Set LastLoginAtUtc
   - If user exists:
     - Update LastLoginAtUtc
     - Update basic email/display/avatar if changed
   - Return a clean DTO:
     {
       id,
       clerkUserId,
       email,
       displayName,
       avatarUrl,
       isActive,
       profile: {
         firstName,
         lastName,
         country,
         preferredSports,
         preferredLeagues,
         themePreference,
         timeZone,
         language
       }
     }

7. User profile endpoints:
   - GET /api/users/me/profile
   - PUT /api/users/me/profile
   - PUT /api/users/me/theme

All require authentication.

8. Health endpoints:
   - GET /api/health
   - Include basic API health
   - Include database check if simple
   - Include Redis check if simple
   - Do not expose secrets

9. CORS:
   - Allow frontend dev origin:
     http://localhost:5173
   - Use configuration-friendly setup
   - Do not use AllowAnyOrigin with credentials

10. Docker Compose development tools:
   - Create docker-compose.yml at ScoreGuru/
   - Include:
     - PostgreSQL
     - pgAdmin
     - Redis
     - RedisInsight
   - Do not include API-SPORTS because it is external
   - Backend container is optional for now. If added, make sure local development still works without containerizing the API.

11. Configuration:
   - Add appsettings.json
   - Add appsettings.Development.json
   - Add safe placeholders only
   - Do not commit real Clerk secrets
   - Do not commit API keys

12. EF Core migration:
   - Create initial migration for Identity + UserProfile
   - Name it:
     InitialIdentityUserProfile

13. Developer docs:
   - Create or update:
     docs/backend/backend-foundation.md
   - Include:
     - How to run Docker tools
     - How to apply migrations
     - Required environment variables
     - How to test /api/health
     - How to test /api/auth/me with Clerk token later

Important rules:
- Do not implement API-SPORTS yet.
- Do not implement score endpoints yet.
- Do not create password login or custom registration.
- Do not expose raw exception details.
- Use UTC timestamps.
- Use async/await properly.
- Use cancellation tokens.
- Keep controllers thin.
- Do not return EF entities directly.
- Use DTOs.
- Keep the solution aligned with the master prompt.

After implementation, run:
- dotnet build
- dotnet test if test project exists
- docker compose config
- optionally docker compose up -d for tools if safe

Then provide:
- Files created or modified
- Required environment variables
- How to run PostgreSQL, pgAdmin, Redis, RedisInsight
- How to apply migrations
- How to run the API
- How to test health endpoint
- Build result
- Known issues

---

**Cursor**

Exploring the repository and scaffolding the backend solution per the master prompt.



Creating domain, application, infrastructure, and API layers.



The ScoreGuru **backend foundation** is in place under `ScoreGuru/backend/`, with Docker tools at `ScoreGuru/docker-compose.yml` and docs at `docs/backend/backend-foundation.md`.

## Build / validation

| Command | Result |
|---------|--------|
| `dotnet build` (backend solution) | **Succeeded** (0 warnings) |
| `dotnet test` | No test project in the solution |
| `docker compose config` | **Valid** |

---

## Solution structure

```
ScoreGuru/backend/
  ScoreGuru.sln
  ScoreGuru.Domain/          ApplicationUser, UserProfile
  ScoreGuru.Application/     DTOs, ICurrentUserService, IAuthMeService, IUserProfileService
  ScoreGuru.Infrastructure/  DbContext, Clerk JWT, Redis, services, Migrations
  ScoreGuru.Api/               Controllers, Program, appsettings
```

**References:** Api → Application, Infrastructure · Application → Domain · Infrastructure → Application, Domain

---

## API endpoints

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/health` | Public (DB + Redis checks) |
| GET | `/api/auth/me` | Clerk JWT — sync/create user |
| GET | `/api/users/me/profile` | Clerk JWT |
| PUT | `/api/users/me/profile` | Clerk JWT |
| PUT | `/api/users/me/theme` | Clerk JWT |

No password login, register, or login endpoints.

---

## Required environment variables

Override `appsettings` with double underscores:

```bash
ConnectionStrings__Postgres=Host=localhost;Port=5432;Database=scoreguru;Username=scoreguru;Password=scoreguru_dev_password
Redis__ConnectionString=localhost:6379,abortConnect=false
Clerk__Authority=https://warm-redfish-28.clerk.accounts.dev
Clerk__JwksUrl=                    # optional
Clerk__Audience=                   # optional, if your JWTs require it
```

**Local secrets (recommended):**

```bash
cd ScoreGuru/backend/ScoreGuru.Api
dotnet user-secrets set "Clerk:Authority" "https://warm-redfish-28.clerk.accounts.dev"
```

Set `Clerk:Authority` to your Clerk **Frontend API** domain (same instance as your publishable key).

---

## Run PostgreSQL, pgAdmin, Redis, RedisInsight

From `ScoreGuru/`:

```bash
docker compose up -d
```

| Tool | Access |
|------|--------|
| PostgreSQL | `localhost:5432` — DB `scoreguru`, user `scoreguru`, password `scoreguru_dev_password` |
| pgAdmin | http://localhost:5050 — `admin@scoreguru.local` / `scoreguru_pgadmin_dev` |
| Redis | `localhost:6379` |
| RedisInsight | http://localhost:5540 |

---

## Apply migrations

```bash
cd ScoreGuru/backend
dotnet ef database update --project ScoreGuru.Infrastructure --startup-project ScoreGuru.Api
```

Migration: **`InitialIdentityUserProfile`** (Identity tables + `UserProfiles`, unique index on `ClerkUserId`).

---

## Run the API

```bash
cd ScoreGuru/backend/ScoreGuru.Api
dotnet run
```

- URL: **http://localhost:5000**
- Frontend: `VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api`

---

## Test health

```bash
curl http://localhost:5000/api/health
```

---

## Test `/api/auth/me` (after Clerk is configured)

```bash
curl -H "Authorization: Bearer YOUR_CLERK_JWT" http://localhost:5000/api/auth/me
```

Call once while signed in on the frontend so the user is created in PostgreSQL.

---

## Key files created

- **Domain:** `Entities/ApplicationUser.cs`, `Entities/UserProfile.cs`
- **Infrastructure:** `Persistence/ScoreGuruDbContext.cs`, `Authentication/ClerkAuthenticationExtensions.cs`, `Identity/CurrentUserService.cs`, `Services/AuthMeService.cs`, `Services/UserProfileService.cs`, `DependencyInjection.cs`, `Persistence/Migrations/*InitialIdentityUserProfile*`
- **Api:** `Controllers/AuthController.cs`, `UsersController.cs`, `HealthController.cs`, `Program.cs`, `Middleware/ExceptionHandlingMiddleware.cs`, `appsettings*.json`
- **Ops:** `ScoreGuru/docker-compose.yml`, `docs/backend/backend-foundation.md`

---

## Known issues

1. **`Clerk:Authority` is required at startup** — must be a real Clerk instance URL, not the placeholder, or JWT setup will be wrong.
2. **JWT `iss` / `aud`** — must match Clerk; if validation fails, compare token claims in [jwt.io](https://jwt.io) with `Clerk:Authority` and `Clerk:Audience`.
3. **Session JWT vs API JWT** — frontend may need a Clerk JWT template for your API; document in Clerk when wiring RTK Query.
4. **Protected user routes** — call `GET /api/auth/me` first so `ApplicationUser` + `UserProfile` exist before profile endpoints.
5. **Redis health** — may show **Unhealthy** if Redis is down, but the API can still start (`abortConnect=false`).

Full steps: [`docs/backend/backend-foundation.md`](c:\Users\Francis\ScoreGuru\docs\backend\backend-foundation.md).

---

**User**

<system_notification>
The following task has finished. If you were already aware, ignore this notification and do not restate prior responses.

<task>
kind: shell
status: error
task_id: 152746
title: Add NuGet packages to backend projects
detail: exit_code=1
output_path: C:\Users\Admin\.cursor\projects\c-Users-Francis-ScoreGuru\terminals\152746.txt
</task>
</system_notification>
<user_query>Briefly inform the user about the task result and perform any follow-up actions (if needed). If there's no follow-ups needed, don't explicitly say that.</user_query>

---

**Cursor**

That background **“Add NuGet packages”** step failed at first: NuGet pulled **10.0.8** packages (`JwtBearer`, `EF Core Design`), which only target **.NET 10**, while the backend uses **net9.0**.

That was fixed during the backend work by pinning those packages to **9.0.8** (and adding the rest of the stack: Npgsql, Identity EF, Redis, etc.). **`dotnet build` on the backend solution succeeds now** — nothing else is required for that error.

---

**User**

@c:\Users\Admin\.cursor\projects\c-Users-Francis-ScoreGuru\terminals\4.txt:650-836 

---

**Cursor**

Your migration command **succeeded**. Here’s what that output means.

### Result
**`No migrations were applied. The database is already up to date.`**

EF connected to PostgreSQL (`localhost:5432`, database `scoreguru`), checked `__EFMigrationsHistory`, and found that **`InitialIdentityUserProfile` is already applied**. Nothing new was run — that’s expected if you (or an earlier run) already applied it.

### Other lines (not failures)
| Message | Meaning |
|--------|---------|
| **Build succeeded** | Projects compiled OK. |
| **EF tools 9.0.5 vs runtime 9.0.8** | Global `dotnet-ef` is slightly older than your packages. Optional fix below. |
| **Index … not created on IdentityUserRole/Token** | Normal EF debug noise for Identity; safe to ignore. |
| **Done.** | Command finished successfully. |

### Optional: align EF CLI with 9.0.8
```bash
dotnet tool update --global dotnet-ef
```

### Confirm in the database
In pgAdmin or `psql`, you should see tables such as `AspNetUsers`, `AspNetRoles`, `UserProfiles`, and a row in `__EFMigrationsHistory` for `InitialIdentityUserProfile`.

### Next step
Start the API and hit health:

```bash
cd ScoreGuru/backend/ScoreGuru.Api
dotnet run
```

```bash
curl http://localhost:5000/api/health
```

You should see `"database": "Healthy"` if Postgres is still running (`docker compose up -d`).

---

**User**

@c:\Users\Admin\.cursor\projects\c-Users-Francis-ScoreGuru\terminals\5.txt:9-11 

---

**Cursor**

Your health check passed. The API is up and can reach both dependencies.

| Check | Status |
|-------|--------|
| **api** | Healthy |
| **database** | Healthy (PostgreSQL + migrations) |
| **redis** | Healthy |

That means Docker services (or local Postgres/Redis), connection strings in `appsettings`, and the running API are aligned.

**Next checks when you’re ready:**

1. Set **`Clerk:Authority`** in `appsettings.Development.json` or user secrets to your real Clerk instance (e.g. `https://warm-redfish-28.clerk.accounts.dev`).
2. Call a protected route with a Clerk JWT:
   ```bash
   curl -H "Authorization: Bearer YOUR_CLERK_JWT" http://localhost:5000/api/auth/me
   ```
3. Point the frontend at the API: `VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api` in `scoreguru-web/.env`.

---

**User**

Now connect the ScoreGuru React frontend to the .NET backend.

Read and follow:
- .cursor/rules/scoreguru-master-prompt.mdc
- docs/design/mvp-design-system.md
- docs/backend/backend-foundation.md

Architecture rules:
- Clerk is the authentication issuer.
- React must not store Clerk tokens in Redux or localStorage.
- React must call the ScoreGuru .NET API, not API-SPORTS.
- PostgreSQL remains the source of truth for ScoreGuru user data.
- Do not implement API-SPORTS yet.
- Do not build score pages yet.
- Do not create custom password login.

Frontend project:
- ScoreGuru/scoreguru-web

Backend project:
- ScoreGuru/backend

Tasks:

1. Add RTK Query foundation.

Create:
- src/services/scoreGuruApi.ts
- src/services/apiConfig.ts if useful
- src/services/types/authTypes.ts
- src/services/types/profileTypes.ts

2. Configure API base URL from:

VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api

3. Attach Clerk token to backend requests.

Important:
- Use Clerk getToken() at request time.
- Do not store the token in Redux.
- Do not store the token in localStorage.
- If Clerk JWT template is needed, support an optional env variable:
  VITE_CLERK_JWT_TEMPLATE=
- If VITE_CLERK_JWT_TEMPLATE is empty, call getToken() normally.
- If VITE_CLERK_JWT_TEMPLATE has a value, call getToken({ template: value }).

4. Because RTK Query prepareHeaders is not React-hook friendly, implement this safely.

Acceptable approaches:
- Create a custom baseQuery wrapper that receives getToken through app setup/context.
- Or create a small auth-aware API provider/hook pattern.
- Do not call React hooks outside React components.
- Do not violate hook rules.

5. Add API endpoints in RTK Query:

- getAuthMe: GET /auth/me
- getMyProfile: GET /users/me/profile
- updateMyProfile: PUT /users/me/profile
- updateMyTheme: PUT /users/me/theme

6. Add frontend DTO types matching backend responses.

7. Add a user feature area:

Create:
- src/features/user/UserBootstrap.tsx
- src/features/user/UserProfileCard.tsx if helpful
- src/features/user/userSelectors.ts if needed

Behavior:
- When the user is signed in, call getAuthMe.
- Show loading state while syncing.
- Show a clean error state if backend is unavailable.
- Do not block the whole public app if /auth/me fails.
- For protected routes like Settings and Favorites, show a clearer error/retry if user sync fails.

8. Update Settings page:

Add:
- Signed-in user section
- Display email, display name, local user id if available
- Theme preference controls using existing ThemeToggle/menu behavior
- Save theme to backend using PUT /users/me/theme when signed in
- Keep local theme working even if backend save fails

9. Update AppHeader or signed-in session area only if needed:
- Keep Clerk UserButton.
- Do not replace Clerk UserButton with custom auth UI.

10. Add .env.example entries:

VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api
VITE_CLERK_JWT_TEMPLATE=

11. Backend CORS check:

Verify the backend allows:
http://localhost:5173

Only change backend CORS if needed.
Do not use AllowAnyOrigin with credentials.

12. Testing instructions:

After implementation, verify:
- Signed-out public pages still work.
- /favorites redirects to /sign-in when signed out.
- Sign in through Clerk.
- GET /api/auth/me is called.
- User is created/updated in PostgreSQL.
- Settings shows the synced ScoreGuru user.
- Theme changes still work locally.
- Backend theme save works when signed in.

13. Do not implement:
- API-SPORTS
- Live scores
- Favorites persistence
- Advanced statistics
- Push notifications

After implementation, run:
Frontend:
- npm run build
- npm run lint

Backend:
- dotnet build

Then provide:
- Files created or modified
- Environment variables needed
- How token attachment was implemented
- How to test /auth/me from the frontend
- Build/lint result
- Known issues

---

**Cursor**

Connecting the frontend to the backend: exploring the current Redux setup and auth flow.



Implementing RTK Query, Clerk token bridge, and user sync integration.



The React frontend is now wired to the .NET API with RTK Query and Clerk token attachment.

## Files created

| Path | Purpose |
|------|---------|
| `src/services/apiConfig.ts` | API base URL + optional JWT template |
| `src/services/auth/clerkTokenBridge.ts` | Module-level `getToken` registration (no Redux/localStorage) |
| `src/services/scoreGuruBaseQuery.ts` | `fetchBaseQuery` with async Bearer header |
| `src/services/scoreGuruApi.ts` | RTK Query API + endpoints |
| `src/services/types/authTypes.ts` | `MeResponse` DTO |
| `src/services/types/profileTypes.ts` | Profile + update request DTOs |
| `src/auth/ClerkTokenBridge.tsx` | Registers Clerk `getToken()` inside `ClerkProvider` |
| `src/features/user/UserBootstrap.tsx` | Triggers `getAuthMe` when signed in (no UI) |
| `src/features/user/UserProfileCard.tsx` | Settings account card |
| `src/features/user/UserSyncErrorState.tsx` | Protected-route sync error UI |
| `src/features/user/useSaveThemeToBackend.ts` | `PUT /users/me/theme` when signed in |
| `src/features/user/userSelectors.ts` | RTK `selectAuthMe` helper |
| `src/components/shared/ThemeToggleWithBackend.tsx` | Header/mobile theme + backend save |

## Files modified

- `src/app/store.ts` — RTK Query reducer + middleware
- `src/App.tsx` — `ClerkTokenBridge` + `UserBootstrap`
- `src/auth/ProtectedRoute.tsx` — sync loading/error on `/favorites`, `/settings`
- `src/auth/AuthLoadingState.tsx` — optional `message` prop
- `src/pages/SettingsPage.tsx` — account section + theme backend save
- `src/components/shared/ThemeToggle.tsx` — `onPreferenceChange` callback
- `src/components/layout/AppShell.tsx`, `AppHeader.tsx` — backend-aware theme toggle
- `src/vite-env.d.ts`, `.env.example`
- CORS: **no change** — already allows `http://localhost:5173` in `appsettings.json`

## Environment variables

In `scoreguru-web/.env` (see `.env.example`):

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api
VITE_CLERK_JWT_TEMPLATE=
```

`VITE_CLERK_JWT_TEMPLATE` is optional. If empty, `getToken()` is used; if set, `getToken({ template })` is used.

Backend still needs Clerk JWT settings in `appsettings.Development.json` / user secrets for `/api/auth/me` to succeed.

## Token attachment

1. **`ClerkTokenBridge`** (inside `ClerkProvider`) registers an async function via `registerClerkGetToken()` on mount.
2. **`scoreGuruBaseQuery`** calls `resolveClerkAuthToken()` in `prepareHeaders` at **request time** (not in Redux, not in `localStorage`).
3. If a token exists, requests include `Authorization: Bearer <token>`.

This avoids calling React hooks from RTK Query module scope.

## How to test `/auth/me` from the frontend

1. Start Docker (Postgres + Redis), then the API: `dotnet run --project ScoreGuru.Api` (port **5000**).
2. Start the web app: `npm run dev` in `scoreguru-web`.
3. Open `http://localhost:5173`, sign in with Clerk.
4. In DevTools → **Network**, filter for `auth/me` — you should see `GET http://localhost:5000/api/auth/me` with `Authorization: Bearer …`.
5. Open **Settings** — email, display name, and local user ID should appear after sync.
6. Change theme — UI updates locally; when signed in, `PUT /users/me/theme` is sent (failures are ignored; local theme still works).
7. **Signed out**: public pages work; `/favorites` redirects to `/sign-in`.
8. **Backend down on protected routes**: `/settings` or `/favorites` shows sync error with **Try again** (public pages are not blocked).

## Build / lint results

| Command | Result |
|---------|--------|
| `npm run build` | Passed |
| `npm run lint` | Passed |
| `dotnet build` | Passed (0 warnings) |

## Known issues

- **`/api/auth/me` returns 401** if Clerk JWT validation is not configured on the API (`Clerk:Authority`, audience, etc.) or if a JWT template is required but `VITE_CLERK_JWT_TEMPLATE` is empty.
- **Theme**: local Redux/localStorage remains the UI source of truth; backend theme is written on change but not loaded back into Redux on login (by design for this task).
- **`.env`**: ensure `VITE_SCOREGURU_API_BASE_URL` is set; the app falls back to `http://localhost:5000/api` if missing.

---

**User**

Now implement the ScoreGuru API-SPORTS integration foundation.

Read and follow:
- .cursor/rules/scoreguru-master-prompt.mdc
- docs/design/mvp-design-system.md
- docs/backend/backend-foundation.md

Architecture rules:
- API-SPORTS is the primary sports data provider.
- Start with API-FOOTBALL from API-SPORTS.
- API-SPORTS is external and must not be Dockerized.
- React must never call API-SPORTS directly.
- API-SPORTS keys must never be exposed to the frontend.
- Only the .NET backend calls API-SPORTS.
- Redis must be used for caching provider responses or normalized responses.
- Do not expose raw API-SPORTS payloads to React.
- Normalize all provider data into ScoreGuru DTOs.
- Do not implement advanced Statistics Hub yet.
- Do not implement Phase 2 analytics.

Backend project:
- ScoreGuru/backend

Implement only backend API-SPORTS foundation.

Required configuration:

Add options class:
- ApiSportsOptions

Configuration keys:
- ApiSports__FootballBaseUrl=https://v3.football.api-sports.io
- ApiSports__ApiKey=
- ApiSports__RequestTimeoutSeconds=15
- ApiSports__UseMockDataWhenMissingKey=true for Development only if helpful

Important:
- Do not commit a real API-SPORTS key.
- Add safe placeholders only.
- Update appsettings.json and appsettings.Development.json safely.
- Update docs/backend/backend-foundation.md or create docs/backend/api-sports-integration.md.

Create provider abstractions:

1. IApiSportsFootballClient
2. IFootballScoreProvider
3. ISportsDataCacheService
4. ApiSportsFootballClient
5. ApiSportsFootballProvider
6. SportsDataCacheService

Use:
- HttpClientFactory / typed HttpClient
- x-apisports-key request header
- CancellationToken
- Structured logging
- Safe error handling
- Redis caching
- DTO normalization

Do not call API-SPORTS directly from controllers.

Create normalized ScoreGuru DTOs for MVP:

1. SportDto
   - key
   - name

2. LeagueDto
   - id
   - name
   - logoUrl
   - country
   - season
   - sportKey

3. TeamDto
   - id
   - name
   - logoUrl
   - country

4. GameSummaryDto
   - id
   - sportKey
   - leagueId
   - leagueName
   - leagueLogoUrl
   - season
   - dateUtc
   - status
   - statusShort
   - elapsed
   - homeTeamId
   - homeTeamName
   - homeTeamLogoUrl
   - awayTeamId
   - awayTeamName
   - awayTeamLogoUrl
   - homeScore
   - awayScore
   - venueName
   - venueCity

5. GameDetailsDto
   - game summary fields
   - events
   - statistics
   - lineups can be null or empty for MVP

6. GameEventDto
   - timeElapsed
   - teamId
   - teamName
   - playerName
   - assistName
   - type
   - detail
   - comments

7. GameStatisticDto
   - label
   - homeValue
   - awayValue

8. StandingRowDto
   - rank
   - teamId
   - teamName
   - teamLogoUrl
   - played
   - wins
   - draws
   - losses
   - goalsFor
   - goalsAgainst
   - goalDifference
   - points
   - form
   - description

9. LeagueStandingsDto
   - leagueId
   - leagueName
   - season
   - rows

Create backend endpoints:

1. GET /api/sports
   - Return supported sports for MVP:
     - football

2. GET /api/football/leagues
   Query parameters:
   - country optional
   - season optional

3. GET /api/football/scores/live
   - Return live football fixtures grouped-ready as flat GameSummaryDto list

4. GET /api/football/scores/today
   Query parameters:
   - date optional, yyyy-MM-dd
   - league optional
   - season optional

5. GET /api/football/games/{gameId}
   - Return GameDetailsDto
   - Include summary, events, statistics if available

6. GET /api/football/standings
   Query parameters:
   - league required
   - season required
   - Return LeagueStandingsDto

7. GET /api/football/teams
   Query parameters:
   - league optional
   - season optional
   - country optional

Caching rules:

Use Redis cache keys such as:
- api-sports:football:leagues:{country}:{season}
- api-sports:football:scores:live
- api-sports:football:scores:today:{date}:{league}:{season}
- api-sports:football:games:{gameId}
- api-sports:football:standings:{league}:{season}
- api-sports:football:teams:{league}:{season}:{country}

Suggested cache durations:
- Live scores: 15 to 30 seconds
- Today scores: 60 seconds
- Game details live: 30 seconds
- Game details finished: 10 to 30 minutes
- Standings: 10 to 30 minutes
- Leagues: 12 to 24 hours
- Teams: 12 to 24 hours

If API-SPORTS key is missing in Development:
- Return clear mock/fallback data only if ApiSports__UseMockDataWhenMissingKey=true.
- Add logs saying mock provider is active.
- Do not silently pretend real provider data was used.
- In non-Development environments, missing API key should be a configuration error.

Error handling:
- If API-SPORTS returns rate limit or provider error, return a safe API response.
- Do not expose provider raw error payloads directly.
- Log enough details for diagnostics but do not log API key.
- Use clean ProblemDetails where appropriate.

Controller rules:
- Controllers must be thin.
- Use provider/application services.
- Return DTOs only.
- Do not return EF entities.
- Do not expose raw API-SPORTS response objects.

Testing:
- Add unit tests if a test project exists.
- At minimum, make provider normalization methods testable.
- Add mock provider option or sample fixtures to allow frontend development without a real key.

Docs:
Create or update:
- docs/backend/api-sports-integration.md

Include:
- Required environment variables
- How to configure API-SPORTS key
- How to start Docker tools
- How to run backend
- How to test live scores endpoint
- How Redis caching works
- Which endpoints are MVP
- What is intentionally Phase 2

Do not implement:
- React score UI
- Favorites persistence
- Advanced Statistics Hub
- Notification alerts
- Multi-sport providers beyond football
- Background worker polling yet

After implementation, run:
- dotnet build
- dotnet test if test project exists
- docker compose config

Then provide:
- Files created or modified
- Environment variables needed
- Endpoint list
- Cache key strategy
- How to test with real API-SPORTS key
- How to test with mock data if no key
- Build/test result
- Known issues

---

**Cursor**

Implementing the API-SPORTS backend foundation. Exploring the existing backend structure and patterns.




Implementing the API-SPORTS foundation systematically: creating DTOs, abstractions, provider layer, cache, controllers, tests, and docs.




Fixing a layer violation: moving the API client interface to Infrastructure.




API-SPORTS integration foundation is in place on the backend. Summary below.

## Files created

**Application**
- `Options/ApiSportsOptions.cs`
- `Dtos/Sports/*` — Sport, League, Team, GameSummary, GameDetails, GameEvent, GameStatistic, StandingRow, LeagueStandings
- `Abstractions/IFootballScoreProvider.cs`, `ISportsDataCacheService.cs`
- `Exceptions/SportsDataProviderException.cs`

**Infrastructure**
- `Providers/ApiSports/IApiSportsFootballClient.cs`
- `Providers/ApiSports/ApiSportsFootballClient.cs`
- `Providers/ApiSports/ApiSportsFootballProvider.cs`
- `Providers/ApiSports/MockFootballScoreProvider.cs`
- `Providers/ApiSports/FootballDataNormalizer.cs`
- `Providers/ApiSports/FootballScoreProviderRegistration.cs`
- `Providers/ApiSports/Models/*` — raw API-FOOTBALL JSON models (not exposed to API)
- `Caching/SportsDataCacheService.cs`, `ApiSportsCacheKeys.cs`, `ApiSportsCacheDurations.cs`

**Api**
- `Controllers/SportsController.cs`
- `Controllers/FootballController.cs`

**Tests**
- `ScoreGuru.Infrastructure.Tests/` — 3 normalizer unit tests

**Docs**
- `docs/backend/api-sports-integration.md`
- Updated `docs/backend/backend-foundation.md`

## Files modified

- `ScoreGuru.Infrastructure/DependencyInjection.cs` — API-SPORTS DI, HttpClient, cache, provider resolution
- `ScoreGuru.Infrastructure/ScoreGuru.Infrastructure.csproj` — `Microsoft.Extensions.Http`
- `ScoreGuru.Api/appsettings.json`, `appsettings.Development.json` — `ApiSports` section
- `ScoreGuru.sln` — test project

## Environment variables

| Variable | Purpose |
|----------|---------|
| `ApiSports__FootballBaseUrl` | `https://v3.football.api-sports.io` |
| `ApiSports__ApiKey` | API-SPORTS key (**never commit**) |
| `ApiSports__RequestTimeoutSeconds` | Default `15` |
| `ApiSports__UseMockDataWhenMissingKey` | `true` in Development, `false` in production |
| `Redis__ConnectionString` | Required for caching |

**User secrets example:**
```bash
dotnet user-secrets set "ApiSports:ApiKey" "YOUR_KEY" --project ScoreGuru.Api
```

## MVP endpoints

| Method | Path |
|--------|------|
| GET | `/api/sports` |
| GET | `/api/football/leagues?country=&season=` |
| GET | `/api/football/scores/live` |
| GET | `/api/football/scores/today?date=&league=&season=` |
| GET | `/api/football/games/{gameId}` |
| GET | `/api/football/standings?league=&season=` (both required) |
| GET | `/api/football/teams?league=&season=&country=` |

Responses are normalized DTOs only. Header `X-ScoreGuru-Data-Source` is `mock` or `api-sports`.

## Cache key strategy

| Key | TTL |
|-----|-----|
| `api-sports:football:leagues:{country}:{season}` | 12h |
| `api-sports:football:scores:live` | 20s |
| `api-sports:football:scores:today:{date}:{league}:{season}` | 60s |
| `api-sports:football:games:{gameId}` | 30s (live) / 15m (finished) |
| `api-sports:football:standings:{league}:{season}` | 15m |
| `api-sports:football:teams:{league}:{season}:{country}` | 12h |

Normalized DTOs are cached in Redis as JSON.

## How to test

**Mock (no key, Development):**
```bash
dotnet run --project ScoreGuru.Api
curl http://localhost:5000/api/football/scores/live
curl "http://localhost:5000/api/football/standings?league=39&season=2024"
curl http://localhost:5000/api/football/games/100001
```

**Real API key:**
```bash
dotnet user-secrets set "ApiSports:ApiKey" "YOUR_KEY" --project ScoreGuru.Api
docker compose up -d   # Redis
dotnet run --project ScoreGuru.Api
curl http://localhost:5000/api/football/scores/live
```

## Build / test results

| Command | Result |
|---------|--------|
| `dotnet build` | Passed (0 warnings) |
| `dotnet test` | Passed (3 tests) |
| `docker compose config` | Valid |

## Token / security notes

- API key is sent only from the backend via `x-apisports-key`.
- Key is never logged or returned to clients.
- React must not call API-SPORTS; no frontend changes in this task.

## Known issues

- **Provider error shapes** — API-SPORTS `errors` JSON varies; we detect rate limits heuristically.
- **Standings** — multiple groups are flattened into one row list (no conference/division panels yet).
- **Statistics** — home/away pairing assumes API returns two team blocks in order.
- **Quota** — real key is subject to API-SPORTS daily limits; use Redis caching to reduce calls.
- **Production without key** — startup fails when resolving `IFootballScoreProvider` (by design).
- **Lineups** — always `null` for MVP.
- **No worker** — no background polling yet (Phase 2).

Full details: `docs/backend/api-sports-integration.md`.

---

**User**

@c:\Users\Admin\.cursor\projects\c-Users-Francis-ScoreGuru\terminals\3.txt:9-13 

---

**Cursor**

The API project is missing `UserSecretsId`. Adding it so `dotnet user-secrets` works.




`ScoreGuru.Api` was missing `UserSecretsId` in its `.csproj`, which `dotnet user-secrets` requires.

I added it to `ScoreGuru.Api.csproj`. User secrets should work now.

Set your real API key from the API project folder:

```bash
cd c:\Users\Francis\ScoreGuru\ScoreGuru\backend\ScoreGuru.Api
dotnet user-secrets set "ApiSports:ApiKey" "your_actual_api_sports_key"
```

You can use the same pattern for Clerk:

```bash
dotnet user-secrets set "Clerk:Authority" "https://YOUR_INSTANCE.clerk.accounts.dev"
```

Secrets are stored outside the repo (under your user profile). They load automatically when you run the API in **Development**. Replace `YOUR_KEY` with your real key if you only ran the placeholder command from the docs.

The `ScoreGuru.Api.csproj` setup looks correct. The important line is:

```xml
<UserSecretsId>scoreguru-api-7c4f9a2e-1b3d-4e8f-9a6c-2d5e8f1a4b7c</UserSecretsId>
```

That enables `dotnet user-secrets` for this project without putting keys in the repo.

**Next step** — set your real API-SPORTS key (replace the placeholder if you used `YOUR_KEY`):

```bash
cd c:\Users\Francis\ScoreGuru\ScoreGuru\backend\ScoreGuru.Api
dotnet user-secrets set "ApiSports:ApiKey" "your_actual_key_here"
```

Then run the API and test:

```bash
dotnet run
curl http://localhost:5000/api/football/scores/live
```

If the key is valid, the response header should be `X-ScoreGuru-Data-Source: api-sports`. If you're in Development with no key and mock mode on, it will be `mock`.

---

**User**

@c:\Users\Admin\.cursor\projects\c-Users-Francis-ScoreGuru\terminals\2.txt:86-87 

---

**Cursor**

Investigating the 503 from the live scores endpoint — checking API configuration, client error handling, and recent logs.




User secrets override `appsettings.Development.json`. The stored value `your_actual_key_here` is overriding your real key, causing API-SPORTS to reject requests. Fixing configuration and improving dev error details.




The **503** is almost certainly a **bad API key**. User secrets are overriding your `appsettings` value.

## What’s happening

Configuration load order in Development (last wins):

1. `appsettings.json`
2. `appsettings.Development.json`
3. **User secrets** ← this wins

Your user secrets currently have:

```text
ApiSports:ApiKey = your_actual_key_here
```

That placeholder overrides any key in `appsettings.Development.json`, so API-SPORTS returns **401/403**, and the API responds with 503.

## Fix

**Option A — use your real API-SPORTS key (recommended)**

```bash
cd c:\Users\Francis\ScoreGuru\ScoreGuru\backend\ScoreGuru.Api
dotnet user-secrets set "ApiSports:ApiKey" "paste_your_real_key_here"
dotnet run
```

Then test:

```bash
curl -i http://localhost:5000/api/football/scores/live
```

Look for: `X-ScoreGuru-Data-Source: api-sports`

**Option B — use mock data (no key)**

```bash
dotnet user-secrets remove "ApiSports:ApiKey"
```

With `UseMockDataWhenMissingKey: true` in Development, you should get mock data and:

`X-ScoreGuru-Data-Source: mock`

## Security note

An API key was in `appsettings.Development.json`. I cleared it there — **use user secrets only**. If that key was committed to git, rotate it in the API-SPORTS dashboard.

## After restart

If the key is still wrong, the error message should now say:

> Sports data provider rejected the API key. Check ApiSports:ApiKey in user secrets.

Restart the API after updating secrets (`Ctrl+C`, then `dotnet run`).

---

**User**

@c:\Users\Admin\.cursor\projects\c-Users-Francis-ScoreGuru\terminals\2.txt:98-100 

---

**Cursor**

The API key is being rejected by API-SPORTS. Checking configuration and verifying the request format.




The user secret is still the literal placeholder `your_actual_key_here`, which overrides `appsettings.Development.json`. Removing the exposed key from appsettings and clarifying the fix:




The error is expected: **user secrets still contain the placeholder**, not your real API-SPORTS key.

```text
ApiSports:ApiKey = your_actual_key_here   ← invalid literal string
```

That value **overrides** `appsettings.Development.json`, so API-SPORTS returns 401/403.

## Fix (pick one)

### 1. Set your real key (from [dashboard.api-football.com](https://dashboard.api-football.com) → Account → My Access)

```bash
cd c:\Users\Francis\ScoreGuru\ScoreGuru\backend\ScoreGuru.Api
dotnet user-secrets set "ApiSports:ApiKey" "PASTE_YOUR_REAL_KEY_FROM_DASHBOARD"
dotnet run
```

Then:

```bash
curl -i http://localhost:5000/api/football/scores/live
```

Use the key from the dashboard — **not** the text `your_actual_key_here`.

### 2. Use mock data instead (no key)

```bash
dotnet user-secrets remove "ApiSports:ApiKey"
dotnet run
```

With `UseMockDataWhenMissingKey: true`, you should get sample data and `X-ScoreGuru-Data-Source: mock`.

## Verify the key directly (optional)

```bash
curl -i "https://v3.football.api-sports.io/status" -H "x-apisports-key: YOUR_REAL_KEY"
```

If that returns 403, the key is wrong, expired, or from RapidAPI (different headers — ScoreGuru expects **api-football.com / api-sports.io** keys with `x-apisports-key`).

## Security

Do not put API keys in `appsettings.Development.json` (they can be committed to git). I cleared `ApiKey` there again — keep it only in user secrets.

After updating secrets, **restart** the API (`Ctrl+C`, then `dotnet run`).

---

**User**

@c:\Users\Admin\.cursor\projects\c-Users-Francis-ScoreGuru\terminals\2.txt:16-17 

---

**Cursor**

The API key appears accepted; the provider is returning errors in the response body. Investigating the live-fixtures request and error handling.




Identifying the bug: API-SPORTS returns `"errors":[]` on success; our code treats any non-object `errors` value (including empty arrays) as an error.




Found and fixed a bug in our code — your API key is valid.

## Cause

API-SPORTS returns `"errors":[]` on **successful** responses. Our parser treated any non-object `errors` value as a failure, so an empty array was misread as an error even when live fixtures data was returned.

## Fix

Updated `ApiSportsEnvelope.HasErrors` to treat:
- `errors: []` → success  
- `errors: { ... }` with entries → failure  

## What you should do

1. **Restart the API** (stop `dotnet run`, start again).
2. Test:

```bash
curl -i http://localhost:5000/api/football/scores/live
```

You should get JSON with game data and:

`X-ScoreGuru-Data-Source: api-sports`

Your key is working (status endpoint confirmed Free plan, 100 requests/day). The live endpoint returns 68 fixtures when called directly.

---

**User**

Now connect the ScoreGuru React frontend score pages to the .NET backend football endpoints.

Read and follow:
- .cursor/rules/scoreguru-master-prompt.mdc
- docs/design/mvp-design-system.md
- docs/backend/backend-foundation.md
- docs/backend/api-sports-integration.md

Architecture rules:
- React must call only the ScoreGuru .NET API.
- React must never call API-SPORTS directly.
- API-SPORTS keys must never be exposed to the frontend.
- Use RTK Query for backend calls.
- Use existing ScoreGuru design tokens and components.
- Do not build advanced Statistics Hub.
- Do not build favorites persistence yet.
- Do not build notification alerts.
- Do not add random UI libraries.
- Keep the MVP clean and score-focused.

Frontend project:
- ScoreGuru/scoreguru-web

Backend endpoints already available:
- GET /api/sports
- GET /api/football/leagues?country=&season=
- GET /api/football/scores/live
- GET /api/football/scores/today?date=&league=&season=
- GET /api/football/games/{gameId}
- GET /api/football/standings?league=&season=
- GET /api/football/teams?league=&season=&country=

Tasks:

1. Add sports DTO types in frontend.

Create or update:
- src/services/types/sportsTypes.ts

Include types matching backend DTOs:
- SportDto
- LeagueDto
- TeamDto
- GameSummaryDto
- GameDetailsDto
- GameEventDto
- GameStatisticDto
- StandingRowDto
- LeagueStandingsDto

2. Extend RTK Query API.

Update:
- src/services/scoreGuruApi.ts

Add endpoints:
- getSports
- getFootballLeagues
- getLiveFootballScores
- getTodayFootballScores
- getFootballGameDetails
- getFootballStandings
- getFootballTeams

Use existing base query with Clerk token support.
These sports endpoints should work even when signed out.

3. Create score-related components.

Create:
- src/components/scores/SportCategoryChip.tsx
- src/components/scores/ScoreFilterBar.tsx
- src/components/scores/LeagueGroupHeader.tsx
- src/components/scores/GameScoreCard.tsx
- src/components/scores/LiveBadge.tsx
- src/components/scores/StatusBadge.tsx
- src/components/scores/GameScoreSkeleton.tsx

Rules:
- Use cr-* Tailwind tokens only.
- No hardcoded random colors.
- Live uses cr-orange.
- Primary/selected uses cr-purple.
- Cards must support light and dark themes.
- Score numbers use font-jakarta and tabular numbers.
- Game cards should link to /games/{gameId}.

4. Create standings components.

Create:
- src/components/standings/StandingsTable.tsx
- src/components/standings/MobileStandingsTable.tsx
- src/components/standings/FormIndicatorChips.tsx

Rules:
- Desktop uses table layout.
- Mobile uses readable compact layout.
- Do not squeeze full desktop table into mobile.
- Use football columns for now:
  Pos, Team, P, W, D, L, GF, GA, GD, Pts, Form.

5. Create game details components.

Create:
- src/components/games/GameHeader.tsx
- src/components/games/GameTabs.tsx
- src/components/games/GameTimeline.tsx
- src/components/games/TeamStatsComparison.tsx
- src/components/games/GameDetailsPanel.tsx

Game details tabs:
- Summary
- Live
- Stats
- Details

Rules:
- Use football-aware statistics labels only.
- Do not show basketball labels on football games.
- If events/statistics are missing, show EmptyState.
- Keep lineups null/empty for MVP.

6. Update HomePage.

Home should show:
- Hero card with live count
- Sport chips, football selected for now
- Date selector placeholder or today selector
- Live games grouped by league
- Trending placeholder section using yellow accent
- Standings preview placeholder or a simple standings card if league/season selected
- Loading skeleton
- Empty state
- Error retry state

Use:
- getLiveFootballScores
- optionally getTodayFootballScores for today feed

7. Update Live Scores page.

The Live Scores page should show:
- Segmented filters: All, Live, Upcoming, Finished
- Sport chip row with Football selected
- Date control placeholder
- Games grouped by league
- Loading skeleton
- Empty state
- Error retry

For MVP:
- Live tab uses getLiveFootballScores.
- All/Upcoming/Finished can use getTodayFootballScores and filter client-side by status/statusShort where reasonable.
- Keep filtering simple.

8. Update Leagues page.

The Leagues page should:
- Use getFootballLeagues
- Show league cards/list
- Support basic season input/select placeholder
- Each league links to /leagues/{leagueId}
- Keep country/season filters simple for now

9. Update League Details placeholder route.

For /leagues/:leagueId:
- Replace placeholder with basic League Details page
- Load today scores filtered by league if possible
- Show league header using available league data if available
- Show tabs:
  - Games
  - Standings
  - Teams
- For standings tab, require or default season.
- For teams tab, call getFootballTeams with league and season when available.
- If season is missing, show a clear season-required state.

10. Update Standings page.

The Standings page should:
- Provide simple league and season inputs/selectors.
- Default to a known mock/dev league and season if no selection exists.
- Call getFootballStandings.
- Render StandingsTable on desktop and MobileStandingsTable on mobile.
- Show loading, empty, and error states.

Use default values that work with mock provider:
- league=39
- season=2024

11. Update Game Details route.

For /games/:gameId:
- Replace placeholder with real Game Details page.
- Call getFootballGameDetails.
- Render:
  - GameHeader
  - Tabs
  - Summary
  - Live timeline
  - Stats comparison
  - Details panel
- Show loading, empty, and error states.

12. Search page minimal integration.

Keep Search page simple:
- Search leagues from loaded football leagues client-side.
- Search teams only if teams data is available.
- Do not build global backend search yet.
- Do not call API-SPORTS directly.

13. Developer diagnostics.

If the backend returns X-ScoreGuru-Data-Source header as mock or api-sports:
- Do not make this part of public UI.
- Optional: log in development only if easy.
- Do not expose confusing debug labels to normal users.

14. Error handling.

Every data page must have:
- Loading state
- Empty state
- Error retry state

Do not show raw backend exception details.

15. Do not implement:
- Favorites persistence
- Team details full page
- Player details full page
- Advanced Statistics Hub
- Push notifications
- Multi-sport providers
- Background worker polling

After implementation, run:
Frontend:
- npm run build
- npm run lint

Backend:
- dotnet build
- dotnet test

Then provide:
- Files created or modified
- Pages connected to backend
- Components created
- How to test using mock provider
- How to test using real API-SPORTS key
- Build/lint/test results
- Known issues

---

**Cursor**

Connecting the frontend score pages to the backend football API. Exploring the existing frontend structure.




Implementing systematically: creating types, API endpoints, utilities, components, and pages.




The React score experience is wired to the ScoreGuru football API via RTK Query.

## Pages connected to backend

| Page | Route | Endpoints |
|------|-------|-----------|
| Home | `/` | Live scores, today scores, standings preview (39/2024) |
| Live Scores | `/live`, `/live-scores` | Live + today (filtered by segment) |
| Leagues | `/leagues` | `getFootballLeagues` |
| League Details | `/leagues/:leagueId` | Today by league, standings, teams |
| Standings | `/standings` | `getFootballStandings` (default 39/2024) |
| Game Details | `/games/:gameId` | `getFootballGameDetails` |
| Search | `/search` | Leagues client-side; teams when searching |

Still placeholders: Teams, Players, Favorites (unchanged).

## Files created

**Types & API**
- `src/services/types/sportsTypes.ts`
- `src/features/scores/sportsUtils.ts`
- `src/features/scores/ScoresDataStates.tsx`
- `src/features/scores/ScoresByLeague.tsx`

**Score components**
- `SportCategoryChip`, `ScoreFilterBar`, `LeagueGroupHeader`, `GameScoreCard`, `LiveBadge`, `StatusBadge`, `GameScoreSkeleton`

**Standings**
- `StandingsTable`, `MobileStandingsTable`, `FormIndicatorChips`

**Games**
- `GameHeader`, `GameTabs`, `GameTimeline`, `TeamStatsComparison`, `GameDetailsPanel`

**Pages**
- `LiveScoresPage.tsx`, `LeaguesPage.tsx`, `LeagueDetailsPage.tsx`, `GameDetailsPage.tsx`, `StandingsPage.tsx`, `SearchPage.tsx` (rewritten `HomePage.tsx`)

## Files modified

- `src/services/scoreGuruApi.ts` — 7 sports endpoints
- `src/services/scoreGuruBaseQuery.ts` — dev-only `X-ScoreGuru-Data-Source` console debug
- `src/pages/MvpPages.tsx`, `src/AppRoutes.tsx`

## How to test

**Mock provider** (no API key, Development):
```bash
dotnet user-secrets remove "ApiSports:ApiKey" --project ScoreGuru.Api
dotnet run --project ScoreGuru/backend/ScoreGuru.Api
cd scoreguru-web && npm run dev
```
- Live: `/live` — mock games with `(Mock)` in names  
- Game: `/games/100001`  
- Standings: league `39`, season `2024`  

**Real API-SPORTS key**:
```bash
dotnet user-secrets set "ApiSports:ApiKey" "YOUR_KEY" --project ScoreGuru.Api
```
- Open `/`, `/live`, `/games/{id}` — real fixtures  
- DevTools console: `[ScoreGuru] data source: api-sports` (not shown in UI)

Ensure `VITE_SCOREGURU_API_BASE_URL=http://localhost:5000/api` in `.env`.

## Build / test results

| Command | Result |
|---------|--------|
| `npm run build` | Passed |
| `npm run lint` | Passed |
| `dotnet build` | Passed |
| `dotnet test` | 5 passed |

## Known issues

- **Free API quota** — 100 requests/day; live polling every 30s on Home/Live/Game can use quota quickly.
- **League details** — league header comes from leagues list; may be sparse if league isn’t in that response.
- **Search teams** — only searches teams for league `39` / season `2024` when query is non-empty.
- **Standings/League filters** — numeric league ID inputs (not dropdowns).
- **Team/Player routes** — still placeholders; cards link to `/teams/:id` but page isn’t built.
- **Date selector** — shows today string; no calendar picker yet.


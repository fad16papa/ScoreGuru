# ScoreGuru — Production MVP design system & screen set

This document refines the **Stitch-generated** mockups in `docs/_stitch_extract/` into a **single, implementation-ready** system for React + Tailwind (`darkMode: 'class'`). It **preserves** the purple / orange / yellow sports identity and **replaces** inconsistent Material-style tokens (e.g. `primary: #ddb8ff`, `background: #0c1322`) with the **official ScoreGuru palette** below.

**Stitch inventory (reference only):** Web/mobile dual-theme screens for Home, Live Scores, Game, League, Standings, Search, Favorites, Team, Player; plus **Statistics Hub** mockups — those are **Phase 2** (see §13).

---

## 1. Refinement summary (Stitch → production)

| Area | Stitch pattern | Production refinement |
|------|----------------|------------------------|
| Color naming | M3 names (`surface-container`, `on-surface`, mixed hues) | Semantic **`cr-*`** tokens + CSS variables; **one** primary brand `#9333EA` |
| Dark background | `#0c1322` in HTML config | Official **`#0B1020`** (`--cr-bg-dark`) |
| Light “primary” | Light lavender as `primary` | **`#9333EA`** for brand/actions; use **`cr-primary-fg-on-primary`** (white) on filled buttons |
| Live / highlight | Orange/yellow scattered | **Orange** = live/urgent only; **Yellow** = featured/highlight/trending only |
| Sidebar / nav | Slightly inconsistent item order | **Fixed web sidebar order** (§8); **fixed mobile bottom nav** (§9) |
| Tables on mobile | Some dense layouts | **Sticky team column** or **card/hybrid** standings; no raw desktop tables |
| Statistics Hub | Present in zip | **Out of MVP** — placeholder cards only where needed |

---

## 2. Foundations

### 2.1 Official color tokens (CSS variables)

Use these **exact** values everywhere (Tailwind maps to them in §14).

**Brand & accents**

```css
--cr-purple: #9333ea;
--cr-purple-dark: #7e22ce;
--cr-orange: #f97316;
--cr-yellow: #eab308;
```

**Light theme**

```css
--cr-bg-light: #f6f7fb;
--cr-surface-light: #ffffff;
--cr-text-dark: #111827;
--cr-muted: #6b7280;
--cr-border-light: #e5e7eb; /* soft gray; not in master list — structural only */
```

**Dark theme**

```css
--cr-bg-dark: #0b1020;
--cr-surface-dark: #111827;
--cr-surface-dark-2: #1f2937;
--cr-border-dark: #374151;
--cr-text-light: #f9fafb;
--cr-muted-dark: #9ca3af;
```

**Semantic usage (non‑negotiable)**

- **Primary actions / brand:** `cr-purple`; **hover / active / pressed / selected nav:** `cr-purple-dark`.
- **Live badges, live pulse, real-time status, urgent:** `cr-orange` only.
- **Trending, featured match, important stat callout:** `cr-yellow` (sparingly).
- **Body text:** `cr-text-dark` (light) / `cr-text-light` (dark).
- **Secondary text:** `cr-muted` / `cr-muted-dark`.
- **Page background:** `cr-bg-light` / `cr-bg-dark`.
- **Cards:** `cr-surface-light` (light) / `cr-surface-dark` (dark).
- **Inset rows, nested panels, chips on dark:** `cr-surface-dark-2`.
- **Borders:** `cr-border-light` (light) / `cr-border-dark` (dark).

### 2.2 Typography

**Font stacks**

- **Display / headings / scores (tension):** Plus Jakarta Sans (`font-jakarta` in Tailwind).
- **UI body / tables / labels:** Inter (`font-inter`).

**Scale (align all screens to this)**

| Role | Font | Size / line-height | Weight |
|------|------|-------------------|--------|
| Page title | Plus Jakarta Sans | 24px / 1.2 (desktop 28–32px optional) | 700 |
| Section title | Plus Jakarta Sans | 18–20px / 1.3 | 600–700 |
| Card title | Plus Jakarta Sans | 16px / 1.35 | 600 |
| Body | Inter | 14px / 1.5 | 400–500 |
| Body large | Inter | 16px / 1.6 | 400 |
| Metadata / captions | Inter | 12–13px / 1.4 | 400 |
| Label (uppercase tracking) | Inter | 11–12px / 1.2, tracking `0.06em` | 600–700 |
| **Score (match row)** | Plus Jakarta Sans | 22–28px / 1 | 700–800 |
| **Score (hero header)** | Plus Jakarta Sans | 40–56px / 1 | 800 |
| Table cell | Inter | 13px / 1.35 | 400–500 (tabular nums) |

**Rules**

- Enable **tabular numbers** for scores, standings, and stat rows (`font-variant-numeric: tabular-nums`).
- **Team names:** `text-base font-semibold` (mobile), `text-body` + semibold on desktop rows.
- **Never** mix sport-specific stat labels in one row without a **sport context** (see §12).

### 2.3 Spacing (4px base)

Map to Tailwind as **multiples of 1 = 4px**: `1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48`.

**Canonical padding**

- **Cards:** `p-4` (16px); dense list cards `p-3` (12px) on mobile only.
- **Page horizontal gutter:** `px-4` mobile, `px-6` tablet, `px-8` desktop.
- **Vertical section gap:** `space-y-4` to `space-y-6`.
- **List row min height:** **≥ 44px** touch target on mobile (`min-h-11` or `py-3` + content).

### 2.4 Radius

- **sm:** 6px (`rounded-md`) — inputs, small chips.
- **md:** 10px (`rounded-lg`) — buttons, badges.
- **lg:** 12px (`rounded-xl`) — cards.
- **full:** pills / avatars — `rounded-full`.

Use **one** default card radius per platform build (recommend **12px**).

### 2.5 Shadows & borders

**Light**

- Cards: `border border-cr-border-light shadow-sm` or `shadow-[0_4px_12px_rgba(0,0,0,0.05)]`.
- **No** heavy shadows on dense feeds.

**Dark**

- Prefer **border** over shadow: `border border-cr-border-dark`.
- Optional subtle glow on **live** hero only: `shadow-[0_0_0_1px_rgba(249,115,22,0.25)]` (use rarely).

### 2.6 Icon rules

- Library: **Material Symbols Outlined** (matches Stitch); stroke default, **FILL=1** for active nav & favorited star.
- Size: **20px** inline in rows; **24px** in header/toolbar; **16px** in compact chips.
- Color: inherit `text-cr-muted` / `text-cr-text-*`; primary actions `text-cr-purple`; live `text-cr-orange`.

---

## 3. Components (library spec)

Each component is **one React component** with **variant props** — avoid one-off screen duplicates.

### 3.1 AppHeader (web)

- **Height:** 56px (`h-14`).
- **Zones:** leading menu (tablet only) | logo wordmark (mobile) | **SearchInput** (flex-1, max-w-xl) | **DateSelector** | **ThemeToggle** | **NotificationBadgePlaceholder** | avatar / Clerk `UserButton`.
- **Background:** `bg-cr-surface-light dark:bg-cr-surface-dark`; **border-b** token border.

### 3.2 WebSidebar

- **Width:** 256px (`w-64`); sticky full height.
- **Items:** Home, Live Scores, Leagues, Standings, Teams, Players, Favorites, Settings (§8).
- **Active row:** `bg-cr-purple/10 dark:bg-cr-purple/15 border-l-2 border-cr-purple` + `text-cr-purple dark:text-cr-text-light`.
- **Hover:** `hover:bg-cr-bg-light dark:hover:bg-cr-surface-dark-2`.

### 3.3 MobileHeader

- **Height:** 48–52px; **compact**; optional back chevron.
- **Title** center or left; actions: search icon, calendar, overflow.

### 3.4 MobileBottomNav

- **Height:** 56px + safe-area; **5 items** (§9).
- **Active:** `text-cr-purple` + filled icon.
- **Inactive:** `text-cr-muted dark:text-cr-muted-dark`.

### 3.5 SportCategoryChip

- Horizontal **scroll** (`overflow-x-auto`, hide scrollbar).
- **States:** default, selected (`bg-cr-purple text-white`), muted “More”.
- **Min touch:** 44px height.

### 3.6 DateSelector

- **Web:** popover calendar + chevrons (prev/next day).
- **Mobile:** compact chip opening **BottomSheet** with calendar.

### 3.7 LeagueGroupHeader

- **Row:** league crest `size-6` | name + country/sport metadata | chevron to league.
- **Sticky** optional on long lists (`sticky top-14 z-10 bg-cr-bg-light/95 dark:bg-cr-bg-dark/95 backdrop-blur`).

### 3.8 GameScoreCard

- **Layout:** 3 columns — home (logo + name) | **score / time** | away (logo + name).
- **Meta row:** status + `LiveBadge` / `StatusBadge` + minute if live.
- **FavoriteButton** top-right.

### 3.9 TeamLogoAvatar / PlayerAvatar

- Sizes: **sm 24**, **md 32**, **lg 40**; `rounded-lg` for team, `rounded-full` for player.
- Fallback: monogram in `bg-cr-surface-dark-2` / neutral border.

### 3.10 LiveBadge

- Pill: `bg-cr-orange text-white text-xs font-bold uppercase tracking-wide`.
- Optional **pulse dot** `bg-white/90 animate-pulse`.

### 3.11 StatusBadge

- Variants: `scheduled`, `live`, `finished`, `postponed`, `canceled`.
- **Live** delegates to LiveBadge styling; finished = neutral outline.

### 3.12 FavoriteButton

- Icon-only; **44x44** hit area; `aria-pressed` for favorites.

### 3.13 StatisticComparisonRow (sport-aware)

- Label (e.g. “Possession %” for football) | home bar/value | away bar/value.
- **Data from context:** `sport` prop switches label set (§12).

### 3.14 StandingsTable (web)

- **Row height:** 40–44px; zebra optional **subtle** `even:bg-cr-bg-light/50 dark:even:bg-cr-surface-dark-2/40`.
- **Columns (football example):** Pos | Team | P | W | D | L | GF | GA | GD | Pts | Form | Δ.
- **Form:** `FormIndicatorChips` max 5; **movement** ▲▼ in muted color.

### 3.15 MobileStandingsTable

- **Pattern A:** first column **sticky** (`sticky left-0 z-10 bg-inherit`) Team + pos.
- **Pattern B:** **card per team** with key cols + expand for form.
- **Breakpoint:** < `md` use mobile component; never shrink desktop table below readability.

### 3.16 PlayerStatsCard / TeamStatsCard

- Title + grid of **2–4 KPIs** only for MVP; **yellow** accent for “key” stat highlight.

### 3.17 EmptyStateCard / ErrorState / LoadingSkeleton

- **Empty:** illustration optional; title + one line + primary CTA.
- **Error:** `text-red-600 dark:text-red-400` + retry; no raw API errors.
- **Skeleton:** match **GameScoreCard** layout (3 columns) and **table** header rows.

### 3.18 FilterDropdown & BottomSheetFilters (mobile)

- **Bottom sheet** stacks: Status filter, Sport, League; primary **Apply** sticky footer.

### 3.19 SearchInput

- Full-width on search route; leading search icon; clear button.

### 3.20 TabNavigation / SegmentedControl

- **Tabs** for screen sections (underline `border-cr-purple`).
- **Segmented** for **All / Live / Upcoming / Finished / Favorites** filters.

### 3.21 NotificationBadgePlaceholder

- Bell icon + small `bg-cr-orange` dot (no MVP behavior).

### 3.22 ChartCardPlaceholder (Phase 2)

- Dashed border, “Charts coming soon” muted — **no real chart** in MVP.

### 3.23 TimelineEventItem

- Time | icon | text (goal, card, sub); vertical rail `border-l border-cr-border-*`.

### 3.24 FormIndicatorChips

- `W D L` pills; win=`cr-purple/15`, loss=`opacity-60`, draw=neutral.

### 3.25 Pagination / LoadMore

- MVP: **Load more** button full-width mobile; desktop optional page numbers for standings only.

### 3.26 ThemeToggle

- **Three-way** in Settings: Light | Dark | System (system uses `prefers-color-scheme` + `class` on `<html>` when user overrides).
- **Header toggle:** cycles Light/Dark only for quick access OR opens settings — pick one in implementation and stay consistent.

---

## 4. Responsive breakpoints

| Token | Min width | Usage |
|-------|-----------|--------|
| `sm` | 640px | 2-col where needed |
| `md` | 768px | **Sidebar appears**; mobile nav hidden |
| `lg` | 1024px | Comfortable table standings |
| `xl` | 1280px | Max content `max-w-7xl` center |

**Tablet:** treat as `md`–`lg`: sidebar + **collapsible** right rail if ever used.

---

## 5. Web information architecture

### 5.1 Home Dashboard

- **Hero stats:** “**X** live now” (orange dot) + date.
- **SportCategoryChip** row + **DateSelector**.
- **Live games** grouped by **LeagueGroupHeader**.
- **Trending** horizontal list (`cr-yellow` pin on 1 featured).
- **Favorite leagues** compact cards.
- **Standings preview:** top 5, single league selector — link to full Standings.

### 5.2 Live Scores

- Filters: sport, date, league, status (**SegmentedControl** + **FilterDropdown**).
- Feed: sport → league → **GameScoreCard** list.
- States: skeleton grid, empty (“No matches”), error retry.

### 5.3 Game Details

- **Header:** crests, names, **hero scores**, status/time.
- **Tabs:** Summary | Live | Stats | Details.
- **Summary:** key facts + timeline preview.
- **Live:** full **TimelineEventItem** list.
- **Stats:** **StatisticComparisonRow** (sport-aware).
- **Details:** venue, officials, competition — text only MVP.

### 5.4 League Details

- Header: logo, name, country, sport, **season** select.
- **Tabs:** Games | Standings | Teams | Players.
- Games grouped **by date**; **standings preview** block; teams list simple table/cards.

### 5.5 Standings

- League + season selectors; **Tabs:** Overall | Home | Away | Form (**Conference / Division** tabs appear only when API provides structure).
- Full **StandingsTable**; movement + form.

### 5.6 Search Results

- **SearchInput** persistent; grouped: Leagues, Teams, Players, Games.
- Recent searches chips; empty state.

### 5.7 Favorites

- Sections: Teams, Leagues, Players, Games (grid/list).
- **Alerts placeholder** card (Phase 2) with **ChartCardPlaceholder**-style dashed panel — copy: “Notifications coming soon”.

### 5.8 Team Details (basic)

- **TeamHeader** + league/country; **TeamForm**; **upcoming** / **recent** **GameScoreCard** lists; **TeamStatsCard** MVP metrics.

### 5.9 Player Details (basic)

- **PlayerHeader**; team, position, country, age; **PlayerStatsCard**; recent games list — **no** career analytics.

---

## 6. Mobile screen mapping

Same routes as web; layout differs:

- **Scores Home:** chips + segmented filters **sticky**; league groups; bottom nav.
- **Live tab:** same cards but filtered to live.
- **Game / League / Standings / Search / Favorites / Team / Player:** compact headers; filters in **BottomSheetFilters**.
- **Standings:** **MobileStandingsTable** only.

---

## 7. Navigation flow (diagram)

```text
                    ┌─────────────┐
                    │  Home / Web │
                    └──────┬──────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     ▼                     ▼                     ▼
 Live Scores           League Details        Standings
     │                     │                     │
     └──────────┬──────────┴──────────┬──────────┘
                ▼                     ▼
           Game Details          Team / Player
                │                     │
                └──────────┬──────────┘
                          ▼
                      Search ──► Favorites
                          │
                    Settings (theme: Light | Dark | System)
```

**Mobile bottom nav routes:** Scores (home feed) | Live | Leagues (hub or first league) | Search | Favorites. **Settings** via header gear or profile — not in bottom bar.

---

## 8. Web sidebar order (final)

1. Home  
2. Live Scores  
3. Leagues  
4. Standings  
5. Teams  
6. Players  
7. Favorites  
8. Settings  

Align Stitch mocks that omit “Teams/Players/Settings” — **add** these entries for MVP IA consistency.

---

## 9. Mobile bottom navigation (final)

1. Scores  
2. Live  
3. Leagues  
4. Search  
5. Favorites  

**Thumb zone:** primary tap targets **≥ 44px**; label font `text-[11px]` uppercase optional.

---

## 10. Core filter tabs & sport chips

**Segmented filters:** All | Live | Upcoming | Finished | Favorites.

**Sport chips:** Football, Basketball, Tennis, Baseball, Cricket, Hockey, Volleyball, Esports, More — horizontal scroll, **no wrap** on mobile.

---

## 11. Interaction notes

- **Live scores:** subtle auto-refresh (implementation: RTK Query polling); **orange** pulse on score change optional Phase 2.
- **DateSelector:** changing date resets list scroll to top.
- **Favorites:** optimistic UI with rollback on error.
- **Search:** debounced input 300ms; recent stored locally (not Clerk).
- **Theme:** `localStorage` key e.g. `scoreguru-theme: light|dark|system`; system listeners on `matchMedia`.
- **Accessibility:** badges not color-only — include text “Live”, “FT”, etc.

---

## 12. Sport-specific statistics (strict)

| Sport | Example comparison labels |
|-------|---------------------------|
| Football / Soccer | Possession, Shots, Shots on target, Corners, Fouls, Cards |
| Basketball | PTS, REB, AST, STL, BLK, FG%, 3P% |
| Tennis | Aces, DFs, 1st serve %, Break points |
| Baseball | H, R, E, LOB, Pitch count (if available) |
| Cricket | Runs, Wickets, Overs, RR |

**Rule:** `GameDetails` stats tab **must** receive `sportKey` from API; UI maps to the correct label set — **never** show basketball headers on a football match.

---

## 13. Phase 2 (explicitly out of MVP UI scope)

Defer detailed design for:

- Advanced Statistics Hub (Stitch: `web_statistics_hub_dual_theme`, `mobile_statistics_hub_dual_theme`)
- Advanced player / team analytics
- Alert preference management & push screens
- Performance trend charts
- Advanced conference / division side panels
- Deep personalized alerts

**MVP allowance:** a single **ChartCardPlaceholder** and **notification placeholder** only.

---

## 14. React + Tailwind implementation notes

### 14.1 Tailwind `theme.extend` mapping (reference)

Define colors as **CSS variable-backed** utilities so themes stay one source of truth:

```ts
// tailwind.config.ts (excerpt)
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cr-purple': 'var(--cr-purple)',
        'cr-purple-dark': 'var(--cr-purple-dark)',
        'cr-orange': 'var(--cr-orange)',
        'cr-yellow': 'var(--cr-yellow)',
        'cr-bg-light': 'var(--cr-bg-light)',
        'cr-surface-light': 'var(--cr-surface-light)',
        'cr-text-dark': 'var(--cr-text-dark)',
        'cr-muted': 'var(--cr-muted)',
        'cr-border-light': 'var(--cr-border-light)',
        'cr-bg-dark': 'var(--cr-bg-dark)',
        'cr-surface-dark': 'var(--cr-surface-dark)',
        'cr-surface-dark-2': 'var(--cr-surface-dark-2)',
        'cr-border-dark': 'var(--cr-border-dark)',
        'cr-text-light': 'var(--cr-text-light)',
        'cr-muted-dark': 'var(--cr-muted-dark)',
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

**`globals.css`:** set `:root { ... }` and `.dark { ... }` with the variables from §2.1. Add **`--cr-surface-light: #ffffff`** and **`--cr-border-light`** if not already present.

### 14.2 Component file naming (suggested)

`src/components/layout/AppHeader.tsx`, `WebSidebar.tsx`, `MobileBottomNav.tsx`, `MobileHeader.tsx`, …  
`src/components/scores/GameScoreCard.tsx`, `LeagueGroupHeader.tsx`, …

### 14.3 State

- **Redux Toolkit:** UI theme preference, selected date, filter segment, selected sport chip, layout drawer open — **not** server cache.
- **RTK Query:** all ScoreGuru API; **Clerk** token via `prepareHeaders`.

### 14.4 Avoid

- Ad-hoc hex in JSX except **transient** experiments — use `cr-*` tokens.
- Layouts that need `position: absolute` chains for basic flex — prefer **flex + gap**.
- Duplicate Stitch **M3** tokens (`on-surface`, `surface-container`) in new code — migrate to `cr-*`.

---

## 15. Light vs dark screen checklist

For **each** MVP screen, design & QA both themes:

- Background / surface / border contrast passes for text.
- **Orange** on dark: maintain **white** text on orange badges.
- **Yellow** used **only** for highlights — never body text at small sizes on light background (contrast).
- Focus rings visible: `ring-2 ring-cr-purple/40`.

---

## 16. Source mockups

- **Extracted Stitch assets:** `docs/_stitch_extract/stitch_scoreguru_design_system_mockups/`
- **Authoritative spec:** this document supersedes token values in HTML exports where they conflict.

---

*End of MVP design system — ready for implementation in React, Tailwind, Redux Toolkit, RTK Query, Clerk, and ScoreGuru .NET APIs.*

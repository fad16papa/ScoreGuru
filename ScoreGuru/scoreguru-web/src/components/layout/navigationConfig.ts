import {
  iconFavorites,
  iconHome,
  iconLeagues,
  iconLiveScores,
  iconPlayers,
  iconSearch,
  iconSettings,
  iconStandings,
  iconTeams,
} from './navIcons'
import type { SidebarItem } from './WebSidebar'
import type { BottomNavItem } from './MobileBottomNav'

export const sidebarNav: SidebarItem[] = [
  { to: '/', label: 'Home', icon: iconHome },
  { to: '/live-scores', label: 'Live Scores', icon: iconLiveScores },
  { to: '/leagues', label: 'Leagues', icon: iconLeagues },
  { to: '/standings', label: 'Standings', icon: iconStandings },
  { to: '/teams', label: 'Teams', icon: iconTeams },
  { to: '/players', label: 'Players', icon: iconPlayers },
  { to: '/favorites', label: 'Favorites', icon: iconFavorites },
  { to: '/settings', label: 'Settings', icon: iconSettings },
]

export const mobileBottomNav: BottomNavItem[] = [
  { to: '/', label: 'Scores', icon: iconHome },
  { to: '/live-scores', label: 'Live', icon: iconLiveScores },
  { to: '/leagues', label: 'Leagues', icon: iconLeagues },
  { to: '/search', label: 'Search', icon: iconSearch },
  { to: '/favorites', label: 'Favorites', icon: iconFavorites },
]

export const routeTitles: Record<string, string> = {
  '/': 'Scores',
  '/live-scores': 'Live',
  '/leagues': 'Leagues',
  '/standings': 'Standings',
  '/teams': 'Teams',
  '/players': 'Players',
  '/favorites': 'Favorites',
  '/settings': 'Settings',
  '/search': 'Search',
}

/** Mobile header title for known paths; detail segments; unknown paths (404). */
export function getMobileHeaderTitle(pathname: string): string {
  const exact = routeTitles[pathname]
  if (exact) return exact
  if (/^\/games\/[^/]+$/.test(pathname)) return 'Game'
  if (/^\/leagues\/[^/]+$/.test(pathname)) return 'League'
  if (/^\/teams\/[^/]+$/.test(pathname)) return 'Team'
  if (/^\/players\/[^/]+$/.test(pathname)) return 'Player'
  return 'Not found'
}

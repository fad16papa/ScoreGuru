import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import {
  GameDetailPlaceholderPage,
  LeagueDetailPlaceholderPage,
  PlayerDetailPlaceholderPage,
  TeamDetailPlaceholderPage,
} from './pages/DetailPlaceholderPages'
import { HomePage } from './pages/HomePage'
import {
  FavoritesPage,
  LeaguesPage,
  LiveScoresPage,
  PlayersPage,
  SearchPage,
  StandingsPage,
  TeamsPage,
} from './pages/MvpPages'
import { NotFoundPage } from './pages/NotFoundPage'
import { SettingsPage } from './pages/SettingsPage'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/live-scores" element={<LiveScoresPage />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/games/:gameId" element={<GameDetailPlaceholderPage />} />
          <Route path="/leagues/:leagueId" element={<LeagueDetailPlaceholderPage />} />
          <Route path="/teams/:teamId" element={<TeamDetailPlaceholderPage />} />
          <Route path="/players/:playerId" element={<PlayerDetailPlaceholderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

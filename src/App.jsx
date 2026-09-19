import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LibraryProvider } from './store/LibraryContext.jsx';
import { PlayerProvider, usePlayer } from './store/PlayerContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import RightPanel from './components/RightPanel.jsx';
import MiniPlayer from './components/MiniPlayer.jsx';
import MobileNav from './components/MobileNav.jsx';
import NowPlayingOverlay from './components/NowPlayingOverlay.jsx';
import PlaybackNotice from './components/PlaybackNotice.jsx';
import HomePage from './pages/HomePage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import AtmospherePage from './pages/AtmospherePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import LikedSongsPage from './pages/LikedSongsPage.jsx';
import PlaylistsPage from './pages/PlaylistsPage.jsx';
import PlaylistPage from './pages/PlaylistPage.jsx';
import AlbumsLibraryPage from './pages/AlbumsLibraryPage.jsx';
import AlbumPage from './pages/AlbumPage.jsx';
import ArtistsLibraryPage from './pages/ArtistsLibraryPage.jsx';
import ArtistPage from './pages/ArtistPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function Shell() {
  const { currentTrack, panelOpen, auraColors } = usePlayer();
  const showPanel = Boolean(currentTrack && panelOpen);

  // The app's accent color follows the currently playing track's artwork —
  // used sparingly (active nav item, play buttons, progress fills), not as
  // a background wash, per the "dynamic accent, not everything colorful" rule.
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', auraColors.primary);
  }, [auraColors]);

  return (
    <div className={`app-shell ${showPanel ? 'has-panel' : ''}`}>
      <Sidebar />
      <div className="app-main-col">
        <Header />
        <PlaybackNotice />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/atmosphere" element={<AtmospherePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/liked" element={<LikedSongsPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/albums" element={<AlbumsLibraryPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
            <Route path="/artists" element={<ArtistsLibraryPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <MiniPlayer />
        <MobileNav />
      </div>
      {showPanel && <RightPanel />}
      <NowPlayingOverlay />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LibraryProvider>
        <PlayerProvider>
          <Shell />
        </PlayerProvider>
      </LibraryProvider>
    </ErrorBoundary>
  );
}

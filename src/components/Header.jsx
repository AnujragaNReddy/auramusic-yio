import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Bell, PanelRight } from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import './Header.css';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good Night';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

const TITLES = {
  '/': greeting(),
  '/discover': 'Discover',
  '/atmosphere': 'Atmosphere',
  '/liked': 'Liked Songs',
  '/playlists': 'Playlists',
  '/albums': 'Albums',
  '/artists': 'Artists',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isSearchPage = location.pathname.startsWith('/search');
  const [q, setQ] = useState(isSearchPage ? params.get('q') || '' : '');
  const inputRef = useRef(null);
  const { panelOpen, setPanelOpen, currentTrack } = usePlayer();

  useEffect(() => {
    if (isSearchPage) setQ(params.get('q') || '');
  }, [isSearchPage, params]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const title = TITLES[location.pathname] || '';

  return (
    <header className="app-header">
      <div className="app-header-title">
        <h1>{title}</h1>
      </div>

      <form className="app-header-search" onSubmit={handleSubmit}>
        <Search size={16} />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search songs, artists, albums, playlists... (press /)"
        />
      </form>

      <div className="app-header-actions">
        <button className="icon-btn" title="Notifications">
          <Bell size={19} />
        </button>
        {currentTrack && (
          <button
            className={`icon-btn ${panelOpen ? 'active' : ''}`}
            title={panelOpen ? 'Hide player panel' : 'Show player panel'}
            onClick={() => setPanelOpen((v) => !v)}
          >
            <PanelRight size={19} />
          </button>
        )}
        <div className="app-header-avatar">Y</div>
      </div>
    </header>
  );
}

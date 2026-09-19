import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles, Home, Compass, Search, Radio, Heart, ListMusic, Disc3, Mic2, Settings, CircleUserRound,
} from 'lucide-react';
import './Sidebar.css';

const MAIN_LINKS = [
  { to: '/', label: 'Home', icon: Home, match: (p) => p === '/' },
  { to: '/discover', label: 'Discover', icon: Compass, match: (p) => p.startsWith('/discover') },
  { to: '/search', label: 'Search', icon: Search, match: (p) => p.startsWith('/search') },
  { to: '/atmosphere', label: 'Atmosphere', icon: Radio, match: (p) => p.startsWith('/atmosphere') },
];

const LIBRARY_LINKS = [
  { to: '/liked', label: 'Liked Songs', icon: Heart, match: (p) => p.startsWith('/liked') },
  { to: '/playlists', label: 'Playlists', icon: ListMusic, match: (p) => p.startsWith('/playlists') || (p.startsWith('/playlist/')) },
  { to: '/albums', label: 'Albums', icon: Disc3, match: (p) => p.startsWith('/albums') || p.startsWith('/album/') },
  { to: '/artists', label: 'Artists', icon: Mic2, match: (p) => p.startsWith('/artists') || p.startsWith('/artist/') },
];

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/" className="sidebar-logo">
          <Sparkles size={22} />
          <span>AURA</span>
        </Link>
        <p className="sidebar-tagline">Your music atmosphere</p>
      </div>

      <nav className="sidebar-section">
        {MAIN_LINKS.map(({ to, label, icon: Icon, match }) => (
          <Link key={to} to={to} className={`sidebar-link ${match(path) ? 'active' : ''}`}>
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-label">Library</div>
      <nav className="sidebar-section">
        {LIBRARY_LINKS.map(({ to, label, icon: Icon, match }) => (
          <Link key={to} to={to} className={`sidebar-link ${match(path) ? 'active' : ''}`}>
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className={`sidebar-link ${path.startsWith('/settings') ? 'active' : ''}`}>
          <Settings size={19} />
          <span>Settings</span>
        </Link>
        <Link to="/profile" className={`sidebar-link ${path.startsWith('/profile') ? 'active' : ''}`}>
          <CircleUserRound size={19} />
          <span>Profile</span>
        </Link>
      </div>
    </aside>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Search, Radio, Library } from 'lucide-react';
import './MobileNav.css';

const LINKS = [
  { to: '/', label: 'Home', icon: Home, match: (p) => p === '/' },
  { to: '/discover', label: 'Discover', icon: Compass, match: (p) => p.startsWith('/discover') },
  { to: '/search', label: 'Search', icon: Search, match: (p) => p.startsWith('/search') },
  { to: '/atmosphere', label: 'Vibe', icon: Radio, match: (p) => p.startsWith('/atmosphere') },
  { to: '/playlists', label: 'Library', icon: Library, match: (p) => ['/liked', '/playlists', '/albums', '/artists'].some((x) => p.startsWith(x)) },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="mobile-nav">
      {LINKS.map(({ to, label, icon: Icon, match }) => (
        <Link key={to} to={to} className={`mobile-nav-link ${match(pathname) ? 'active' : ''}`}>
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

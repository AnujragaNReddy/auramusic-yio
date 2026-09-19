import './ExploreTiles.css';

const CATEGORIES = [
  { label: 'Bollywood', query: 'Hindi Bollywood songs', size: 'lg', colors: ['#ff6a88', '#3a1c2e'] },
  { label: 'Telugu', query: 'Telugu songs', size: 'md', colors: ['#ffb454', '#5a3410'] },
  { label: 'Tamil', query: 'Tamil songs', size: 'md', colors: ['#4dd0e1', '#0f2b33'] },
  { label: 'Indian', query: 'Indian hit songs', size: 'sm', colors: ['#c9915a', '#3a2718'] },
  { label: 'Pop', query: 'Pop songs', size: 'sm', colors: ['#7c8cff', '#1a1a3a'] },
  { label: 'Hip-Hop', query: 'Hip hop songs', size: 'sm', colors: ['#a855f7', '#241130'] },
  { label: 'Electronic', query: 'Electronic dance songs', size: 'md', colors: ['#4caf7d', '#0e2b1d'] },
  { label: 'Rock', query: 'Rock songs', size: 'sm', colors: ['#ff4d4d', '#2b1010'] },
  { label: 'Lo-Fi', query: 'Lo-fi chill beats', size: 'sm', colors: ['#8d99ae', '#1c1f26'] },
  { label: 'Classical', query: 'Classical music', size: 'sm', colors: ['#e0c68a', '#332c1a'] },
  { label: 'Retro', query: 'Retro classic songs', size: 'sm', colors: ['#ff9770', '#331c14'] },
];

export default function ExploreTiles({ onPick }) {
  return (
    <div>
      <h3 className="search-section-title">Explore</h3>
      <div className="explore-grid">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            className={`explore-tile explore-tile-${c.size}`}
            style={{ '--e1': c.colors[0], '--e2': c.colors[1] }}
            onClick={() => onPick(c.query)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

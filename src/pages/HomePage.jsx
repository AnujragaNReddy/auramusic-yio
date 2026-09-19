import { Link } from 'react-router-dom';
import { Play, Shuffle } from 'lucide-react';
import { getFeaturedAtmosphere } from '../lib/atmospheres.js';
import { MADE_FOR_YOU_WITH_TRACKS } from '../lib/madeForYou.js';
import { CURATED_TRACKS } from '../lib/curatedSongs.js';
import { hasApiKey } from '../api/youtube.js';
import { useLibrary } from '../store/LibraryContext.jsx';
import { usePlayer } from '../store/PlayerContext.jsx';
import CollectionCard from '../components/CollectionCard.jsx';
import SongRow from '../components/SongRow.jsx';
import RecentCard from '../components/RecentCard.jsx';
import './HomePage.css';

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const QUICK_PICKS = CURATED_TRACKS.slice(0, 8);

export default function HomePage() {
  const { recent } = useLibrary();
  const { currentTrack, isPlaying, playQueue } = usePlayer();
  const atmosphere = getFeaturedAtmosphere();

  return (
    <div className="home-page">
      <p className="home-subtitle">What kind of atmosphere are you in?</p>

      <section className="hero" style={{ '--hero-1': atmosphere.colors[0], '--hero-2': atmosphere.colors[1] }}>
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="eyebrow">Your Atmosphere</span>
          <h2>{atmosphere.emoji} {atmosphere.name.toUpperCase()}</h2>
          <p>&ldquo;{atmosphere.tagline}&rdquo;</p>
          <div className="hero-actions">
            <button className="btn-solid" onClick={() => playQueue(atmosphere.tracks, 0)}>
              <Play size={16} fill="currentColor" /> Play
            </button>
            <button className="btn-ghost" onClick={() => playQueue(shuffleArray(atmosphere.tracks), 0)}>
              <Shuffle size={16} /> Shuffle
            </button>
            <Link to="/atmosphere" className="hero-link">See all atmospheres</Link>
          </div>
        </div>
        <div className="hero-art-stack">
          {atmosphere.tracks.slice(0, 3).map((t, i) => (
            <img key={t.id} src={t.thumbnail} alt="" style={{ '--i': i }} />
          ))}
        </div>
      </section>

      <h2 className="section-title">Made For You</h2>
      <div className="home-row no-scrollbar">
        {MADE_FOR_YOU_WITH_TRACKS.map((p) => (
          <CollectionCard key={p.id} title={p.name} description={p.description} tracks={p.tracks} />
        ))}
      </div>

      <h2 className="section-title">Quick Picks</h2>
      <div className="quick-picks">
        {QUICK_PICKS.map((track, i) => (
          <SongRow
            key={track.id}
            track={track}
            index={i + 1}
            isActive={currentTrack?.id === track.id}
            isPlaying={isPlaying}
            onPlay={() => playQueue(QUICK_PICKS, i)}
          />
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <h2 className="section-title">Recently Played</h2>
          <div className="home-row no-scrollbar">
            {recent.map((track, i) => (
              <RecentCard key={track.id} track={track} onPlay={() => playQueue(recent, i)} />
            ))}
          </div>
        </>
      )}

      <p className="home-hint">
        {hasApiKey ? (
          <>Looking for something else? <Link to="/search">Search any song</Link>.</>
        ) : (
          <>Want to search beyond this starter catalog? <Link to="/settings">Add a free YouTube API key</Link>.</>
        )}
      </p>
    </div>
  );
}

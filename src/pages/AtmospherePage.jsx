import { useState } from 'react';
import { Play, Shuffle } from 'lucide-react';
import { ATMOSPHERES_WITH_TRACKS } from '../lib/atmospheres.js';
import { usePlayer } from '../store/PlayerContext.jsx';
import SongCard from '../components/SongCard.jsx';
import './AtmospherePage.css';

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function AtmospherePage() {
  const [activeId, setActiveId] = useState(null);
  const { currentTrack, isPlaying, playQueue } = usePlayer();
  const active = ATMOSPHERES_WITH_TRACKS.find((a) => a.id === activeId);

  return (
    <div className="atmosphere-page">
      <p className="atmosphere-intro">Choose the mood — the whole feed, colors, and picks adjust to fit it.</p>

      <div className="atmosphere-grid">
        {ATMOSPHERES_WITH_TRACKS.map((a) => (
          <button
            key={a.id}
            className={`atmosphere-tile ${activeId === a.id ? 'active' : ''}`}
            style={{ '--tile-1': a.colors[0], '--tile-2': a.colors[1] }}
            onClick={() => setActiveId(a.id === activeId ? null : a.id)}
          >
            <span className="atmosphere-tile-emoji">{a.emoji}</span>
            <span className="atmosphere-tile-name">{a.name}</span>
          </button>
        ))}
      </div>

      {active && (
        <div className="atmosphere-detail" style={{ '--glow-1': active.colors[0], '--glow-2': active.colors[1] }}>
          <div className="atmosphere-glow" />
          <div className="atmosphere-detail-head">
            <span className="atmosphere-detail-emoji">{active.emoji}</span>
            <div>
              <h2>{active.name.toUpperCase()}</h2>
              <p>&ldquo;{active.tagline}&rdquo;</p>
            </div>
          </div>
          <div className="atmosphere-detail-actions">
            <button className="btn-solid" onClick={() => playQueue(active.tracks, 0)}>
              <Play size={16} fill="currentColor" /> Play
            </button>
            <button className="btn-ghost" onClick={() => playQueue(shuffleArray(active.tracks), 0)}>
              <Shuffle size={16} /> Shuffle
            </button>
          </div>

          <div className="atmosphere-tracks">
            {active.tracks.map((track, i) => (
              <SongCard
                key={track.id}
                track={track}
                isActive={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                onPlay={() => playQueue(active.tracks, i)}
              />
            ))}
          </div>
        </div>
      )}

      {!active && (
        <p className="atmosphere-hint">Pick an atmosphere above to see its picks.</p>
      )}
    </div>
  );
}

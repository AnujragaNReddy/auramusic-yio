import { X, Mic2 } from 'lucide-react';
import { cleanTitle } from '../lib/titleClean.js';
import './LyricsOverlay.css';

export default function LyricsOverlay({ track, onClose }) {
  return (
    <div className="lyrics-overlay">
      <div className="lyrics-backdrop" style={{ backgroundImage: `url(${track.thumbnail})` }} />
      <div className="lyrics-scrim" />
      <div className="lyrics-content">
        <button className="icon-btn lyrics-close" onClick={onClose}>
          <X size={20} />
        </button>
        <Mic2 size={40} className="lyrics-icon" />
        <h3>Lyrics not available</h3>
        <p>
          We don&rsquo;t have synced lyrics for &ldquo;{cleanTitle(track.title)}&rdquo; yet — this app doesn&rsquo;t
          fabricate lyrics text, so this stays empty until a real lyrics source is connected.
        </p>
      </div>
    </div>
  );
}

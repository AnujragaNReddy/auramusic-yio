import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import './RecentCard.css';

export default function RecentCard({ track, onPlay }) {
  const { currentTrack, isPlaying, position, duration } = usePlayer();
  const isActive = currentTrack?.id === track.id;
  const progress = isActive && duration > 0 ? (position / duration) * 100 : 0;

  return (
    <button className={`recent-card ${isActive ? 'active' : ''}`} onClick={onPlay}>
      <div className="recent-card-art">
        <img src={track.thumbnail} alt="" loading="lazy" />
        <span className="recent-card-play">
          {isActive && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </span>
      </div>
      <div className="recent-card-text">
        <span className="recent-card-title">{cleanTitle(track.title)}</span>
        <span className="recent-card-artist">{track.artist || track.channel}</span>
        {isActive && (
          <div className="recent-card-progress">
            <div style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </button>
  );
}

import { Play, Pause, Heart } from 'lucide-react';
import { cleanTitle } from '../lib/titleClean.js';
import { useLibrary } from '../store/LibraryContext.jsx';
import SongMenu from './SongMenu.jsx';
import './SongCard.css';

export default function SongCard({ track, onPlay, isActive, isPlaying }) {
  const { isLiked, toggleLike } = useLibrary();
  const liked = isLiked(track.id);

  return (
    <div
      className={`song-card ${isActive ? 'is-active' : ''}`}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPlay()}
    >
      <div className="song-card-art">
        <img src={track.thumbnail || track.image} alt="" loading="lazy" />
        <SongMenu track={track} />
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track);
          }}
          title={liked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
        >
          <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <span className="play-overlay">
          {isActive && isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </span>
      </div>
      <span className="song-card-title" title={track.title}>{cleanTitle(track.title)}</span>
      <span className="song-card-sub">{track.channel || track.artist}</span>
    </div>
  );
}

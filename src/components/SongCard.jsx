import { Play, Pause, Heart, Loader2 } from 'lucide-react';
import { cleanTitle } from '../lib/titleClean.js';
import { useLibrary } from '../store/LibraryContext.jsx';
import SongMenu from './SongMenu.jsx';
import './SongCard.css';

export default function SongCard({ track, onPlay, isActive, isPlaying, resolving }) {
  const { isLiked, toggleLike } = useLibrary();
  const liked = isLiked(track.id);
  // Unresolved JioSaavn results don't have a real playable id yet, so
  // liking/queueing them (which need a stable id) doesn't apply until
  // they've been resolved to an actual YouTube video on first play.
  const isUnresolved = track.source === 'jiosaavn';

  return (
    <div
      className={`song-card ${isActive ? 'is-active' : ''}`}
      onClick={resolving ? undefined : onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => !resolving && (e.key === 'Enter' || e.key === ' ') && onPlay()}
    >
      <div className="song-card-art">
        <img src={track.thumbnail || track.image} alt="" loading="lazy" />
        {!isUnresolved && <SongMenu track={track} />}
        {!isUnresolved && (
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
        )}
        <span className="play-overlay">
          {resolving ? (
            <Loader2 size={20} className="spin" />
          ) : isActive && isPlaying ? (
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

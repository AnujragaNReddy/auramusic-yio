import { Play, Pause, SkipForward, SkipBack, Heart, ChevronUp } from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import { useLibrary } from '../store/LibraryContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import { formatTime } from '../lib/formatTime.js';
import './MiniPlayer.css';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlay, next, prev, hasNext, hasPrev, position, duration, setExpanded, auraColors } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();

  if (!currentTrack) return null;
  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  return (
    <div className="mini-player">
      <div className="mini-progress-track">
        <div className="mini-progress" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${auraColors.primary}, ${auraColors.secondary})` }} />
      </div>
      <button className="mini-main" onClick={() => setExpanded(true)}>
        <img className="mini-art" src={currentTrack.thumbnail} alt="" />
        <div className="mini-text">
          <span className="mini-title">{cleanTitle(currentTrack.title)}</span>
          <span className="mini-sub">{currentTrack.channel} · {formatTime(position)} / {formatTime(duration)}</span>
        </div>
      </button>

      <div className="mini-controls">
        <button
          className={`icon-btn ${liked ? 'liked' : ''}`}
          onClick={() => toggleLike(currentTrack)}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <button className="icon-btn" disabled={!hasPrev} onClick={prev}><SkipBack size={18} fill="currentColor" /></button>
        <button className="icon-btn play-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <button className="icon-btn" disabled={!hasNext} onClick={next}><SkipForward size={18} fill="currentColor" /></button>
        <button className="icon-btn expand-btn" onClick={() => setExpanded(true)}><ChevronUp size={18} /></button>
      </div>
    </div>
  );
}

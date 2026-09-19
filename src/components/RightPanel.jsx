import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, X, Trash2 } from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import { formatTime } from '../lib/formatTime.js';
import './RightPanel.css';

export default function RightPanel() {
  const {
    currentTrack, isPlaying, togglePlay, next, prev, hasNext, hasPrev,
    position, duration, seekTo, shuffle, toggleShuffle, repeatMode, cycleRepeat,
    queue, index, jumpTo, removeFromQueue, setPanelOpen, setExpanded,
  } = usePlayer();

  if (!currentTrack) return null;
  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const upNext = queue.map((t, i) => ({ ...t, i })).slice(index + 1);

  function handleSeekClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    if (duration) seekTo(fraction * duration);
  }

  return (
    <aside className="right-panel">
      <div className="right-panel-head">
        <span className="eyebrow">Now Playing</span>
        <button className="icon-btn" onClick={() => setPanelOpen(false)} title="Collapse panel">
          <X size={17} />
        </button>
      </div>

      <button className="right-panel-art" onClick={() => setExpanded(true)} title="Open full player">
        <img src={currentTrack.thumbnail} alt="" />
      </button>

      <div className="right-panel-meta">
        <h3 title={currentTrack.title}>{cleanTitle(currentTrack.title)}</h3>
        <p>{currentTrack.channel || currentTrack.artist}</p>
      </div>

      <div className="right-panel-progress">
        <div className="right-panel-progress-track" onClick={handleSeekClick}>
          <div className="right-panel-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="right-panel-time">
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="right-panel-controls">
        <button className={`icon-btn ${shuffle ? 'active' : ''}`} onClick={toggleShuffle} title="Shuffle">
          <Shuffle size={17} />
        </button>
        <button className="icon-btn" disabled={!hasPrev} onClick={prev}>
          <SkipBack size={19} fill="currentColor" />
        </button>
        <button className="right-panel-play" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <button className="icon-btn" disabled={!hasNext} onClick={next}>
          <SkipForward size={19} fill="currentColor" />
        </button>
        <button className={`icon-btn ${repeatMode !== 'off' ? 'active' : ''}`} onClick={cycleRepeat} title={`Repeat: ${repeatMode}`}>
          {repeatMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}
        </button>
      </div>

      <div className="right-panel-divider" />

      <div className="right-panel-queue">
        <span className="eyebrow">Up Next</span>
        {upNext.length === 0 && <p className="right-panel-empty">Nothing queued — add songs from anywhere.</p>}
        <div className="right-panel-queue-list no-scrollbar">
          {upNext.map((track) => (
            <div key={`${track.id}-${track.i}`} className="right-panel-queue-row">
              <button className="right-panel-queue-main" onClick={() => jumpTo(track.i)}>
                <img src={track.thumbnail} alt="" />
                <div>
                  <span className="rq-title">{cleanTitle(track.title)}</span>
                  <span className="rq-sub">{track.channel || track.artist}</span>
                </div>
              </button>
              <button className="icon-btn rq-remove" onClick={() => removeFromQueue(track.i)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

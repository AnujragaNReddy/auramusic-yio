import { X, Play, Pause, Trash2 } from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import './QueueDrawer.css';

function QueueRow({ track, active, isPlaying, onPlay, onRemove }) {
  return (
    <div className={`queue-row ${active ? 'active' : ''}`}>
      <button className="queue-row-main" onClick={onPlay}>
        <div className="queue-thumb">
          <img src={track.thumbnail} alt="" />
          {active && (
            <span className="queue-playing-icon">
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </span>
          )}
        </div>
        <div className="queue-text">
          <span className="queue-title">{cleanTitle(track.title)}</span>
          <span className="queue-sub">{track.channel || track.artist}</span>
        </div>
      </button>
      {onRemove && (
        <button className="icon-btn queue-remove" onClick={onRemove}>
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

export default function QueueDrawer() {
  const { queue, index, isPlaying, queueOpen, setQueueOpen, jumpTo, removeFromQueue, clearQueue } = usePlayer();

  if (!queueOpen) return null;
  const current = queue[index];
  const upNext = queue.map((t, i) => ({ ...t, i })).slice(index + 1);

  return (
    <aside className="queue-drawer">
      <div className="queue-drawer-head">
        <h3>Playing Next</h3>
        <button className="icon-btn" onClick={() => setQueueOpen(false)}><X size={18} /></button>
      </div>
      <div className="queue-list no-scrollbar">
        {current && (
          <>
            <span className="queue-section-label">Now Playing</span>
            <QueueRow track={current} active isPlaying={isPlaying} onPlay={() => {}} />
          </>
        )}

        <div className="queue-section-label-row">
          <span className="queue-section-label">Next</span>
          {upNext.length > 0 && (
            <button className="queue-clear" onClick={clearQueue}>Clear Queue</button>
          )}
        </div>
        {upNext.length === 0 && <p className="queue-empty">Nothing queued — add songs from anywhere.</p>}
        {upNext.map((track) => (
          <QueueRow
            key={`${track.id}-${track.i}`}
            track={track}
            active={false}
            onPlay={() => jumpTo(track.i)}
            onRemove={() => removeFromQueue(track.i)}
          />
        ))}
      </div>
    </aside>
  );
}

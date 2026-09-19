import { useState } from 'react';
import {
  ChevronDown, Play, Pause, SkipForward, SkipBack, Heart, ListMusic, Volume1, Volume2, VolumeX,
  Shuffle, Repeat, Repeat1, Mic2, Laptop2,
} from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import { useLibrary } from '../store/LibraryContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import { formatTime } from '../lib/formatTime.js';
import QueueDrawer from './QueueDrawer.jsx';
import LyricsOverlay from './LyricsOverlay.jsx';
import AddToPlaylistMenu from './AddToPlaylistMenu.jsx';
import './NowPlayingOverlay.css';

export default function NowPlayingOverlay() {
  const {
    currentTrack, isPlaying, togglePlay, next, prev, hasNext, hasPrev,
    position, duration, seekTo, volume, setVolume, expanded, setExpanded,
    queueOpen, setQueueOpen, shuffle, toggleShuffle, repeatMode, cycleRepeat,
  } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);

  if (!expanded || !currentTrack) return null;
  const liked = isLiked(currentTrack.id);
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  function handleTimelineClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    if (duration) seekTo(fraction * duration);
  }

  return (
    <div className="now-playing">
      <div className="now-playing-backdrop" style={{ backgroundImage: `url(${currentTrack.thumbnail})` }} />
      <div className="now-playing-scrim" />

      <header className="now-playing-head">
        <button className="icon-btn" onClick={() => setExpanded(false)}>
          <ChevronDown size={22} />
        </button>
        <span className="eyebrow">Now Playing</span>
        <button className={`icon-btn ${liked ? 'liked' : ''}`} onClick={() => toggleLike(currentTrack)}>
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </header>

      <div className="now-playing-body">
        <div className={`art-card ${isPlaying ? 'is-playing' : ''}`}>
          <img src={currentTrack.thumbnail} alt="" />
        </div>

        <div className="now-playing-info">
          <h2>{cleanTitle(currentTrack.title)}</h2>
          <p>{currentTrack.channel || currentTrack.artist}</p>
        </div>

        <div className="now-playing-timeline">
          <span className="np-time">{formatTime(position)}</span>
          <div className="np-timeline-track" onClick={handleTimelineClick}>
            <div className="np-timeline-fill" style={{ width: `${progress}%` }} />
            <div className="np-timeline-thumb" style={{ left: `${progress}%` }} />
          </div>
          <span className="np-time">{formatTime(duration)}</span>
        </div>

        <div className="now-playing-controls">
          <button className={`icon-btn ${shuffle ? 'active' : ''}`} onClick={toggleShuffle} title="Shuffle">
            <Shuffle size={19} />
          </button>
          <button className="icon-btn" disabled={!hasPrev} onClick={prev}>
            <SkipBack size={22} fill="currentColor" />
          </button>
          <button className="play-btn-lg" onClick={togglePlay}>
            {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" />}
          </button>
          <button className="icon-btn" disabled={!hasNext} onClick={next}>
            <SkipForward size={22} fill="currentColor" />
          </button>
          <button className={`icon-btn ${repeatMode !== 'off' ? 'active' : ''}`} onClick={cycleRepeat} title={`Repeat: ${repeatMode}`}>
            {repeatMode === 'one' ? <Repeat1 size={19} /> : <Repeat size={19} />}
          </button>
        </div>

        <div className="now-playing-secondary">
          <div className="volume-control">
            <VolumeIcon size={18} />
            <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
          </div>
          <AddToPlaylistMenu track={currentTrack} />
          <button className={`icon-btn ${queueOpen ? 'active' : ''}`} onClick={() => setQueueOpen((v) => !v)} title="Queue">
            <ListMusic size={19} />
          </button>
          <button className={`icon-btn ${lyricsOpen ? 'active' : ''}`} onClick={() => setLyricsOpen((v) => !v)} title="Lyrics">
            <Mic2 size={19} />
          </button>
          <button className={`icon-btn ${devicesOpen ? 'active' : ''}`} onClick={() => setDevicesOpen((v) => !v)} title="Devices">
            <Laptop2 size={19} />
          </button>
        </div>

        {devicesOpen && (
          <div className="devices-popover">
            <span className="eyebrow">Playing on</span>
            <div className="devices-row">
              <Laptop2 size={16} /> This device
            </div>
          </div>
        )}
      </div>

      <QueueDrawer />
      {lyricsOpen && <LyricsOverlay track={currentTrack} onClose={() => setLyricsOpen(false)} />}
    </div>
  );
}

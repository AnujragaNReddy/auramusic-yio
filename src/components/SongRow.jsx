import { Play, Pause } from 'lucide-react';
import { cleanTitle } from '../lib/titleClean.js';
import SongMenu from './SongMenu.jsx';
import './SongRow.css';

export default function SongRow({ track, index, isActive, isPlaying, onPlay }) {
  return (
    <div className={`song-row ${isActive ? 'active' : ''}`} onClick={onPlay}>
      <span className="song-row-index">
        {isActive ? (
          isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />
        ) : (
          index
        )}
      </span>
      <img className="song-row-art" src={track.thumbnail} alt="" loading="lazy" />
      <div className="song-row-main">
        <span className="song-row-title">{cleanTitle(track.title)}</span>
        <span className="song-row-artist">{track.artist || track.channel}</span>
      </div>
      <span className="song-row-album">{track.album || '—'}</span>
      <span className="song-row-duration">—</span>
      <div className="song-row-menu" onClick={(e) => e.stopPropagation()}>
        <SongMenu track={track} />
      </div>
    </div>
  );
}

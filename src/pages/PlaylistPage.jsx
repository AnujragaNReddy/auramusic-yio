import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Shuffle, Share2, Trash2, ArrowLeft, Pause, Heart } from 'lucide-react';
import { useLibrary } from '../store/LibraryContext.jsx';
import { usePlayer } from '../store/PlayerContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import './PlaylistPage.css';

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, removeFromPlaylist, deletePlaylist, isLiked, toggleLike } = useLibrary();
  const { playQueue, currentTrack, isPlaying } = usePlayer();
  const [copied, setCopied] = useState(false);

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="empty-state">
        <h3>Playlist not found</h3>
        <Link to="/playlists">Back to Playlists</Link>
      </div>
    );
  }

  function handleDelete() {
    deletePlaylist(playlist.id);
    navigate('/playlists');
  }

  async function handleShare() {
    const text = `${playlist.name}\n${playlist.tracks.map((t, i) => `${i + 1}. ${cleanTitle(t.title)} — ${t.artist || t.channel}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing to fall back to gracefully here */
    }
  }

  return (
    <div>
      <Link to="/playlists" className="back-link"><ArrowLeft size={16} /> Playlists</Link>

      <div className="playlist-header">
        <div className="playlist-header-cover">
          {playlist.tracks.slice(0, 4).map((t) => <img key={t.id} src={t.thumbnail} alt="" />)}
        </div>
        <div>
          <span className="playlist-header-label">Playlist</span>
          <h1>{playlist.name}</h1>
          <p>{playlist.tracks.length} song{playlist.tracks.length === 1 ? '' : 's'}</p>
          <div className="playlist-header-actions">
            <button
              className="btn-play-all"
              disabled={playlist.tracks.length === 0}
              onClick={() => playQueue(playlist.tracks, 0)}
            >
              <Play size={16} fill="currentColor" /> Play
            </button>
            <button
              className="btn-ghost"
              disabled={playlist.tracks.length === 0}
              onClick={() => playQueue(shuffleArray(playlist.tracks), 0)}
            >
              <Shuffle size={16} /> Shuffle
            </button>
            <button className="icon-btn" onClick={handleShare} title="Copy tracklist" disabled={playlist.tracks.length === 0}>
              <Share2 size={17} />
            </button>
            <button className="btn-delete" onClick={handleDelete}><Trash2 size={15} /> Delete</button>
          </div>
          {copied && <p className="copied-note">Tracklist copied to clipboard.</p>}
        </div>
      </div>

      {playlist.tracks.length === 0 ? (
        <p className="library-empty">No songs yet — add some from the ⋮ menu on any song.</p>
      ) : (
        <div className="playlist-track-list">
          {playlist.tracks.map((track, i) => {
            const active = currentTrack?.id === track.id;
            const liked = isLiked(track.id);
            return (
              <div key={track.id} className={`playlist-track-row numbered ${active ? 'active' : ''}`}>
                <span className="track-number">
                  {active ? (isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />) : i + 1}
                </span>
                <button className="playlist-track-main" onClick={() => playQueue(playlist.tracks, i)}>
                  <img src={track.thumbnail} alt="" />
                  <div>
                    <span className="playlist-track-title">{cleanTitle(track.title)}</span>
                    <span className="playlist-track-sub">{track.artist || track.channel}</span>
                  </div>
                </button>
                <button className={`icon-btn track-like ${liked ? 'liked' : ''}`} onClick={() => toggleLike(track)}>
                  <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button className="icon-btn" onClick={() => removeFromPlaylist(playlist.id, track.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

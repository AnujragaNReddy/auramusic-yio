import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Shuffle, BookmarkPlus, BookmarkCheck, Heart, Pause } from 'lucide-react';
import { CURATED_ALBUMS } from '../lib/curatedSongs.js';
import { usePlayer } from '../store/PlayerContext.jsx';
import { useLibrary } from '../store/LibraryContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import '../pages/PlaylistPage.css';
import '../components/AlbumCard.css';

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function AlbumPage() {
  const { id } = useParams();
  const { playQueue, currentTrack, isPlaying } = usePlayer();
  const { isAlbumSaved, toggleSavedAlbum, isLiked, toggleLike } = useLibrary();
  const album = CURATED_ALBUMS.find((a) => a.id === id);

  if (!album) {
    return (
      <div className="empty-state">
        <h3>Album not found</h3>
        <Link to="/albums">Back to Albums</Link>
      </div>
    );
  }

  const saved = isAlbumSaved(album.id);

  return (
    <div>
      <Link to="/albums" className="back-link"><ArrowLeft size={16} /> Albums</Link>

      <div className="playlist-header">
        <div className="album-header-cover">
          <img src={album.cover} alt="" />
        </div>
        <div>
          <span className="playlist-header-label">Album</span>
          <h1>{album.name}</h1>
          <p>{album.tracks[0]?.artist} &middot; {album.tracks.length} song{album.tracks.length === 1 ? '' : 's'}</p>
          <div className="playlist-header-actions">
            <button className="btn-play-all" onClick={() => playQueue(album.tracks, 0)}>
              <Play size={16} fill="currentColor" /> Play
            </button>
            <button className="btn-ghost" onClick={() => playQueue(shuffleArray(album.tracks), 0)}>
              <Shuffle size={16} /> Shuffle
            </button>
            <button className="icon-btn" onClick={() => toggleSavedAlbum(album.id)} title={saved ? 'Remove from Library' : 'Add to Library'}>
              {saved ? <BookmarkCheck size={19} className="saved" /> : <BookmarkPlus size={19} />}
            </button>
          </div>
        </div>
      </div>

      <div className="playlist-track-list">
        {album.tracks.map((track, i) => {
          const active = currentTrack?.id === track.id;
          const liked = isLiked(track.id);
          return (
            <div key={track.id} className={`playlist-track-row numbered ${active ? 'active' : ''}`}>
              <span className="track-number">
                {active ? (isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />) : i + 1}
              </span>
              <button className="playlist-track-main" onClick={() => playQueue(album.tracks, i)}>
                <img src={track.thumbnail} alt="" />
                <div>
                  <span className="playlist-track-title">{cleanTitle(track.title)}</span>
                  <span className="playlist-track-sub">{track.artist}</span>
                </div>
              </button>
              <button className={`icon-btn track-like ${liked ? 'liked' : ''}`} onClick={() => toggleLike(track)}>
                <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

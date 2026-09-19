import { Link, useParams } from 'react-router-dom';
import { Play, ListPlus } from 'lucide-react';
import { CURATED_ARTISTS, CURATED_ALBUMS } from '../lib/curatedSongs.js';
import { usePlayer } from '../store/PlayerContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import ArtistCard from '../components/ArtistCard.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import '../pages/LibraryPage.css';
import './ArtistPage.css';

export default function ArtistPage() {
  const { id } = useParams();
  const { playQueue, addToQueue, currentTrack, isPlaying } = usePlayer();
  const artist = CURATED_ARTISTS.find((a) => a.id === id);

  if (!artist) {
    return (
      <div className="empty-state">
        <h3>Artist not found</h3>
        <Link to="/artists">Back to Artists</Link>
      </div>
    );
  }

  const albums = CURATED_ALBUMS.filter((al) => al.tracks.some((t) => t.artist === artist.name));
  const similar = CURATED_ARTISTS.filter(
    (a) => a.id !== artist.id && a.languages.some((l) => artist.languages.includes(l))
  ).slice(0, 8);

  return (
    <div>
      <div className="artist-hero">
        <div className="artist-hero-backdrop" style={{ backgroundImage: `url(${artist.image})` }} />
        <div className="artist-hero-scrim" />
        <div className="artist-hero-content">
          <span className="eyebrow">Artist</span>
          <h1>{artist.name}</h1>
          <p>{artist.tracks.length} song{artist.tracks.length === 1 ? '' : 's'} in your library</p>
          <button className="btn-solid" onClick={() => playQueue(artist.tracks, 0)}>
            <Play size={16} fill="currentColor" /> Play
          </button>
        </div>
      </div>

      <h2 className="section-title">Popular</h2>
      <div className="artist-track-list">
        {artist.tracks.slice(0, 5).map((track, i) => (
          <div key={track.id} className={`artist-track-row ${currentTrack?.id === track.id ? 'active' : ''}`}>
            <button className="artist-track-main" onClick={() => playQueue(artist.tracks, i)}>
              <span className="artist-track-index">{currentTrack?.id === track.id && isPlaying ? <span className="playing-dot" /> : i + 1}</span>
              <img src={track.thumbnail} alt="" />
              <div>
                <span className="at-title">{cleanTitle(track.title)}</span>
                <span className="at-sub">{track.album}</span>
              </div>
            </button>
            <button className="icon-btn" onClick={() => addToQueue(track)} title="Add to queue">
              <ListPlus size={16} />
            </button>
          </div>
        ))}
      </div>

      {albums.length > 0 && (
        <>
          <h2 className="section-title">Albums</h2>
          <div className="playlist-grid">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </>
      )}

      {similar.length > 0 && (
        <>
          <h2 className="section-title">Similar Artists</h2>
          <div className="artist-similar-row no-scrollbar">
            {similar.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

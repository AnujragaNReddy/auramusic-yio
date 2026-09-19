import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SearchX, AlertCircle, ExternalLink } from 'lucide-react';
import { hasApiKey, resolveToPlayableTrack } from '../api/youtube.js';
import { searchJioSaavnSongs } from '../api/jiosaavn.js';
import { CURATED_TRACKS, CURATED_ALBUMS } from '../lib/curatedSongs.js';
import { usePlayer } from '../store/PlayerContext.jsx';
import SongCard from '../components/SongCard.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import ExploreTiles from '../components/ExploreTiles.jsx';
import '../pages/LibraryPage.css';
import './SearchPage.css';

function searchCurated(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CURATED_TRACKS.filter(
    (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q)
  );
}

function searchAlbums(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CURATED_ALBUMS.filter((a) => a.name.toLowerCase().includes(q));
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get('q') || '';
  const [input, setInput] = useState(query);
  const [saavnResults, setSaavnResults] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);
  const [resolveError, setResolveError] = useState(null);
  const { currentTrack, isPlaying, playQueue } = usePlayer();

  useEffect(() => setInput(query), [query]);

  const curatedMatches = useMemo(() => searchCurated(query), [query]);
  const albumMatches = useMemo(() => searchAlbums(query), [query]);

  // JioSaavn powers discovery here — free, accurate, no quota — but never
  // supplies anything playable. Actual playback is still resolved to a real
  // YouTube video lazily, only when a specific result is clicked.
  useEffect(() => {
    if (!query) return;
    setSaavnResults(null);
    setResolveError(null);
    searchJioSaavnSongs(query, { limit: 24 }).then(setSaavnResults);
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  }

  async function handlePlaySaavnTrack(track) {
    setResolvingId(track.jiosaavnId);
    setResolveError(null);
    try {
      const resolved = await resolveToPlayableTrack(track);
      playQueue([resolved], 0);
    } catch (err) {
      setResolveError({ message: err.message, track });
    } finally {
      setResolvingId(null);
    }
  }

  const noResultsYet = query && saavnResults !== null && saavnResults.length === 0 && curatedMatches.length === 0 && albumMatches.length === 0;

  return (
    <div>
      <form className="search-hero" onSubmit={handleSubmit}>
        <SearchIcon size={20} />
        <input
          autoFocus
          placeholder="Search any Telugu, Tamil, Hindi, or English song..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="search-hero-btn">Search</button>
      </form>

      {!query && <ExploreTiles onPick={(term) => navigate(`/search?q=${encodeURIComponent(term)}`)} />}

      {resolveError && (
        <p className="empty-state-inline resolve-error">
          <AlertCircle size={15} /> {resolveError.message}
          {' '}
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${resolveError.track.title} ${resolveError.track.artist}`)}`}
            target="_blank"
            rel="noreferrer"
            className="resolve-error-link"
          >
            Open on YouTube instead <ExternalLink size={12} />
          </a>
        </p>
      )}

      {query && albumMatches.length > 0 && (
        <>
          <h3 className="search-section-title">Albums</h3>
          <div className="playlist-grid" style={{ marginBottom: 8 }}>
            {albumMatches.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </>
      )}

      {query && curatedMatches.length > 0 && (
        <>
          <h3 className="search-section-title">Instantly playable</h3>
          <div className="search-grid">
            {curatedMatches.map((track, i) => (
              <SongCard
                key={track.id}
                track={track}
                isActive={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                onPlay={() => playQueue(curatedMatches, i)}
              />
            ))}
          </div>
        </>
      )}

      {query && (
        <>
          <h3 className="search-section-title">More results</h3>
          {saavnResults === null && (
            <div className="search-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="song-card-skeleton">
                  <div className="skeleton" style={{ width: '100%', aspectRatio: '16 / 9' }} />
                  <div className="skeleton" style={{ width: '80%', height: 14 }} />
                </div>
              ))}
            </div>
          )}
          {noResultsYet && (
            <div className="empty-state">
              <SearchX size={32} />
              <h3>No songs found</h3>
              <p>Try a different search — song name, movie name, or singer.</p>
            </div>
          )}
          {saavnResults?.length > 0 && (
            <>
              <p className="empty-state-inline">Tap a song to find and play it — this looks it up on YouTube the first time only.</p>
              <div className="search-grid">
                {saavnResults.map((track) => (
                  <SongCard
                    key={track.jiosaavnId}
                    track={track}
                    isActive={currentTrack?.title === track.title && currentTrack?.artist === track.artist}
                    isPlaying={isPlaying}
                    resolving={resolvingId === track.jiosaavnId}
                    onPlay={() => handlePlaySaavnTrack(track)}
                  />
                ))}
              </div>
            </>
          )}
          {!hasApiKey && (
            <p className="empty-state-inline">
              Add a free YouTube API key to actually play these — see the setup note on the Home page.
            </p>
          )}
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Play } from 'lucide-react';
import { MOODS_WITH_TRACKS } from '../lib/moods.js';
import { CURATED_ALBUMS, CURATED_TRACKS } from '../lib/curatedSongs.js';
import { usePlayer } from '../store/PlayerContext.jsx';
import { cleanTitle } from '../lib/titleClean.js';
import SongCard from '../components/SongCard.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import './DiscoverPage.css';

const FEATURED_ALBUM = CURATED_ALBUMS[0];
const MORE_ALBUMS = CURATED_ALBUMS.slice(1, 5);
const TRENDING = CURATED_TRACKS.slice(0, 5);

export default function DiscoverPage() {
  const [moodId, setMoodId] = useState(MOODS_WITH_TRACKS[0].id);
  const { currentTrack, isPlaying, playQueue } = usePlayer();
  const mood = MOODS_WITH_TRACKS.find((m) => m.id === moodId);

  return (
    <div className="discover-page">
      <p className="discover-subtitle">Find something that fits your mood.</p>

      <div className="mood-row no-scrollbar">
        {MOODS_WITH_TRACKS.map((m) => (
          <button key={m.id} className={`mood-chip ${moodId === m.id ? 'active' : ''}`} onClick={() => setMoodId(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {mood.tracks.length > 0 && (
        <div className="discover-grid">
          {mood.tracks.map((track, i) => (
            <SongCard
              key={track.id}
              track={track}
              isActive={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              onPlay={() => playQueue(mood.tracks, i)}
            />
          ))}
        </div>
      )}

      <h2 className="section-title">New Releases</h2>
      <div className="new-release-row">
        {FEATURED_ALBUM && (
          <div className="new-release-feature">
            <img src={FEATURED_ALBUM.cover} alt="" />
            <div className="new-release-feature-info">
              <span className="eyebrow">Featured Album</span>
              <h3>{FEATURED_ALBUM.name}</h3>
              <p>{FEATURED_ALBUM.tracks[0]?.artist} &middot; {FEATURED_ALBUM.tracks.length} tracks</p>
              <button className="btn-solid" onClick={() => playQueue(FEATURED_ALBUM.tracks, 0)}>
                <Play size={15} fill="currentColor" /> Play
              </button>
            </div>
          </div>
        )}
        <div className="new-release-more">
          {MORE_ALBUMS.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>

      <h2 className="section-title">Trending Now</h2>
      <div className="trending-list">
        {TRENDING.map((track, i) => (
          <button key={track.id} className="trending-row" onClick={() => playQueue(TRENDING, i)}>
            <span className="trending-rank">{String(i + 1).padStart(2, '0')}</span>
            <img src={track.thumbnail} alt="" />
            <div className="trending-info">
              <span className="trending-title">{cleanTitle(track.title)}</span>
              <span className="trending-artist">{track.artist}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

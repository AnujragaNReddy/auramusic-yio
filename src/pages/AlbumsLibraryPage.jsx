import { Disc3 } from 'lucide-react';
import { CURATED_ALBUMS } from '../lib/curatedSongs.js';
import AlbumCard from '../components/AlbumCard.jsx';
import '../pages/LibraryPage.css';

export default function AlbumsLibraryPage() {
  return (
    <div>
      <h2 className="section-title" style={{ marginTop: 8 }}>
        <span><Disc3 size={20} style={{ marginRight: 10, verticalAlign: -4 }} />Albums</span>
      </h2>
      {CURATED_ALBUMS.length === 0 ? (
        <p className="library-empty">No albums yet.</p>
      ) : (
        <div className="playlist-grid">
          {CURATED_ALBUMS.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}

import { Mic2 } from 'lucide-react';
import { CURATED_ARTISTS } from '../lib/curatedSongs.js';
import ArtistCard from '../components/ArtistCard.jsx';
import '../pages/LibraryPage.css';
import './ArtistsLibraryPage.css';

export default function ArtistsLibraryPage() {
  return (
    <div>
      <h2 className="section-title" style={{ marginTop: 8 }}>
        <span><Mic2 size={20} style={{ marginRight: 10, verticalAlign: -4 }} />Artists</span>
      </h2>
      <div className="artist-grid">
        {CURATED_ARTISTS.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}

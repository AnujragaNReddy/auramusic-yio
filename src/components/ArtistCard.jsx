import { Link } from 'react-router-dom';
import './ArtistCard.css';

export default function ArtistCard({ artist }) {
  return (
    <Link to={`/artist/${artist.id}`} className="artist-card">
      <div className="artist-card-photo">
        <img src={artist.image} alt="" />
      </div>
      <span className="artist-card-name">{artist.name}</span>
      <span className="artist-card-sub">{artist.tracks.length} song{artist.tracks.length === 1 ? '' : 's'}</span>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import './AlbumCard.css';

export default function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album.id}`} className="album-card">
      <div className="album-card-cover">
        <img src={album.cover} alt="" />
      </div>
      <span className="playlist-name">{album.name}</span>
      <span className="playlist-count">{album.tracks.length} song{album.tracks.length === 1 ? '' : 's'}</span>
    </Link>
  );
}

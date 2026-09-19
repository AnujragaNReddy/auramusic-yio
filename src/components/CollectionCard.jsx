import { Play } from 'lucide-react';
import { usePlayer } from '../store/PlayerContext.jsx';
import './CollectionCard.css';

export default function CollectionCard({ title, description, cover, tracks }) {
  const { playQueue } = usePlayer();
  if (!tracks?.length) return null;

  return (
    <button className="collection-card" onClick={() => playQueue(tracks, 0)}>
      <div className="collection-card-art">
        <img src={cover || tracks[0].thumbnail} alt="" />
        <span className="collection-card-play"><Play size={18} fill="currentColor" /></span>
      </div>
      <span className="collection-card-title">{title}</span>
      <span className="collection-card-desc">{description}</span>
    </button>
  );
}

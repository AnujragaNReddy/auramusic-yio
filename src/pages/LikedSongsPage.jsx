import { Heart } from 'lucide-react';
import { useLibrary } from '../store/LibraryContext.jsx';
import { usePlayer } from '../store/PlayerContext.jsx';
import SongCard from '../components/SongCard.jsx';
import './LibraryPage.css';

export default function LikedSongsPage() {
  const { liked } = useLibrary();
  const { currentTrack, isPlaying, playQueue } = usePlayer();

  return (
    <div>
      <h2 className="section-title" style={{ marginTop: 24 }}>
        <span><Heart size={18} style={{ marginRight: 8, verticalAlign: -3 }} />Liked Songs</span>
      </h2>
      {liked.length === 0 ? (
        <p className="library-empty">Songs you like will show up here — tap the heart on any track.</p>
      ) : (
        <div className="library-grid">
          {liked.map((track, i) => (
            <SongCard
              key={track.id}
              track={track}
              isActive={currentTrack?.id === track.id}
              isPlaying={isPlaying}
              onPlay={() => playQueue(liked, i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

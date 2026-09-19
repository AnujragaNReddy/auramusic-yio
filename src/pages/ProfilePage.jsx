import { Heart, ListMusic, History } from 'lucide-react';
import { useLibrary } from '../store/LibraryContext.jsx';
import './ProfilePage.css';

export default function ProfilePage() {
  const { liked, playlists, recent } = useLibrary();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">Y</div>
        <div>
          <h1>You</h1>
          <p>Local listener &middot; stored only in this browser</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <Heart size={20} />
          <span className="profile-stat-num">{liked.length}</span>
          <span className="profile-stat-label">Liked Songs</span>
        </div>
        <div className="profile-stat">
          <ListMusic size={20} />
          <span className="profile-stat-num">{playlists.length}</span>
          <span className="profile-stat-label">Playlists</span>
        </div>
        <div className="profile-stat">
          <History size={20} />
          <span className="profile-stat-num">{recent.length}</span>
          <span className="profile-stat-label">Recently Played</span>
        </div>
      </div>
    </div>
  );
}

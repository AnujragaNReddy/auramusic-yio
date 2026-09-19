import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ListMusic } from 'lucide-react';
import { useLibrary } from '../store/LibraryContext.jsx';
import './LibraryPage.css';

export default function PlaylistsPage() {
  const { playlists, createPlaylist } = useLibrary();
  const [newName, setNewName] = useState('');

  function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    createPlaylist(newName.trim());
    setNewName('');
  }

  return (
    <div>
      <h2 className="section-title" style={{ marginTop: 24 }}>
        <span><ListMusic size={18} style={{ marginRight: 8, verticalAlign: -3 }} />Playlists</span>
      </h2>
      <form className="new-playlist-form" onSubmit={handleCreate}>
        <input placeholder="New playlist name..." value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button className="icon-btn" type="submit"><Plus size={18} /></button>
      </form>

      {playlists.length === 0 ? (
        <p className="library-empty">Create a playlist to start organizing your favorites.</p>
      ) : (
        <div className="playlist-grid">
          {playlists.map((p) => (
            <Link key={p.id} to={`/playlist/${p.id}`} className="playlist-card">
              <div className="playlist-cover">
                {p.tracks.slice(0, 4).map((t) => (
                  <img key={t.id} src={t.thumbnail} alt="" />
                ))}
                {p.tracks.length === 0 && <ListMusic size={26} />}
              </div>
              <span className="playlist-name">{p.name}</span>
              <span className="playlist-count">{p.tracks.length} song{p.tracks.length === 1 ? '' : 's'}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

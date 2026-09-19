import { useEffect, useRef, useState } from 'react';
import { ListPlus, Plus, Check } from 'lucide-react';
import { useLibrary } from '../store/LibraryContext.jsx';
import './AddToPlaylistMenu.css';

export default function AddToPlaylistMenu({ track }) {
  const { playlists, addToPlaylist, createPlaylist } = useLibrary();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleCreateAndAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = createPlaylist(newName.trim());
    addToPlaylist(id, track);
    setNewName('');
  }

  return (
    <div className="add-to-playlist" ref={ref}>
      <button className="icon-btn" title="Add to playlist" onClick={() => setOpen((v) => !v)}>
        <ListPlus size={20} />
      </button>
      {open && (
        <div className="playlist-menu">
          <span className="playlist-menu-title">Add to playlist</span>
          {playlists.length === 0 && <p className="playlist-menu-empty">No playlists yet.</p>}
          {playlists.map((p) => {
            const already = p.tracks.some((t) => t.id === track.id);
            return (
              <button key={p.id} className="playlist-menu-row" disabled={already} onClick={() => addToPlaylist(p.id, track)}>
                <span>{p.name}</span>
                {already && <Check size={14} />}
              </button>
            );
          })}
          <form className="playlist-menu-new" onSubmit={handleCreateAndAdd}>
            <input placeholder="New playlist..." value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit"><Plus size={15} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

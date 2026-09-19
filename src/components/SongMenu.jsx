import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ListPlus, Disc3, Plus, Check, ChevronLeft } from 'lucide-react';
import { useLibrary } from '../store/LibraryContext.jsx';
import { usePlayer } from '../store/PlayerContext.jsx';
import { CURATED_ALBUMS } from '../lib/curatedSongs.js';
import './SongMenu.css';

export default function SongMenu({ track }) {
  const [open, setOpen] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [newName, setNewName] = useState('');
  const ref = useRef(null);
  const navigate = useNavigate();
  const { addToQueue } = usePlayer();
  const { playlists, addToPlaylist, createPlaylist } = useLibrary();

  const album = track.album ? CURATED_ALBUMS.find((a) => a.name === track.album) : null;

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowPlaylists(false);
      }
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
    setOpen(false);
    setShowPlaylists(false);
  }

  return (
    <div className="song-menu" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button
        className="song-menu-trigger"
        onClick={() => {
          setOpen((v) => !v);
          setShowPlaylists(false);
        }}
        title="More options"
      >
        <MoreVertical size={16} />
      </button>

      {open && !showPlaylists && (
        <div className="song-menu-popover">
          <button onClick={() => { addToQueue(track); setOpen(false); }}>
            <ListPlus size={15} /> Add to queue
          </button>
          <button onClick={() => setShowPlaylists(true)}>
            <Plus size={15} /> Add to playlist
          </button>
          {album && (
            <button onClick={() => { navigate(`/album/${album.id}`); setOpen(false); }}>
              <Disc3 size={15} /> Go to {album.name}
            </button>
          )}
        </div>
      )}

      {open && showPlaylists && (
        <div className="song-menu-popover">
          <button className="song-menu-back" onClick={() => setShowPlaylists(false)}>
            <ChevronLeft size={14} /> Back
          </button>
          {playlists.length === 0 && <p className="song-menu-empty">No playlists yet.</p>}
          {playlists.map((p) => {
            const already = p.tracks.some((t) => t.id === track.id);
            return (
              <button key={p.id} disabled={already} onClick={() => addToPlaylist(p.id, track)}>
                <span>{p.name}</span>
                {already && <Check size={13} />}
              </button>
            );
          })}
          <form className="song-menu-new" onSubmit={handleCreateAndAdd}>
            <input placeholder="New playlist..." value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit"><Plus size={14} /></button>
          </form>
        </div>
      )}
    </div>
  );
}

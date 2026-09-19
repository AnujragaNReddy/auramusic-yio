import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext(null);
const STORAGE_KEY = 'aura.library.v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { liked: [], playlists: [], recent: [], savedAlbumIds: [], ...JSON.parse(raw) };
  } catch {
    /* ignore corrupt storage */
  }
  return { liked: [], playlists: [], recent: [], savedAlbumIds: [] };
}

export function LibraryProvider({ children }) {
  const [state, setState] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — app still works, just won't persist */
    }
  }, [state]);

  const toggleLike = useCallback((track) => {
    setState((s) => {
      const exists = s.liked.some((t) => t.id === track.id);
      return { ...s, liked: exists ? s.liked.filter((t) => t.id !== track.id) : [track, ...s.liked] };
    });
  }, []);

  const isLiked = useCallback((id) => state.liked.some((t) => t.id === id), [state.liked]);

  const addRecent = useCallback((track) => {
    setState((s) => ({ ...s, recent: [track, ...s.recent.filter((t) => t.id !== track.id)].slice(0, 30) }));
  }, []);

  const createPlaylist = useCallback((name) => {
    const id = `pl_${Date.now()}`;
    setState((s) => ({ ...s, playlists: [...s.playlists, { id, name, tracks: [] }] }));
    return id;
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setState((s) => ({ ...s, playlists: s.playlists.filter((p) => p.id !== playlistId) }));
  }, []);

  const addToPlaylist = useCallback((playlistId, track) => {
    setState((s) => ({
      ...s,
      playlists: s.playlists.map((p) =>
        p.id === playlistId && !p.tracks.some((t) => t.id === track.id) ? { ...p, tracks: [...p.tracks, track] } : p
      ),
    }));
  }, []);

  const removeFromPlaylist = useCallback((playlistId, trackId) => {
    setState((s) => ({
      ...s,
      playlists: s.playlists.map((p) => (p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) } : p)),
    }));
  }, []);

  const toggleSavedAlbum = useCallback((albumId) => {
    setState((s) => {
      const ids = s.savedAlbumIds || [];
      const exists = ids.includes(albumId);
      return { ...s, savedAlbumIds: exists ? ids.filter((id) => id !== albumId) : [...ids, albumId] };
    });
  }, []);

  const isAlbumSaved = useCallback((albumId) => (state.savedAlbumIds || []).includes(albumId), [state.savedAlbumIds]);

  const value = {
    liked: state.liked,
    playlists: state.playlists,
    recent: state.recent,
    toggleLike,
    isLiked,
    addRecent,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    toggleSavedAlbum,
    isAlbumSaved,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { extractAura } from '../lib/colorExtract.js';
import { getJioSaavnSongById } from '../api/jiosaavn.js';
import { useLibrary } from './LibraryContext.jsx';

const PlayerContext = createContext(null);
const DEFAULT_AURA = { primary: 'rgb(124, 140, 255)', secondary: 'rgb(124, 140, 255)' };

export function PlayerProvider({ children }) {
  const { addRecent } = useLibrary();
  const audioRef = useRef(null);

  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const currentTrack = index >= 0 && index < queue.length ? queue[index] : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [expanded, setExpanded] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [auraColors, setAuraColors] = useState(DEFAULT_AURA);
  const [notice, setNotice] = useState(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  const nextRef = useRef(() => {});
  const shuffleRef = useRef(shuffle);
  const repeatModeRef = useRef(repeatMode);
  shuffleRef.current = shuffle;
  repeatModeRef.current = repeatMode;
  const noticeTimerRef = useRef(null);

  const showNotice = useCallback((message) => {
    setNotice(message);
    clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(null), 4000);
  }, []);

  // Wire up the real <audio> element's events once.
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume / 100;

    const onTimeUpdate = () => setPosition(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextRef.current();
      }
    };
    const onError = () => {
      showNotice('Could not play this song — skipping...');
      nextRef.current();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load whichever track `index` points to: re-resolve a fresh playable URL
  // by JioSaavn id (never trust a possibly-stale baked-in one, since this
  // runs for curated picks and tracks saved days ago too, not just fresh
  // search results) and hand it to the real <audio> element. Guarded by
  // lastLoadedRef so editing the queue (e.g. removing an earlier track,
  // which shifts `index` without changing what's actually playing) doesn't
  // restart the currently-playing song.
  const lastLoadedRef = useRef(null);
  useEffect(() => {
    const track = queue[index];
    const audio = audioRef.current;
    if (!track || !audio) return undefined;
    if (lastLoadedRef.current === track.id) return undefined;
    lastLoadedRef.current = track.id;
    setPosition(0);
    setDuration(0);

    let cancelled = false;
    getJioSaavnSongById(track.id)
      .then((resolved) => {
        if (cancelled || lastLoadedRef.current !== track.id) return;
        if (!resolved.url) throw new Error('No playable audio for this song');
        audio.src = resolved.url;
        audio.play().catch(() => {});
        addRecent(track);
      })
      .catch(() => {
        if (cancelled || lastLoadedRef.current !== track.id) return;
        showNotice("Couldn't find a playable version of this song — skipping...");
        nextRef.current();
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, queue]);

  // Re-derive the Aura glow colors whenever the track changes.
  useEffect(() => {
    if (!currentTrack) {
      setAuraColors(DEFAULT_AURA);
      return undefined;
    }
    let cancelled = false;
    extractAura(currentTrack.thumbnail, currentTrack.id).then((c) => {
      if (!cancelled) setAuraColors(c);
    });
    return () => {
      cancelled = true;
    };
  }, [currentTrack?.id, currentTrack?.thumbnail]);

  const playQueue = useCallback((list, startIndex = 0) => {
    if (!list?.length) return;
    setQueue(list);
    setIndex(startIndex);
    setExpanded(true);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => {
      if (shuffleRef.current && queue.length > 1) {
        let r = i;
        while (r === i) r = Math.floor(Math.random() * queue.length);
        return r;
      }
      if (i + 1 < queue.length) return i + 1;
      return repeatModeRef.current === 'all' ? 0 : i;
    });
  }, [queue.length]);
  nextRef.current = next;

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((v) => !v), []);
  const cycleRepeat = useCallback(() => {
    setRepeatMode((m) => (m === 'off' ? 'all' : m === 'all' ? 'one' : 'off'));
  }, []);

  const jumpTo = useCallback((i) => {
    setIndex(i);
  }, []);

  const removeFromQueue = useCallback((trackIndex) => {
    setQueue((q) => q.filter((_, i) => i !== trackIndex));
    setIndex((i) => (trackIndex < i ? i - 1 : i));
  }, []);

  // Clears everything except the track currently playing.
  const clearQueue = useCallback(() => {
    setQueue((q) => {
      const current = q[index];
      return current ? [current] : [];
    });
    setIndex((i) => (i >= 0 ? 0 : i));
  }, [index]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
  }, [isPlaying]);

  // Space bar toggles play/pause from anywhere, like every real media app —
  // but not while the person is typing in a search box or similar.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'Space' && e.key !== ' ') return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (!queue.length) return;
      e.preventDefault();
      togglePlay();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [togglePlay, queue.length]);

  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current;
    audio.currentTime = seconds;
    setPosition(seconds);
  }, []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    audioRef.current.volume = v / 100;
  }, []);

  const addToQueue = useCallback((track) => {
    setQueue((q) => [...q, track]);
  }, []);

  const value = {
    queue,
    index,
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    expanded,
    queueOpen,
    panelOpen,
    auraColors,
    notice,
    shuffle,
    repeatMode,
    hasNext: shuffle || repeatMode === 'all' ? queue.length > 1 : index + 1 < queue.length,
    hasPrev: index > 0,
    playQueue,
    next,
    prev,
    jumpTo,
    removeFromQueue,
    clearQueue,
    togglePlay,
    seekTo,
    setVolume,
    addToQueue,
    toggleShuffle,
    cycleRepeat,
    setExpanded,
    setQueueOpen,
    setPanelOpen,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="auto" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

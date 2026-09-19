import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { extractAura } from '../lib/colorExtract.js';
import { useLibrary } from './LibraryContext.jsx';

const PlayerContext = createContext(null);
const CONTAINER_ID = 'aura-yt-player';
const DEFAULT_AURA = { primary: 'rgb(124, 140, 255)', secondary: 'rgb(124, 140, 255)' };

// The YouTube IFrame API player object can be in a partially-initialized
// state (or missing a method entirely, e.g. if a browser extension blocked
// part of the embed) even after it's assigned to our ref. Calling a missing
// method threw an uncaught TypeError that crashed the whole React tree with
// no error boundary — this guards every call so a flaky embed degrades
// instead of blanking the page.
function safeCall(player, method, ...args) {
  try {
    if (player && typeof player[method] === 'function') {
      return player[method](...args);
    }
  } catch (err) {
    console.warn(`Aura: player.${method}() failed`, err);
  }
  return undefined;
}

function loadYouTubeApi() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });
}

export function PlayerProvider({ children }) {
  const { addRecent } = useLibrary();
  const playerRef = useRef(null);
  const [ready, setReady] = useState(false);

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

  // Boot the (invisible) YouTube IFrame player once.
  useEffect(() => {
    let cancelled = false;
    const readyTimeout = setTimeout(() => {
      if (!cancelled && !playerRef.current?.getPlayerState) {
        showNotice('The YouTube player didn’t load — an ad blocker or privacy extension may be blocking it. Try disabling extensions or an incognito window.');
      }
    }, 6000);
    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      playerRef.current = new YT.Player(CONTAINER_ID, {
        height: '1',
        width: '1',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          modestbranding: 1,
          // Required for the player's postMessage command channel to work
          // reliably, especially on non-standard localhost ports — without
          // it, play/pause/load calls can silently fail even though the
          // player object itself loads fine.
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            clearTimeout(readyTimeout);
            safeCall(playerRef.current, 'setVolume', volume);
            setReady(true);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === YT.PlayerState.PAUSED) setIsPlaying(false);
            if (e.data === YT.PlayerState.ENDED) {
              if (repeatModeRef.current === 'one') {
                safeCall(playerRef.current, 'seekTo', 0, true);
                safeCall(playerRef.current, 'playVideo');
              } else {
                nextRef.current();
              }
            }
          },
          // Many official label uploads disallow embedding (error 101/150) —
          // without this, clicking such a song just does nothing forever.
          onError: (e) => {
            const messages = {
              2: 'Invalid video — skipping...',
              5: 'Playback error — skipping...',
              100: 'This video is unavailable — skipping...',
              101: "This song's owner disabled playback outside YouTube — skipping...",
              150: "This song's owner disabled playback outside YouTube — skipping...",
            };
            showNotice(messages[e.data] || 'Could not play this song — skipping...');
            nextRef.current();
          },
        },
      });
    });
    return () => {
      cancelled = true;
      clearTimeout(readyTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll playback position — the IFrame API has no time-update event.
  useEffect(() => {
    if (!ready) return undefined;
    const id = setInterval(() => {
      const p = playerRef.current;
      const time = safeCall(p, 'getCurrentTime');
      if (typeof time === 'number') setPosition(time);
      const d = safeCall(p, 'getDuration');
      if (d) setDuration(d);
    }, 500);
    return () => clearInterval(id);
  }, [ready]);

  // Load whichever track `index` points to into the real player. Guarded by
  // lastLoadedRef so editing the queue (e.g. removing an earlier track, which
  // shifts `index` without changing what's actually playing) doesn't restart
  // the currently-playing video.
  const lastLoadedRef = useRef(null);
  useEffect(() => {
    const track = queue[index];
    if (!track || !playerRef.current || !ready) return;
    if (lastLoadedRef.current === track.id) return;
    lastLoadedRef.current = track.id;
    safeCall(playerRef.current, 'loadVideoById', track.id);
    setPosition(0);
    setDuration(0);
    addRecent(track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, queue, ready]);

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
    const p = playerRef.current;
    if (isPlaying) safeCall(p, 'pauseVideo');
    else safeCall(p, 'playVideo');
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
    safeCall(playerRef.current, 'seekTo', seconds, true);
    setPosition(seconds);
  }, []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    safeCall(playerRef.current, 'setVolume', v);
  }, []);

  const addToQueue = useCallback((track) => {
    setQueue((q) => [...q, track]);
  }, []);

  const value = {
    ready,
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
      <div id={CONTAINER_ID} style={{ position: 'fixed', bottom: 0, left: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

// JioSaavn has no official public API. This talks to a community-run,
// unofficial wrapper (https://saavn.sumit.co) that mirrors JioSaavn's own
// internal endpoints — metadata (song/artist/album names, artwork,
// language, year) AND the actual streamable audio files (`downloadUrl`).
// It is NOT run by us or by JioSaavn, so it can go down, rate-limit, or
// change shape without notice; every search degrades to an empty result
// rather than throwing.
//
// Streaming JioSaavn's own licensed audio directly — rather than embedding
// YouTube's official player, which is explicitly permitted by YouTube's
// terms — is a real legal gray area. This app used to deliberately avoid
// it for exactly that reason (see git history). It's used anyway now, by
// choice, to get playback working without depending on any API key or
// quota.
const BASE = 'https://saavn.sumit.co/api';

async function saavnFetch(path, params) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`JioSaavn lookup failed (${res.status})`);
  const body = await res.json();
  if (!body?.success) throw new Error('JioSaavn lookup failed');
  return body.data;
}

// `downloadUrl` is an array of {quality, url} from lowest (12kbps) to
// highest (320kbps) bitrate, all AAC-in-MP4 (plays fine in a plain <audio>
// element). 160kbps is a good default — close to CD quality without being
// wastefully large — falling back to whatever's available if that exact
// tier is missing.
function pickAudioUrl(downloadUrl) {
  if (!downloadUrl?.length) return '';
  const preferred = downloadUrl.find((d) => d.quality === '160kbps');
  return (preferred || downloadUrl[downloadUrl.length - 1])?.url || '';
}

function mapSong(s) {
  const artist = s.artists?.primary?.map((a) => a.name).join(', ') || s.subtitle || 'Unknown artist';
  const image = s.image?.[s.image.length - 1]?.url || s.image?.[0]?.url || '';
  return {
    id: s.id,
    title: s.name,
    artist,
    channel: artist,
    album: s.album?.name || '',
    language: s.language,
    year: s.year,
    durationSec: s.duration,
    thumbnail: image,
    // Convenience only — PlayerContext always re-resolves a fresh URL by
    // `id` right before playing (see getJioSaavnSongById) rather than
    // trusting this one, so a track saved hours/days ago still plays.
    url: pickAudioUrl(s.downloadUrl),
  };
}

function mapAlbum(a) {
  const artist = a.artists?.primary?.map((x) => x.name).join(', ') || a.subtitle || '';
  const image = a.image?.[a.image.length - 1]?.url || a.image?.[0]?.url || '';
  return {
    source: 'jiosaavn',
    jiosaavnId: a.id,
    name: a.name,
    artist,
    language: a.language,
    year: a.year,
    songCount: a.songCount,
    image,
  };
}

// Repeat searches are cached locally purely for snappiness — there's no
// quota or key to protect here, unlike the old YouTube-backed search — and
// so concurrent duplicate calls (e.g. React re-renders) don't double-fetch.
const CACHE_KEY = 'aura.search-cache.v2';
const CACHE_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const inFlight = new Map();

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage full or unavailable — caching is a best-effort optimization */
  }
}

function cached(key, fetcher) {
  const cache = readCache();
  const entry = cache[key];
  if (entry && Date.now() - entry.at < CACHE_TTL_MS) return Promise.resolve(entry.result);
  if (inFlight.has(key)) return inFlight.get(key);

  const promise = fetcher()
    .then((result) => {
      const next = readCache();
      next[key] = { at: Date.now(), result };
      writeCache(next);
      inFlight.delete(key);
      return result;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });
  inFlight.set(key, promise);
  return promise;
}

export async function searchJioSaavnSongs(query, { limit = 20 } = {}) {
  return cached(`songs::${query}::${limit}`, async () => {
    try {
      const data = await saavnFetch('/search/songs', { query, limit });
      return (data?.results || []).map(mapSong);
    } catch {
      return [];
    }
  });
}

export async function searchJioSaavnAlbums(query, { limit = 10 } = {}) {
  return cached(`albums::${query}::${limit}`, async () => {
    try {
      const data = await saavnFetch('/search/albums', { query, limit });
      return (data?.results || []).map(mapAlbum);
    } catch {
      return [];
    }
  });
}

// Fetches one song fresh by its permanent JioSaavn id — used by
// PlayerContext right before playing, so every track (search result,
// curated pick, or something saved to Liked/Playlists days ago) always
// gets a current `downloadUrl` rather than a possibly-stale baked-in one.
// Deliberately not cached, for the same reason.
export async function getJioSaavnSongById(id) {
  const data = await saavnFetch(`/songs/${encodeURIComponent(id)}`, {});
  const song = Array.isArray(data) ? data[0] : data;
  if (!song) throw new Error('Song not found');
  return mapSong(song);
}

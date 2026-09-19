const API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = import.meta.env.VITE_YT_API_KEY;

export const hasApiKey = Boolean(API_KEY);

// The free YouTube Data API quota is 10,000 units/day, and a single
// search.list call costs 100 units — only ~100 searches/day. A song title
// doesn't stop matching the same video tomorrow, so there's no reason to
// ever re-spend quota on a query we've already resolved — this cache is
// effectively permanent (90 days) rather than short-lived, so each unique
// song search costs quota exactly once, ever, instead of repeatedly. This
// also de-dupes concurrent requests for the same query (so React
// re-renders/StrictMode double-invokes don't fire the same search twice).
const CACHE_KEY = 'aura.search-cache.v1';
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

async function ytFetch(endpoint, params) {
  if (!API_KEY) throw new Error('missing-api-key');
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set('key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const reason = body?.error?.errors?.[0]?.reason;
    const message = body?.error?.message || '';
    // Google labels both the daily quota AND short-term throttling as
    // "rateLimitExceeded" — that field alone is unreliable. The quota_limit
    // name in the ErrorInfo details (e.g. "defaultSearchListPerDayPerProject")
    // is the actual signal for which one this is.
    const quotaLimitName = body?.error?.details?.find((d) => d.metadata?.quota_limit)?.metadata?.quota_limit || '';
    const isDaily = /day/i.test(quotaLimitName) || /per day/i.test(message) || reason === 'dailyLimitExceeded';

    if (res.status === 429 && isDaily) {
      throw new Error('Daily search quota (100 searches/day) used up for this Google Cloud project. This is tied to the PROJECT, not the key — a new key in the same project won’t help. Resets at midnight Pacific time (12:30 PM IST), or create a key in a genuinely new/different project.');
    }
    if (res.status === 429) {
      throw new Error('Hit a short-term rate limit (too many requests in a short window) — this clears in a minute or two. Try again shortly.');
    }
    throw new Error(message || `YouTube API error (${res.status}, reason: ${reason || 'unknown'})`);
  }
  return res.json();
}

function mapSearchItem(item) {
  const id = typeof item.id === 'string' ? item.id : item.id?.videoId;
  const sn = item.snippet;
  if (!id || !sn) return null;
  const thumb = sn.thumbnails?.maxres || sn.thumbnails?.high || sn.thumbnails?.medium || sn.thumbnails?.default;
  return {
    id,
    title: sn.title,
    channel: sn.channelTitle,
    thumbnail: thumb?.url,
    publishedAt: sn.publishedAt,
  };
}

async function fetchSearchResults(query, { maxResults = 20 } = {}) {
  const data = await ytFetch('search', {
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '10', // Music category
    maxResults,
    safeSearch: 'none',
  });
  return (data.items || []).map(mapSearchItem).filter(Boolean);
}

export function searchSongs(query, { maxResults = 20 } = {}) {
  const key = `${query}::${maxResults}`;
  const cache = readCache();
  const entry = cache[key];
  if (entry && Date.now() - entry.at < CACHE_TTL_MS) {
    return Promise.resolve(entry.results);
  }

  if (inFlight.has(key)) return inFlight.get(key);

  const promise = fetchSearchResults(query, { maxResults })
    .then((results) => {
      const next = readCache();
      next[key] = { at: Date.now(), results };
      writeCache(next);
      inFlight.delete(key);
      return results;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err;
    });

  inFlight.set(key, promise);
  return promise;
}

// Turns a JioSaavn metadata result (rich, accurate, but not playable) into
// an actual playable track by finding the matching video on YouTube. This
// is the only bridge between the two APIs — JioSaavn never supplies
// anything that gets played directly.
export async function resolveToPlayableTrack(saavnTrack) {
  if (!hasApiKey) {
    throw new Error('Add a free YouTube API key to play songs found this way — see the setup note on the Home page.');
  }
  const query = `${saavnTrack.title} ${saavnTrack.artist}`;
  const results = await searchSongs(query, { maxResults: 3 });
  if (!results.length) {
    throw new Error('Could not find a playable version of this song on YouTube.');
  }
  const best = results[0];
  return {
    id: best.id,
    title: saavnTrack.title,
    artist: saavnTrack.artist,
    channel: saavnTrack.artist,
    album: saavnTrack.album,
    language: saavnTrack.language,
    thumbnail: saavnTrack.image || best.thumbnail,
  };
}

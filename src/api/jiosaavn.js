// JioSaavn has no official public API. This talks to a community-run,
// unofficial wrapper (https://saavn.sumit.co) that mirrors JioSaavn's own
// internal endpoints for metadata — song/artist/album names, artwork,
// language, year. It is NOT run by us or by JioSaavn, so it can go down,
// rate-limit, or change shape without notice; every call here degrades to
// an empty result rather than throwing.
//
// Deliberately unused: this API also returns direct `downloadUrl` links to
// JioSaavn's actual audio files. We never read or expose that field —
// playback in this app only ever happens through YouTube's own official
// embedded player (see api/youtube.js + store/PlayerContext.jsx). Using
// JioSaavn's metadata to describe a song is a reasonable gray area; piping
// their licensed audio through our own player would not be.
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

function mapSong(s) {
  const artist = s.artists?.primary?.map((a) => a.name).join(', ') || s.subtitle || 'Unknown artist';
  const image = s.image?.[s.image.length - 1]?.url || s.image?.[0]?.url || '';
  return {
    source: 'jiosaavn',
    jiosaavnId: s.id,
    title: s.name,
    artist,
    album: s.album?.name || '',
    language: s.language,
    year: s.year,
    durationSec: s.duration,
    image,
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

export async function searchJioSaavnSongs(query, { limit = 20 } = {}) {
  try {
    const data = await saavnFetch('/search/songs', { query, limit });
    return (data?.results || []).map(mapSong);
  } catch {
    return [];
  }
}

export async function searchJioSaavnAlbums(query, { limit = 10 } = {}) {
  try {
    const data = await saavnFetch('/search/albums', { query, limit });
    return (data?.results || []).map(mapAlbum);
  } catch {
    return [];
  }
}

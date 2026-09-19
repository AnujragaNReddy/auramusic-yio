import { CURATED_TRACKS } from './curatedSongs.js';

function tracksByTitle(...titles) {
  return titles.map((t) => CURATED_TRACKS.find((tr) => tr.title === t)).filter(Boolean);
}

// Hand-curated mood mapping over the verified catalog — this is the app's
// signature feature, so each atmosphere gets its own color pair and a
// deliberately chosen (not random) set of tracks that fit the mood.
export const ATMOSPHERES = [
  {
    id: 'rainy-night',
    emoji: '🌧️',
    name: 'Rainy Night',
    tagline: 'Slow down, let it pour.',
    colors: ['#4a5b7a', '#1c2333'],
    trackTitles: ['Someone Like You', 'Tum Hi Ho', 'Kesariya', 'Raataan Lambiyan'],
  },
  {
    id: 'city-lights',
    emoji: '🌆',
    name: 'City Lights',
    tagline: 'Soundtrack for neon streets and late-night drives.',
    colors: ['#ff6a88', '#3a1c4d'],
    trackTitles: ['Blinding Lights', 'Chaleya', 'Arabic Kuthu', 'Uptown Funk'],
  },
  {
    id: 'golden-hour',
    emoji: '🌅',
    name: 'Golden Hour',
    tagline: 'Warm light, warmer feelings.',
    colors: ['#ffb454', '#7a3b2e'],
    trackTitles: ['Perfect', 'Butta Bomma', 'As It Was', 'Samajavaragamana'],
  },
  {
    id: 'nature',
    emoji: '🌲',
    name: 'Nature',
    tagline: 'Breathe easy, let the melody drift.',
    colors: ['#4caf7d', '#123326'],
    trackTitles: ['Enjoy Enjaami', 'Ramuloo Ramulaa', 'Levitating', 'Shape of You'],
  },
  {
    id: 'midnight',
    emoji: '🌌',
    name: 'Midnight',
    tagline: 'Quiet hours, deep sound.',
    colors: ['#7c8cff', '#10102a'],
    trackTitles: ['Kesariya', 'Someone Like You', 'Apna Bana Le', 'Tera Ban Jaunga'],
  },
  {
    id: 'cozy-cafe',
    emoji: '☕',
    name: 'Cozy Cafe',
    tagline: 'Soft sounds, slow mornings.',
    colors: ['#c9915a', '#3a2718'],
    trackTitles: ['Shape of You', 'Butta Bomma', 'As It Was', 'Tum Hi Ho'],
  },
  {
    id: 'open-road',
    emoji: '🚗',
    name: 'Open Road',
    tagline: 'Windows down, volume up.',
    colors: ['#ffd166', '#2e2a1c'],
    trackTitles: ['Rowdy Baby', 'Vaathi Coming', 'Uptown Funk', 'Stay'],
  },
  {
    id: 'ocean',
    emoji: '🌊',
    name: 'Ocean',
    tagline: 'Tides, breeze, and rhythm.',
    colors: ['#4dd0e1', '#0f2b33'],
    trackTitles: ['Levitating', 'Enjoy Enjaami', 'Shape of You', 'Someone Like You'],
  },
  {
    id: 'late-night-energy',
    emoji: '🔥',
    name: 'Late Night Energy',
    tagline: 'Turn it up, one more song.',
    colors: ['#ff4d4d', '#331010'],
    trackTitles: ['Arabic Kuthu', 'Kutti Story', 'Marana Mass', 'Selfie Pulla', 'Why This Kolaveri Di'],
  },
];

export const ATMOSPHERES_WITH_TRACKS = ATMOSPHERES.map((a) => ({
  ...a,
  tracks: tracksByTitle(...a.trackTitles),
}));

// Home's hero picks an atmosphere that fits the time of day — a small nod
// to "your music, your atmosphere" without needing real listening history.
export function getFeaturedAtmosphere() {
  const h = new Date().getHours();
  let id;
  if (h < 6) id = 'late-night-energy';
  else if (h < 11) id = 'cozy-cafe';
  else if (h < 17) id = 'open-road';
  else if (h < 21) id = 'golden-hour';
  else id = 'city-lights';
  return ATMOSPHERES_WITH_TRACKS.find((a) => a.id === id) || ATMOSPHERES_WITH_TRACKS[0];
}

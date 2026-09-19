import { CURATED_TRACKS } from './curatedSongs.js';

function tracksByTitle(...titles) {
  return titles.map((t) => CURATED_TRACKS.find((tr) => tr.title === t)).filter(Boolean);
}

export const MOODS = [
  { id: 'happy', label: 'Happy', trackTitles: ['Butta Bomma', 'Uptown Funk', 'Levitating', 'Rowdy Baby'] },
  { id: 'chill', label: 'Chill', trackTitles: ['As It Was', 'Shape of You', 'Samajavaragamana', 'Enjoy Enjaami'] },
  { id: 'energetic', label: 'Energetic', trackTitles: ['Arabic Kuthu', 'Naatu Naatu', 'Kutti Story', 'Marana Mass'] },
  { id: 'focus', label: 'Focus', trackTitles: ['Samajavaragamana', 'As It Was', 'Levitating'] },
  { id: 'romantic', label: 'Romantic', trackTitles: ['Perfect', 'Tum Hi Ho', 'Srivalli', 'Kesariya'] },
  { id: 'melancholy', label: 'Melancholy', trackTitles: ['Someone Like You', 'Kesariya', 'Raataan Lambiyan'] },
  { id: 'workout', label: 'Workout', trackTitles: ['Uptown Funk', 'Arabic Kuthu', 'Vaathi Coming', 'Blinding Lights'] },
  { id: 'driving', label: 'Driving', trackTitles: ['Blinding Lights', 'Rowdy Baby', 'Stay', 'Chaleya'] },
];

export const MOODS_WITH_TRACKS = MOODS.map((m) => ({ ...m, tracks: tracksByTitle(...m.trackTitles) }));

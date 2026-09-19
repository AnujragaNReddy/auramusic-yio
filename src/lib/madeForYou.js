import { CURATED_TRACKS } from './curatedSongs.js';

function tracksByTitle(...titles) {
  return titles.map((t) => CURATED_TRACKS.find((tr) => tr.title === t)).filter(Boolean);
}

export const MADE_FOR_YOU = [
  {
    id: 'late-night-energy',
    name: 'Late Night Energy',
    description: 'Turn it up, one more song.',
    trackTitles: ['Arabic Kuthu', 'Kutti Story', 'Marana Mass', 'Blinding Lights'],
  },
  {
    id: 'focus-flow',
    name: 'Focus Flow',
    description: 'Steady sound for deep work.',
    trackTitles: ['Samajavaragamana', 'As It Was', 'Levitating'],
  },
  {
    id: 'sunday-slowdown',
    name: 'Sunday Slowdown',
    description: 'Unhurried, easy mornings.',
    trackTitles: ['Perfect', 'Shape of You', 'Someone Like You'],
  },
  {
    id: 'morning-coffee',
    name: 'Morning Coffee',
    description: 'A gentle start to the day.',
    trackTitles: ['Butta Bomma', 'As It Was', 'Srivalli'],
  },
  {
    id: 'main-character',
    name: 'Main Character',
    description: 'Walk like the scene is yours.',
    trackTitles: ['Naatu Naatu', 'Uptown Funk', 'Vaathi Coming'],
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    description: 'Minimal distraction, maximum flow.',
    trackTitles: ['Samajavaragamana', 'Levitating', 'Shape of You'],
  },
];

export const MADE_FOR_YOU_WITH_TRACKS = MADE_FOR_YOU.map((p) => ({ ...p, tracks: tracksByTitle(...p.trackTitles) }));

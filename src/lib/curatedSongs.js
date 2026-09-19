// A hand-picked, individually-verified catalog so Home and most searches
// work with zero YouTube Data API calls (no quota, no key required at all).
// Each video id was checked against YouTube's free oEmbed endpoint to
// confirm it exists and is embeddable before being added here. The Data
// API (quota-limited to ~100 searches/day) only gets hit for songs outside
// this list.
export const CURATED_SONGS = [
  // Telugu
  { id: '4_eEgJhsBMo', title: 'Naatu Naatu', artist: 'Rahul Sipligunj, Kaala Bhairava', album: 'RRR', language: 'telugu' },
  { id: 'uBDCl5c-9qM', title: 'Komuram Bheemudo', artist: 'Kaala Bhairava', album: 'RRR', language: 'telugu' },
  { id: '_1BbDhiiV6A', title: 'Srivalli', artist: 'Sid Sriram', album: 'Pushpa', language: 'telugu' },
  { id: 'vdY5SFZBgnk', title: 'Saami Saami', artist: 'Mounika Yadav', album: 'Pushpa', language: 'telugu' },
  { id: 'x5OfM36VAHI', title: 'Oo Antava', artist: 'Indravathi Chauhan', album: 'Pushpa', language: 'telugu' },
  { id: 'aRGaUZm1_Zg', title: 'Butta Bomma', artist: 'Armaan Malik', album: 'Ala Vaikunthapurramuloo', language: 'telugu' },
  { id: 'f0QEhTJV8L4', title: 'Ramuloo Ramulaa', artist: 'Anurag Kulkarni, Mangli', album: 'Ala Vaikunthapurramuloo', language: 'telugu' },
  { id: 'tflQ33g6I8I', title: 'Samajavaragamana', artist: 'Sid Sriram', album: 'Ala Vaikunthapurramuloo', language: 'telugu' },

  // Tamil
  { id: 'fRD_3vJagxk', title: 'Vaathi Coming', artist: 'Anirudh Ravichander', album: 'Master', language: 'tamil' },
  { id: 'bofvLylz_N8', title: 'Kutti Story', artist: 'Vijay, Anirudh Ravichander', album: 'Master', language: 'tamil' },
  { id: 'KUN5Uf9mObQ', title: 'Arabic Kuthu', artist: 'Anirudh, Jonita Gandhi', album: 'Beast', language: 'tamil' },
  { id: 'x6Q7c9RyMzk', title: 'Rowdy Baby', artist: 'Dhanush, Dhee', album: 'Maari 2', language: 'tamil' },
  { id: 'YR12Z8f1Dh8', title: 'Why This Kolaveri Di', artist: 'Dhanush', album: '3', language: 'tamil' },
  { id: '88iypMO9H7g', title: 'Marana Mass', artist: 'Anirudh Ravichander', album: 'Petta', language: 'tamil' },
  { id: 'xZ92nnR1Pt8', title: 'Selfie Pulla', artist: 'Vijay, Sunidhi Chauhan', album: 'Kaththi', language: 'tamil' },
  { id: 'eYq7WapuDLU', title: 'Enjoy Enjaami', artist: 'Dhee, Arivu', album: 'Enjoy Enjaami', language: 'tamil' },

  // Hindi
  { id: 'NJAv_7lHUIU', title: 'Kesariya', artist: 'Arijit Singh', album: 'Brahmastra', language: 'hindi' },
  { id: 'IJq0yyWug1k', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', language: 'hindi' },
  { id: 'wBtBSmWSP_s', title: 'Apna Bana Le', artist: 'Arijit Singh', album: 'Bhediya', language: 'hindi' },
  { id: 'gvyUuxdRdR4', title: 'Raataan Lambiyan', artist: 'Tanishk Bagchi, Jubin Nautiyal, Asees Kaur', album: 'Shershaah', language: 'hindi' },
  { id: 'LHEU3tE_biU', title: 'Chaleya', artist: 'Arijit Singh, Shilpa Rao', album: 'Jawan', language: 'hindi' },
  { id: 'avVg3pLj_Po', title: 'Tera Ban Jaunga', artist: 'Tulsi Kumar, Akhil Sachdeva', album: 'Kabir Singh', language: 'hindi' },
  { id: 'qFkNATtc3mc', title: 'Ghungroo', artist: 'Arijit Singh, Shilpa Rao', album: 'War', language: 'hindi' },

  // English
  { id: '4NRXx6U8ABQ', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', language: 'english' },
  { id: 'JGwWNGJdvx8', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Divide)', language: 'english' },
  { id: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran', album: '÷ (Divide)', language: 'english' },
  { id: 'qUiMD_Cm8hw', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', language: 'english' },
  { id: 'hLQl3WQQoQ0', title: 'Someone Like You', artist: 'Adele', album: '21', language: 'english' },
  { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson, Bruno Mars', album: 'Uptown Special', language: 'english' },
  { id: 'H5v3kku4y6Q', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", language: 'english' },
  { id: 'kTJczUoc26U', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', album: 'Stay', language: 'english' },
];

export function thumbnailFor(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// `channel` is kept as the display subtitle used everywhere a track renders
// (SongCard, MiniPlayer, etc.) so every card in the app — curated or
// search-sourced — has the same shape.
export const CURATED_TRACKS = CURATED_SONGS.map((song) => ({
  ...song,
  channel: song.artist,
  thumbnail: thumbnailFor(song.id),
}));

// Grouped by album/movie soundtrack for the Albums tab.
export const CURATED_ALBUMS = Object.values(
  CURATED_TRACKS.reduce((acc, track) => {
    const key = track.album;
    if (!acc[key]) {
      acc[key] = {
        id: `album_${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: track.album,
        language: track.language,
        cover: track.thumbnail,
        tracks: [],
      };
    }
    acc[key].tracks.push(track);
    return acc;
  }, {})
);

// Grouped by (primary) artist credit for the Artists tab / artist pages.
export const CURATED_ARTISTS = Object.values(
  CURATED_TRACKS.reduce((acc, track) => {
    const key = track.artist;
    if (!acc[key]) {
      acc[key] = {
        id: `artist_${key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: track.artist,
        image: track.thumbnail,
        languages: new Set(),
        tracks: [],
      };
    }
    acc[key].languages.add(track.language);
    acc[key].tracks.push(track);
    return acc;
  }, {})
).map((a) => ({ ...a, languages: [...a.languages] }));

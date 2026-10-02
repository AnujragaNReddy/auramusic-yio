// A hand-picked, individually-verified catalog so Home and most searches
// work instantly with zero network round-trips for the initial render.
// Each JioSaavn id was checked against the live search API — by title AND
// artist, not just title text — to confirm it resolves to the real master
// recording (not a cover, karaoke version, or instrumental) before being
// added here.
//
// English was dropped from this catalog entirely: JioSaavn's unofficial
// catalog (at least via the wrapper this app uses) does not carry real
// masters for the vast majority of global Western pop hits — searches for
// Blinding Lights, Shape of You, Perfect, Levitating, Someone Like You,
// Uptown Funk, As It Was, and Stay all resolved only to karaoke/cover/
// instrumental uploads sharing the same title, confirmed across ~15 major
// English songs tested. Telugu, Tamil, and Hindi all matched cleanly.
export const CURATED_SONGS = [
  // Telugu
  { id: '-JkPBIE7', title: 'Naatu Naatu', artist: 'Rahul Sipligunj, Kaala Bhairava', album: 'RRR', language: 'telugu', image: 'https://c.saavncdn.com/683/RRR-Telugu-Telugu-2022-20250828171313-500x500.jpg' },
  { id: 'lPFUlQgU', title: 'Komuram Bheemudo', artist: 'Kaala Bhairava', album: 'RRR', language: 'telugu', image: 'https://c.saavncdn.com/683/RRR-Telugu-Telugu-2022-20250828171313-500x500.jpg' },
  { id: '4r-wShBa', title: 'Srivalli', artist: 'Sid Sriram', album: 'Pushpa', language: 'telugu', image: 'https://c.saavncdn.com/blob/056/Pushpa-The-Rise-Telugu-2021-20211216115409-500x500.jpg' },
  { id: 'OByN1gHS', title: 'Saami Saami', artist: 'Mounika Yadav', album: 'Pushpa', language: 'telugu', image: 'https://c.saavncdn.com/blob/056/Pushpa-The-Rise-Telugu-2021-20211216115409-500x500.jpg' },
  { id: 'QOaKBiVi', title: 'Oo Antava', artist: 'Indravathi Chauhan', album: 'Pushpa', language: 'telugu', image: 'https://c.saavncdn.com/blob/056/Pushpa-The-Rise-Telugu-2021-20211216115409-500x500.jpg' },
  { id: '1UqsPO7u', title: 'Butta Bomma', artist: 'Armaan Malik', album: 'Ala Vaikunthapurramuloo', language: 'telugu', image: 'https://c.saavncdn.com/517/Ala-Vaikunthapurramuloo-Telugu-2019-20200116144338-500x500.jpg' },
  { id: 'WrGU-iqE', title: 'Ramuloo Ramulaa', artist: 'Anurag Kulkarni, Mangli', album: 'Ala Vaikunthapurramuloo', language: 'telugu', image: 'https://c.saavncdn.com/517/Ala-Vaikunthapurramuloo-Telugu-2019-20200116144338-500x500.jpg' },
  { id: 'RpFeTE8x', title: 'Samajavaragamana', artist: 'Sid Sriram', album: 'Ala Vaikunthapurramuloo', language: 'telugu', image: 'https://c.saavncdn.com/537/Tremendous-Tunes-Of-Thaman-Telugu-2019-20191113135643-500x500.jpg' },

  // Tamil
  { id: 'IJ3C0q7f', title: 'Vaathi Coming', artist: 'Anirudh Ravichander', album: 'Master', language: 'tamil', image: 'https://c.saavncdn.com/347/Master-Tamil-2020-20200316084627-500x500.jpg' },
  { id: 'L6UDHuug', title: 'Kutti Story', artist: 'Vijay, Anirudh Ravichander', album: 'Master', language: 'tamil', image: 'https://c.saavncdn.com/347/Master-Tamil-2020-20200316084627-500x500.jpg' },
  { id: 'zYTbChor', title: 'Arabic Kuthu', artist: 'Anirudh, Jonita Gandhi', album: 'Beast', language: 'tamil', image: 'https://c.saavncdn.com/735/AiSh-Vol-7-Punjabi-2022-20250701222620-500x500.jpg' },
  { id: 'jS9GUMPM', title: 'Rowdy Baby', artist: 'Dhanush, Dhee', album: 'Maari 2', language: 'tamil', image: 'https://c.saavncdn.com/060/Best-Of-Dhanush-Tamil-2019-20190716135614-500x500.jpg' },
  { id: 'o-IsoK2n', title: 'Why This Kolaveri Di', artist: 'Dhanush', album: '3', language: 'tamil', image: 'https://c.saavncdn.com/932/3-Hindi-2012-500x500.jpg' },
  { id: 'zBvFVakZ', title: 'Marana Mass', artist: 'Anirudh Ravichander', album: 'Petta', language: 'tamil', image: 'https://c.saavncdn.com/166/Petta-Tamil-2018-20181210095910-500x500.jpg' },
  { id: '456BcuDS', title: 'Selfie Pulla', artist: 'Vijay, Sunidhi Chauhan', album: 'Kaththi', language: 'tamil', image: 'https://c.saavncdn.com/689/Kaththi-Tamil-2025-20250930143442-500x500.jpg' },
  { id: 'x2z_VPDG', title: 'Enjoy Enjaami', artist: 'Dhee, Arivu', album: 'Enjoy Enjaami', language: 'tamil', image: 'https://c.saavncdn.com/940/Enjoy-Enjaami-Tamil-2021-20260227060111-500x500.jpg' },

  // Hindi
  { id: 'rjkrTnma', title: 'Kesariya', artist: 'Arijit Singh', album: 'Brahmastra', language: 'hindi', image: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg' },
  { id: 'aRZbUYD7', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', language: 'hindi', image: 'https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg' },
  { id: 'lnig1Z0j', title: 'Apna Bana Le', artist: 'Arijit Singh', album: 'Bhediya', language: 'hindi', image: 'https://c.saavncdn.com/221/Soulful-Hits-Hindi-2026-20260529163806-500x500.jpg' },
  { id: 'mPTrDSun', title: 'Raataan Lambiyan', artist: 'Tanishk Bagchi, Jubin Nautiyal, Asees Kaur', album: 'Shershaah', language: 'hindi', image: 'https://c.saavncdn.com/238/Shershaah-Original-Motion-Picture-Soundtrack--Hindi-2021-20210815181610-500x500.jpg' },
  { id: 'faloMmjX', title: 'Chaleya', artist: 'Arijit Singh, Shilpa Rao', album: 'Jawan', language: 'hindi', image: 'https://c.saavncdn.com/047/Jawan-Hindi-2023-20230921190854-500x500.jpg' },
  { id: 'uf2JX_12', title: 'Tera Ban Jaunga', artist: 'Tulsi Kumar, Akhil Sachdeva', album: 'Kabir Singh', language: 'hindi', image: 'https://c.saavncdn.com/807/Kabir-Singh-Hindi-2019-20240131131003-500x500.jpg' },
  { id: '1I2Ua0sr', title: 'Ghungroo', artist: 'Arijit Singh, Shilpa Rao', album: 'War', language: 'hindi', image: 'https://c.saavncdn.com/881/War-Hindi-2019-20191001104931-500x500.jpg' },
];

// `channel` is kept as the display subtitle used everywhere a track renders
// (SongCard, MiniPlayer, etc.) so every card in the app — curated or
// search-sourced — has the same shape. `thumbnail` mirrors `image` for the
// same reason (search results use `thumbnail`).
export const CURATED_TRACKS = CURATED_SONGS.map((song) => ({
  ...song,
  channel: song.artist,
  thumbnail: song.image,
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

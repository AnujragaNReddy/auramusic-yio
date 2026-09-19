export const LANGUAGES = [
  { id: 'all', label: 'All' },
  { id: 'telugu', label: 'Telugu' },
  { id: 'tamil', label: 'Tamil' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'english', label: 'English' },
];

export const HOME_RAILS = [
  { id: 'telugu-hits', title: 'Telugu Hits', language: 'telugu', query: 'Telugu hit songs 2025' },
  { id: 'telugu-melody', title: 'Telugu Melodies', language: 'telugu', query: 'Telugu melody songs' },
  { id: 'tamil-hits', title: 'Tamil Hits', language: 'tamil', query: 'Tamil hit songs 2025' },
  { id: 'tamil-melody', title: 'Tamil Melodies', language: 'tamil', query: 'Tamil melody love songs' },
  { id: 'hindi-hits', title: 'Bollywood Hits', language: 'hindi', query: 'Hindi Bollywood hit songs 2025' },
  { id: 'hindi-romantic', title: 'Hindi Romantic', language: 'hindi', query: 'Hindi romantic songs' },
  { id: 'english-hits', title: 'English Top Charts', language: 'english', query: 'English top hit songs 2025' },
  { id: 'english-chill', title: 'English Chill', language: 'english', query: 'English chill pop acoustic songs' },
];

export function railsForLanguage(languageId) {
  if (languageId === 'all') return HOME_RAILS;
  return HOME_RAILS.filter((r) => r.language === languageId);
}

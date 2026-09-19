const NOISE_PATTERNS = [
  /\(?\[?official\s*(music\s*)?video\)?\]?/gi,
  /\(?\[?official\s*audio\)?\]?/gi,
  /\(?\[?official\)?\]?/gi,
  /\(?\[?lyrical\s*video\)?\]?/gi,
  /\(?\[?lyric\s*video\)?\]?/gi,
  /\(?\[?full\s*video\)?\]?/gi,
  /\(?\[?full\s*song\)?\]?/gi,
  /\(?\[?video\s*song\)?\]?/gi,
  /\(?\[?audio\)?\]?/gi,
  /\(?\[?hd\)?\]?/gi,
  /\(?\[?4k\)?\]?/gi,
];

export function cleanTitle(raw = '') {
  let t = raw;
  for (const pattern of NOISE_PATTERNS) t = t.replace(pattern, '');
  t = t.replace(/[-|]\s*$/, '').replace(/^\s*[-|]/, '');
  t = t.replace(/\s{2,}/g, ' ').trim();
  return t || raw;
}

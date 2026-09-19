// YouTube gives us no real waveform data, so we generate a deterministic
// stylized one seeded by track id — same song always renders the same
// "waveform" shape instead of looking random/fake on every render.
export function generateWaveform(seed = '', bars = 56) {
  let x = 0;
  for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0;
  if (x === 0) x = 12345;

  const values = [];
  for (let i = 0; i < bars; i++) {
    x = (x * 1103515245 + 12345) >>> 0;
    const n = (x % 1000) / 1000;
    values.push(0.22 + n * 0.78);
  }
  return values;
}

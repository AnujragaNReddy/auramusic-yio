const cache = new Map();

function hashColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return {
    primary: `hsl(${hue}, 72%, 52%)`,
    secondary: `hsl(${(hue + 45) % 360}, 70%, 42%)`,
  };
}

// Extracts an approximate dominant color pair from an image for the "Aura" glow.
// Falls back to a deterministic hash-based color (seeded by track id) if the
// image fails to load in time or the canvas read is blocked by CORS.
export function extractAura(imageUrl, seed) {
  if (!imageUrl) return Promise.resolve(hashColor(seed || 'aura'));
  if (cache.has(imageUrl)) return Promise.resolve(cache.get(imageUrl));

  return new Promise((resolve) => {
    const fallback = hashColor(seed || imageUrl);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => resolve(fallback), 1500);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 200) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (!count) return resolve(fallback);

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        const result = {
          primary: `rgb(${r}, ${g}, ${b})`,
          secondary: `rgb(${Math.min(255, r + 35)}, ${Math.min(255, g + 15)}, ${Math.max(0, b - 25)})`,
        };
        cache.set(imageUrl, result);
        resolve(result);
      } catch {
        resolve(fallback);
      }
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(fallback);
    };
    img.src = imageUrl;
  });
}

# Aura

A music streaming webapp for Telugu, Tamil, Hindi, and English songs — designed to look and feel like nothing else out there. No sidebar-and-grid layout, no corporate red/orange branding. Instead: a mood-reactive "Aura" that recolors the entire UI to match whatever song is playing, a spinning album-art disc instead of a flat player bar, and horizontal "dial rails" you scroll through like tuning a radio instead of static playlist grids.

## Why YouTube, and why that's the free + legal choice

Real Telugu/Tamil/Hindi/English commercial songs are copyrighted — this app doesn't host, download, or store any audio itself (that would be piracy). Instead it uses **YouTube's official Data API and embeddable player**: every major label (T-Series, Aditya Music, Think Music, Saregama, Sony Music South, and more) publishes officially on YouTube, and embedding their player is explicitly permitted by YouTube's terms. Aura just wraps that official player in a completely custom interface — the video element itself is shrunk to 1 pixel and hidden, so all you see is the custom UI, but YouTube is the one actually serving the audio/video stream.

## Stack (100% free)

- React 18 + Vite — frontend, static build, no backend needed
- YouTube Data API v3 — search (free quota: 10,000 units/day, no card required for the API itself)
- YouTube IFrame Player API — actual playback engine
- lucide-react — icons (MIT)
- Google Fonts (Space Grotesk + Manrope) — typography
- Browser `localStorage` — Liked Songs, playlists, recently played (no accounts, no backend, no database)

## One-time setup: get a free YouTube API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/library/youtube.googleapis.com) and create a project (or use an existing one) — no card required.
2. Enable **YouTube Data API v3** for that project.
3. Go to **Credentials** → **Create Credentials** → **API key**.
4. (Recommended) Restrict the key to "YouTube Data API v3" and, once you know your deployed domain, restrict it by HTTP referrer so nobody else can use your key/quota.
5. In this project's root, create a file named `.env` (copy `.env.example`) with:
   ```
   VITE_YT_API_KEY=your-key-here
   ```

Without this key, the app still runs and shows a friendly setup screen instead of crashing — search and playback just won't work until the key is added.

## Running it

```bash
npm install
npm run dev
```
Opens on http://localhost:5174.

## Features

- **Aura backdrop** — the whole page's ambient color glow shifts live to match each song's album art (canvas-based color extraction, with a deterministic hash-based fallback if an image can't be read)
- **Spinning disc now-playing view** — full-screen player with a rotating vinyl-style disc, stylized waveform scrubber (seeded per song so it's consistent, not random noise), and playback controls
- **Dial rails** — horizontal scroll-snap carousels for browsing (Home has curated rails per language: Telugu Hits, Telugu Melodies, Tamil Hits, Tamil Melodies, Bollywood Hits, Hindi Romantic, English Top Charts, English Chill)
- Language filter pills (All / Telugu / Tamil / Hindi / English)
- Search across all of YouTube's music catalog
- Queue with reordering/removal, shown as a slide-in drawer
- Liked Songs and custom playlists — persisted in your browser, no account needed
- Recently played, shown on Home
- Fully responsive (mobile-friendly)

## Known limitations (v1)

- **No accounts / cross-device sync** — Liked Songs and playlists live in your browser's `localStorage` only. Clearing browser data or switching devices loses them. This is a deliberate scope choice for v1; the same accounts+database pattern used in the ChatterBox project (Node/Express/SQLite + JWT) could be added later if you want playlists to follow you across devices.
- **Waveform is stylized, not real** — YouTube's API doesn't expose actual audio waveform data, so the scrubber shows a deterministic pattern seeded by song ID (same song always looks the same) rather than a true waveform.
- **Song metadata is whatever the uploader titled the video** — titles are cleaned up with heuristics (stripping "(Official Video)", "| Lyrical", etc.) but won't be perfectly accurate the way a licensed music database would be.

## Deploying (free)

Since this is a fully static site (no backend), it deploys anywhere that hosts static files for free — Render (Static Site, not Web Service — no Dockerfile needed), Netlify, Vercel, GitHub Pages, or Cloudflare Pages all work. General steps for any of them:

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variable `VITE_YT_API_KEY` in the host's dashboard (same key from setup above) — it gets baked into the build at build time.
4. Once you know your deployed domain, go back to Google Cloud Console and restrict your API key by that HTTP referrer, so nobody else can ride on your free quota.

Want a walkthrough for a specific host once you're ready to deploy — just ask.

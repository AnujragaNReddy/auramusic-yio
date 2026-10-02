# Aura

A music streaming webapp for Telugu, Tamil, and Hindi songs — designed to look and feel like nothing else out there. No sidebar-and-grid layout, no corporate red/orange branding. Instead: a mood-reactive "Aura" that recolors the entire UI to match whatever song is playing, a spinning album-art disc instead of a flat player bar, and horizontal "dial rails" you scroll through like tuning a radio instead of static playlist grids.

## Streaming source: JioSaavn (unofficial)

Playback and search both go through a community-run, unofficial wrapper around JioSaavn's own internal endpoints (`https://saavn.sumit.co`) — not run by us or by JioSaavn. It returns real metadata (title, artist, artwork, language) and real streamable audio URLs per song, with no API key or quota required.

This is a genuine legal gray area — different from embedding YouTube's official player (which this app used previously, and which is explicitly permitted by YouTube's terms). Streaming JioSaavn's own licensed audio directly is not officially sanctioned, and the unofficial wrapper could change shape, rate-limit, or disappear without notice. It's used anyway, by choice, to get playback working without depending on any key, quota, or embed.

**Catalog gap, English songs:** JioSaavn's catalog (at least via this wrapper) does not carry real masters for most global Western pop hits — searches for things like Blinding Lights, Shape of You, or Someone Like You only turn up karaoke/cover/instrumental uploads sharing the same title, confirmed across ~15 major English songs. That's why Aura is scoped to Telugu/Tamil/Hindi; English search still works but results may well be covers rather than the original.

## Stack (100% free)

- React 18 + Vite — frontend, static build, no backend needed
- JioSaavn (unofficial API) — search, metadata, and the actual audio stream
- A plain HTML5 `<audio>` element — playback engine
- lucide-react — icons (MIT)
- Google Fonts (Space Grotesk + Manrope) — typography
- Browser `localStorage` — Liked Songs, playlists, recently played (no accounts, no backend, no database)

## Running it

```bash
npm install
npm run dev
```
Opens on http://localhost:5174.

## Features

- **Aura backdrop** — the whole page's ambient color glow shifts live to match each song's album art (canvas-based color extraction, with a deterministic hash-based fallback if an image can't be read)
- **Spinning disc now-playing view** — full-screen player with a rotating vinyl-style disc, stylized waveform scrubber (seeded per song so it's consistent, not random noise), and playback controls
- **Dial rails** — horizontal scroll-snap carousels for browsing (Made For You, Quick Picks, Recently Played on Home)
- Search across JioSaavn's catalog (strongest for Telugu/Tamil/Hindi — see the catalog gap note above)
- Queue with reordering/removal, shown as a slide-in drawer
- Liked Songs and custom playlists — persisted in your browser, no account needed
- Recently played, shown on Home
- Fully responsive (mobile-friendly)

## Known limitations (v1)

- **No accounts / cross-device sync** — Liked Songs and playlists live in your browser's `localStorage` only. Clearing browser data or switching devices loses them. This is a deliberate scope choice for v1; the same accounts+database pattern used in the ChatterBox project (Node/Express/SQLite + JWT) could be added later if you want playlists to follow you across devices.
- **Waveform is stylized, not real** — the API doesn't expose actual audio waveform data, so the scrubber shows a deterministic pattern seeded by song ID (same song always looks the same) rather than a true waveform.
- **No real masters for most English/Western pop** — see the catalog gap note above.
- **No audio-quality setting yet** — playback always requests JioSaavn's 160kbps tier; trivial to expose as a Settings toggle later if wanted.

## Deploying (free)

Since this is a fully static site (no backend, no API key needed anymore), it deploys anywhere that hosts static files for free — Render (Static Site, not Web Service — no Dockerfile needed), Netlify, Vercel, GitHub Pages, or Cloudflare Pages all work. General steps for any of them:

1. Build command: `npm run build`
2. Publish directory: `dist`

Want a walkthrough for a specific host once you're ready to deploy — just ask.

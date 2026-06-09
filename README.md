# SONIVIO v2 — Premium Music Streaming Platform

<img width="1918" height="909" alt="SONIVIO Preview" src="https://github.com/user-attachments/assets/0874eef9-4626-4d93-b7fd-a3de7e15d439" />

**SONIVIO v2** is a fast, highly accessible, and visually premium music streaming portfolio application built with a Vercel-inspired stark minimal design. It uses server-side rendering (SSR), Astro Islands architecture, and a secure API proxy layer to stream music directly via the YouTube Data API v3 without exposing sensitive API credentials to the client.

---

## ✨ Features

### Core Capabilities
* **Search**: Discover songs, artists, albums, and playlists on YouTube.
* **Continuous Playback**: Play, pause, seek, adjust volume, skip tracks, and mute.
* **Persistent Queue**: Add, remove, and reorder songs. Queue state is saved between sessions.
* **Custom Playlists**: Create, rename, delete, and add tracks to custom personal playlists.
* **Favorites & History**: Save tracks to your favorites list and view your recently played tracks.
* **Mood Mixes**: Launch curated search queries dynamically (e.g. Focus, Chill, Energy).

### Advanced Engineering Features
* **Islands Architecture**: Pre-renders static pages to pure HTML on the server, while mounting interactive audio player elements as React components.
* **Continuous Audio Stream (ClientRouter)**: Uses Astro's `<ClientRouter />` (View Transitions) and persistent React islands (`transition:persist`) to keep music playing seamlessly across page navigations.
* **Secure API Layer**: Implements a serverless proxy route `/api/youtube.ts` to protect Google API credentials from being visible in client browsers.
* **Zustand State Architecture**: Uses four distinct, decoupled Zustand stores (`playerStore`, `queueStore`, `libraryStore`, `uiStore`) to manage playback, queue list, local cache/history, and modal displays.
* **Virtual List Rendering**: Employs `@tanstack/react-virtual` to virtualize large listening histories, maintaining 60FPS scrolling.

---

## 🧰 Tech Stack

* **Framework**: Astro (SSR Mode)
* **Styling**: Tailwind CSS v4 (CSS-First Theme Config)
* **State Management**: Zustand (Local Persistence)
* **Animation**: Framer Motion
* **API Engine**: YouTube Data API v3 (Edge Proxy Route)
* **Hosting/Server**: Cloudflare Pages (`workerd` runtime)

---

## 📦 Getting Started

### Prerequisites
* Node.js v20 or newer
* A YouTube Data API v3 key from the [Google Cloud Console](https://console.cloud.google.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vijaybarhate/SONIVIO-Music-Player.git
   cd SONIVIO-Music-Player
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   VITE_YOUTUBE_API_KEY=AIzaSy...your_youtube_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:4321` in your browser.

---

## 🏗️ Folder Structure

```
d:\Projects\SONIVIO-Music-Player\
├── src/
│   ├── layouts/
│   │   └── Layout.astro            # Global Astro HTML layout and ClientRouter mount
│   ├── pages/
│   │   ├── index.astro             # Home route (Discover feed)
│   │   ├── search.astro            # Search route
│   │   ├── library.astro           # Library route (Favorites, Playlists, History)
│   │   ├── about.astro             # About system documentation
│   │   ├── artist/
│   │   │   └── [channelId].astro   # Dynamic route for artist details
│   │   ├── playlist/
│   │   │   └── [id].astro          # Dynamic route for playlist details
│   │   └── api/
│   │       └── youtube.ts          # Server-side YouTube Data API proxy
│   ├── react-pages/                # React screen implementations
│   ├── components/                 # Modular React components
│   ├── store/                      # Zustand state store slice folder
│   ├── services/
│   │   └── youtube.ts              # API client wrapper
│   ├── hooks/                      # Custom hooks (e.g. useCurrentPath, useDebounce)
│   └── styles/
│       └── global.css              # Tailwind CSS v4 CSS-first config stylesheet
├── tsconfig.json                   # Astro type configuration
├── package.json                    # Project metadata & npm modules
├── wrangler.toml                   # Cloudflare compatibility configurations
└── astro.config.ts                 # Astro compiler configuration
```

---

## 🚀 Cloudflare Pages Deployment

All edge function routes are fully compatible with Cloudflare's `workerd` runtime.

1. Build the project locally to compile static files and serverless routes:
   ```bash
   npm run build
   ```

2. Test the build locally with Wrangler local emulation:
   ```bash
   npx wrangler pages dev dist
   ```

3. Deploy to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist --project-name=sonivio-player
   ```

*Make sure `VITE_YOUTUBE_API_KEY` is added to your environment variables in the Cloudflare Pages settings panel.*

---

Built with 🖤 by [Vijay Barhate](https://github.com/vijaybarhate)

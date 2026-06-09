import { defineConfig, sessionDrivers } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const isGithubPages = process.env.DEPLOY_PLATFORM === 'gh-pages';

// https://astro.build/config
export default defineConfig({
  output: isGithubPages ? 'static' : 'server',
  base: isGithubPages ? '/SONIVIO-Music-Player' : '/',
  adapter: isGithubPages ? undefined : cloudflare({
    imageService: 'passthrough',
    prerenderEnvironment: 'node'
  }),
  session: isGithubPages ? undefined : {
    driver: sessionDrivers.lruCache()
  },
  integrations: [
    react()
  ],
  vite: {
    plugins: [tailwindcss() as any],
    optimizeDeps: {
      include: ['picomatch']
    }
  }
});


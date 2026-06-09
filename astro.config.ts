import { defineConfig, sessionDrivers } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
    prerenderEnvironment: 'node'
  }),
  session: {
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


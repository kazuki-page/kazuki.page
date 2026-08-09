// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kazuki.page',

  // 現行 WordPress および blog.kazuki.page と揃える
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  integrations: [sitemap()],
});

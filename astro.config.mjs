// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://dickensandballsworth.com',
  adapter: netlify(),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});

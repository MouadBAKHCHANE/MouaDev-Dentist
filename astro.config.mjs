// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cabinetdentairechorfi.com',
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'never',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/studio') && !page.includes('/blog-article'),
      customPages: [
        'https://www.cabinetdentairechorfi.com/',
        'https://www.cabinetdentairechorfi.com/services',
        'https://www.cabinetdentairechorfi.com/contact',
        'https://www.cabinetdentairechorfi.com/blog',
        'https://www.cabinetdentairechorfi.com/qui-sommes-nous',
        'https://www.cabinetdentairechorfi.com/plan-du-site',
        'https://www.cabinetdentairechorfi.com/politique-de-confidentialite',
      ],
    }),
  ]
});
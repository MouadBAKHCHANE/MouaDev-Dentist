// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { createClient } from '@sanity/client';

// Fetch blog slugs for sitemap at build time
async function getBlogSlugsForSitemap() {
  try {
    const sanityClient = createClient({
      projectId: process.env.SANITY_PROJECT_ID || 'slklyupp',
      dataset: process.env.SANITY_DATASET || 'production',
      useCdn: true,
      apiVersion: '2024-01-01',
    });
    const slugs = await sanityClient.fetch(`*[_type == "blogPost"]{ "slug": slug.current }`);
    return slugs.map((s) => `https://www.cabinetdentairechorfi.com/blog/${s.slug}`);
  } catch {
    return [];
  }
}

const blogUrls = await getBlogSlugsForSitemap();

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
        ...blogUrls,
      ],
    }),
  ]
});
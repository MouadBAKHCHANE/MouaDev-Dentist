import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Load SANITY_API_TOKEN from website/.env if not already in env
if (!process.env.SANITY_API_TOKEN) {
  try {
    const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}

const client = createClient({
  projectId: 'slklyupp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const footerCopyright =
  '© 2026 Cabinet Dentaire Chorfi | Tous droits réservés. Conçu par <a href="https://wa.me/212611714711" target="_blank" rel="noopener noreferrer" class="text-white font-medium hover:text-oralix-brand transition-colors">MouaDev</a> - <a href="https://www.instagram.com/hosniayoub_?utm_source=qr" target="_blank" rel="noopener noreferrer" class="text-white font-medium hover:text-oralix-brand transition-colors">Ayoub HOSNI</a>.';

async function main() {
  const doc = await client.fetch(`*[_type == "siteSettings"][0]{ _id, footerCopyright }`);
  if (!doc) {
    console.log('⚠ No siteSettings document found.');
    return;
  }
  console.log('Before:', doc.footerCopyright);
  await client.patch(doc._id).set({ footerCopyright }).commit();
  console.log(`✓ Updated footerCopyright on ${doc._id}`);
}

main().catch((e) => {
  console.error('✗ Failed:', e.message);
  process.exit(1);
});

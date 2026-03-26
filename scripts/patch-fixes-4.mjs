import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const envFile = fs.readFileSync(path.join(ROOT, '.env'), 'utf-8')
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=')).map(l => {
    const [key, ...rest] = l.split('=')
    return [key.trim(), rest.join('=').trim()]
  })
)

const client = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
})

async function patch() {
  console.log('Fixing Services Page Badge && Blog Page Categories...')
  
  // 1. Services Page Badge
  const svc = await client.fetch('*[_type == "servicesPage"][0]{_id, badge}')
  if (svc) {
    const newBadge = (svc.badge || '').replace(/^[•\s]+/, '')
    await client.patch(svc._id).set({ badge: newBadge }).commit()
    console.log('Patched servicesPage badge:', newBadge)
  }

  // 2. Blog Page Categories
  const bp = await client.fetch('*[_type == "blogPage"][0]{_id, filterCategories}')
  if (bp && bp.filterCategories) {
    const newCat = bp.filterCategories.filter(c => c !== 'Soin de Canal' && c !== 'Prévention' && c.toLowerCase() !== 'soin de canal' && c.toLowerCase() !== 'prévention')
    await client.patch(bp._id).set({ filterCategories: newCat }).commit()
    console.log('Patched blogPage categories:', newCat)
  }
}
patch().catch(console.error)

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

async function patchFixes2() {
  console.log('Patching Sanity documents Part 2...')

  // 1. clinicFeature
  const features = await client.fetch('*[_type == "clinicFeature"]{_id, title}')
  for (const f of features) {
    if (f.title.includes('Accueil & Conseil')) {
      await client.patch(f._id).set({ title: 'Accueil et Conseil' }).commit()
      console.log(`Patched clinicFeature: ${f._id}`)
    }
  }

  // 2. service
  const services = await client.fetch('*[_type == "service"]{_id, features}')
  for (const s of services) {
    if (s.features && Array.isArray(s.features)) {
      const newFeatures = s.features.map(feat => 
        feat.includes('Brackets & Gouttières') ? 'Brackets et Gouttières' : feat
      )
      
      if (JSON.stringify(newFeatures) !== JSON.stringify(s.features)) {
        await client.patch(s._id).set({ features: newFeatures }).commit()
        console.log(`Patched service: ${s._id}`)
      }
    }
  }

  console.log('All patches completed!')
}

patchFixes2().catch(console.error)

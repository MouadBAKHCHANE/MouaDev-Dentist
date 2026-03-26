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

async function patchFixes() {
  console.log('Patching Sanity documents...')
  
  // 1. Contact Page
  await client
    .patch('contactPage')
    .set({
      contactInfoAddressTitle: 'Notre adresse',
      contactInfoHoursDetails: ["Lundi-Vendredi : 09h - 13h | 15h - 19h", "Samedi : 09h - 13h"]
    })
    .commit()
    .catch(err => console.error("Could not patch contactPage", err.message))
  console.log('Patched contactPage')

  // 2. Blog Page
  await client
    .patch('blogPage')
    .set({ filterCategories: [] })
    .commit()
    .catch(err => console.error("Could not patch blogPage", err.message))
  console.log('Patched blogPage')

  // 3. Blog Posts
  const posts = await client.fetch('*[_type == "blogPost"]{_id, slug, content}')
  
  for (const post of posts) {
    if (post.slug?.current === 'facettes-et-couronnes') {
      const content = post.content || []
      let modified = false
      for (let block of content) {
        if (block.text?.includes('Subtilité avant tout')) {
          block.text = 'La facette dentaire : La subtilité avant tout'
          modified = true
        }
        if (block.text?.includes('Reconstitution Complète')) {
          block.text = 'La couronne : La reconstitution complète'
          modified = true
        }
      }
      if (modified) {
        await client.patch(post._id).set({ content }).commit()
        console.log(`Patched blogPost: ${post.slug.current}`)
      }
    }
    
    if (post.slug?.current === 'ecoute-meilleur-outil') {
      const content = post.content || []
      let modified = false
      for (let block of content) {
        if (block.text?.includes('Douceur comme Standard')) {
          block.text = 'La douceur comme standard'
          modified = true
        }
      }
      if (modified) {
        await client.patch(post._id).set({ content }).commit()
        console.log(`Patched blogPost: ${post.slug.current}`)
      }
    }
  }

  console.log('All patches completed!')
}

patchFixes().catch(console.error)

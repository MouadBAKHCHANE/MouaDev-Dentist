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

async function check() {
  const res = await client.fetch('*[_type == "service"]{_id, features}')
  console.log(JSON.stringify(res, null, 2))
}

check().catch(console.error)

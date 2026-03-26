import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'slklyupp'
const dataset = import.meta.env.SANITY_DATASET || process.env.SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

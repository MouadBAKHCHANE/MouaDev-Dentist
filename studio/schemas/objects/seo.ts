import { defineField } from 'sanity'

/**
 * Reusable SEO fields to add to any page schema.
 * Usage: ...seoFields  (spread into fields array)
 */
export const seoFields = [
  defineField({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    group: 'seo',
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({
        name: 'metaTitle',
        title: 'Titre SEO',
        type: 'string',
        description: 'Titre affiché dans Google (50-60 caractères recommandés)',
        validation: (Rule) => Rule.max(70).warning('Le titre ne devrait pas dépasser 60 caractères'),
      }),
      defineField({
        name: 'metaDescription',
        title: 'Description SEO',
        type: 'text',
        rows: 3,
        description: 'Description affichée dans Google (150-160 caractères recommandés)',
        validation: (Rule) => Rule.max(160).warning('La description ne devrait pas dépasser 160 caractères'),
      }),
      defineField({
        name: 'ogImage',
        title: 'Image de partage (Open Graph)',
        type: 'image',
        description: 'Image affichée lors du partage sur Facebook/WhatsApp/LinkedIn (1200x630px recommandé)',
      }),
      defineField({
        name: 'noIndex',
        title: 'Masquer de Google',
        type: 'boolean',
        description: 'Activer pour empêcher Google d\'indexer cette page',
        initialValue: false,
      }),
    ],
  }),
]

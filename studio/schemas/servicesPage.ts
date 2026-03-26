import { defineType, defineField } from 'sanity'
import { DocumentsIcon } from '@sanity/icons'
import { seoFields } from './objects/seo'

export default defineType({
  name: 'servicesPage',
  title: 'Page Services',
  type: 'document',
  icon: DocumentsIcon,
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'videoUrl',
      title: 'URL Vidéo Hero',
      type: 'url',
    }),
    defineField({
      name: 'posterImage',
      title: 'Image poster vidéo',
      type: 'image',
    }),
    defineField({
      name: 'stats',
      title: 'Statistiques',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'value', type: 'string', title: 'Valeur' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'serviceCTAText',
      title: 'Texte bouton CTA service',
      type: 'string',
    }),
    ...seoFields,
  ],
})

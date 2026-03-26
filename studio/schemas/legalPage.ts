import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'legalPage',
  title: 'Page Légale',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'pageId',
      title: 'Identifiant page',
      type: 'string',
      description: 'Ex: "politique-de-confidentialite"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre (header)',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre (badge)',
      type: 'string',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Dernière mise à jour',
      type: 'string',
      description: 'Ex: "28 Février 2026"',
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'type',
              type: 'string',
              title: 'Type',
              options: {
                list: [
                  { title: 'Titre H2', value: 'h2' },
                  { title: 'Paragraphe', value: 'p' },
                  { title: 'Liste', value: 'ul' },
                ],
              },
            }),
            defineField({ name: 'text', type: 'text', title: 'Texte', rows: 4 }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'pageId' },
    prepare({ title }) {
      return { title: title || 'Page légale' }
    },
  },
})

import { defineType, defineField } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export default defineType({
  name: 'sitemapSection',
  title: 'Section Plan du Site',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'orderRank',
      title: 'Ordre',
      type: 'number',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Liens',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Nom' }),
            defineField({ name: 'href', type: 'string', title: 'Lien' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'category' },
  },
})

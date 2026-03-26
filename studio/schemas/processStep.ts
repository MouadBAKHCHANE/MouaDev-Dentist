import { defineType, defineField } from 'sanity'
import { ActivityIcon } from '@sanity/icons'

export default defineType({
  name: 'processStep',
  title: 'Étape du Processus',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'orderRank',
      title: 'Ordre',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'features',
      title: 'Points clés',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', orderRank: 'orderRank' },
    prepare({ title, media, orderRank }) {
      return {
        title: `${String(orderRank).padStart(2, '0')} — ${title}`,
        media,
      }
    },
  },
})

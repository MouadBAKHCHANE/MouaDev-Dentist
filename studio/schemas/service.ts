import { defineType, defineField } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: BulbOutlineIcon,
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
      rows: 3,
    }),
    defineField({
      name: 'features',
      title: 'Caractéristiques',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'link',
      title: 'Lien CTA',
      type: 'string',
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

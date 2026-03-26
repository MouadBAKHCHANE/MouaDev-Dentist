import { defineType, defineField } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export default defineType({
  name: 'clinicFeature',
  title: 'Équipement du Cabinet',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'orderRank',
      title: 'Ordre',
      type: 'number',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
  },
})

import { defineType, defineField } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export default defineType({
  name: 'beforeAfterCase',
  title: 'Cas Avant / Après',
  type: 'document',
  icon: ImagesIcon,
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
      name: 'beforeImage',
      title: 'Image Avant',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'afterImage',
      title: 'Image Après',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', media: 'beforeImage' },
  },
})

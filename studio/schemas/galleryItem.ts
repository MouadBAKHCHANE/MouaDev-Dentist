import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export default defineType({
  name: 'galleryItem',
  title: 'Élément Galerie',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'orderRank',
      title: 'Ordre',
      type: 'number',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Vidéo', value: 'video' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type === 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Chemin vidéo',
      type: 'string',
      description: 'Chemin relatif, ex: /videos/Dr Zainab vd 1 st.MP4',
      hidden: ({ parent }) => parent?.type === 'image',
    }),
    defineField({
      name: 'videoPoster',
      title: 'Poster vidéo',
      type: 'image',
      hidden: ({ parent }) => parent?.type === 'image',
    }),
  ],
  preview: {
    select: { title: 'type', media: 'image', orderRank: 'orderRank' },
    prepare({ title, media, orderRank }) {
      return {
        title: `${orderRank ?? '?'} — ${title === 'video' ? 'Vidéo' : 'Image'}`,
        media,
      }
    },
  },
})

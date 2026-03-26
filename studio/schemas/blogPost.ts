import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { seoFields } from './objects/seo'

export default defineType({
  name: 'blogPost',
  title: 'Article',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Esthétique Dentaire', value: 'Esthétique Dentaire' },
          { title: 'Approche Humaine', value: 'Approche Humaine' },
          { title: 'Hygiène & Prévention', value: 'Hygiène & Prévention' },
          { title: 'Soin de Canal', value: 'Soin de Canal' },
          { title: 'Implants Dentaires', value: 'Implants Dentaires' },
          { title: 'Orthodontie', value: 'Orthodontie' },
          { title: 'Prévention', value: 'Prévention' },
          { title: 'Technologie', value: 'Technologie' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Date (texte)',
      type: 'string',
      description: 'Ex: "12 Mars 2026"',
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
      initialValue: 'Dr Zainab Chorfi',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isTall',
      title: 'Carte haute (mise en page)',
      type: 'boolean',
      initialValue: false,
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
                  { title: 'Paragraphe', value: 'p' },
                  { title: 'Titre H2', value: 'h2' },
                ],
              },
            }),
            defineField({ name: 'text', type: 'text', title: 'Texte', rows: 4 }),
          ],
          preview: {
            select: { title: 'text', subtitle: 'type' },
            prepare({ title, subtitle }) {
              return {
                title: title?.substring(0, 80) + (title?.length > 80 ? '...' : ''),
                subtitle: subtitle === 'h2' ? 'Titre' : 'Paragraphe',
              }
            },
          },
        },
      ],
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', date: 'date' },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date || 'Pas de date',
      }
    },
  },
})

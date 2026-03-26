import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'
import { seoFields } from './objects/seo'

export default defineType({
  name: 'blogPage',
  title: 'Page Blog',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Titre de la page',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'pageBadge',
      title: 'Badge de la page',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'filterCategories',
      title: 'Catégories de filtre',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'readArticleText',
      title: 'Texte "Lire l\'article"',
      type: 'string',
      group: 'content',
    }),
    ...seoFields,
  ],
})

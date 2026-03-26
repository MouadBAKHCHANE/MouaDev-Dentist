import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'
import { seoFields } from './objects/seo'

export default defineType({
  name: 'contactPage',
  title: 'Page Contact',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    { name: 'content', title: 'Contenu', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Titre de la page',
      type: 'string',
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Sous-titre (badge)',
      type: 'string',
    }),
    defineField({
      name: 'headerImage',
      title: 'Image header',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'formBadge',
      title: 'Badge formulaire',
      type: 'string',
    }),
    defineField({
      name: 'formTitle',
      title: 'Titre formulaire',
      type: 'string',
    }),
    defineField({
      name: 'serviceOptions',
      title: 'Options de soins (formulaire)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'helpTitle',
      title: 'Titre section aide',
      type: 'string',
    }),
    defineField({
      name: 'helpText',
      title: 'Texte section aide',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'URL embed Google Maps',
      type: 'url',
    }),
    defineField({
      name: 'contactInfoPhoneTitle',
      title: 'Titre info téléphone',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoAddressTitle',
      title: 'Titre info adresse',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoHoursTitle',
      title: 'Titre info horaires',
      type: 'string',
    }),
    defineField({
      name: 'contactInfoHoursDetails',
      title: 'Détails horaires',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'faqBadge',
      title: 'Badge FAQ',
      type: 'string',
    }),
    defineField({
      name: 'faqTitle',
      title: 'Titre FAQ',
      type: 'string',
    }),
    defineField({
      name: 'helpCtaText',
      title: 'Texte CTA aide',
      type: 'string',
    }),
    defineField({
      name: 'mapBadge',
      title: 'Badge carte',
      type: 'string',
    }),
    defineField({
      name: 'mapTitle',
      title: 'Titre carte',
      type: 'string',
    }),
    defineField({
      name: 'mapButtonText',
      title: 'Texte bouton carte',
      type: 'string',
    }),
    ...seoFields,
  ],
})

import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'
import { seoFields } from './objects/seo'

export default defineType({
  name: 'aboutPage',
  title: 'Page Qui Sommes-Nous',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'bio', title: 'Biographie' },
    { name: 'clinic', title: 'Cabinet' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ──
    defineField({
      name: 'doctorName',
      title: 'Nom du docteur',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'doctorTitle',
      title: 'Titre du docteur',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'doctorImage',
      title: 'Photo du docteur',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),
    defineField({
      name: 'heroLocationLabel',
      title: 'Label localisation',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroLocationAddress',
      title: 'Adresse localisation',
      type: 'text',
      group: 'hero',
    }),
    defineField({
      name: 'heroLocationLinkText',
      title: 'Texte lien localisation',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroContactLabel',
      title: 'Label contact',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroContactPhone',
      title: 'Téléphone contact',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroContactEmail',
      title: 'Email contact',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHoraireLabel',
      title: 'Label horaires',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHoraires',
      title: 'Horaires',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'day', type: 'string', title: 'Jour' }),
            defineField({ name: 'hours', type: 'string', title: 'Heures' }),
            defineField({ name: 'isClosed', type: 'boolean', title: 'Fermé ?' }),
          ],
        },
      ],
    }),

    // ── Biographie ──
    defineField({
      name: 'bioTitle',
      title: 'Titre biographie',
      type: 'string',
      group: 'bio',
    }),
    defineField({
      name: 'bioText',
      title: 'Texte biographie',
      type: 'text',
      group: 'bio',
    }),
    defineField({
      name: 'expertiseTitle',
      title: "Titre section expertise",
      type: 'string',
      group: 'bio',
    }),

    // ── Cabinet ──
    defineField({
      name: 'clinicTitle',
      title: 'Titre cabinet',
      type: 'string',
      group: 'clinic',
    }),
    defineField({
      name: 'clinicSubtitle',
      title: 'Sous-titre cabinet',
      type: 'text',
      group: 'clinic',
    }),

    ...seoFields,
  ],
})

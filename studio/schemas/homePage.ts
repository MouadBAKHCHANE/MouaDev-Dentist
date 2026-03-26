import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'
import { seoFields } from './objects/seo'

export default defineType({
  name: 'homePage',
  title: "Page d'Accueil",
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'about', title: 'À Propos' },
    { name: 'services', title: 'Services' },
    { name: 'process', title: 'Processus' },
    { name: 'blog', title: 'Blog' },
    { name: 'cta', title: 'CTA Rendez-vous' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ──
    defineField({
      name: 'heroSlides',
      title: 'Images Diaporama',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Texte alternatif' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Titre principal',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Sous-titre',
      type: 'text',
      rows: 2,
      group: 'hero',
    }),
    defineField({
      name: 'heroCTAText',
      title: 'Texte du bouton CTA',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroCTALink',
      title: 'Lien du bouton CTA',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroReviewText',
      title: 'Texte avis hero',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroReviewVerified',
      title: 'Texte "avis vérifié"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubCtaText',
      title: 'Texte sous-CTA hero',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubCtaLink',
      title: 'Lien sous-CTA hero',
      type: 'string',
      group: 'hero',
    }),

    // ── About ──
    defineField({
      name: 'aboutBadge',
      title: 'Badge section À propos',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutButtonText',
      title: 'Texte bouton À propos',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutButtonLink',
      title: 'Lien bouton À propos',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutText',
      title: 'Texte "Qui sommes-nous"',
      type: 'text',
      rows: 5,
      group: 'about',
    }),
    defineField({
      name: 'aboutDoctorImage',
      title: 'Photo du docteur',
      type: 'image',
      options: { hotspot: true },
      group: 'about',
    }),
    defineField({
      name: 'aboutDoctorName',
      title: 'Nom du docteur',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutDoctorTitle',
      title: 'Titre du docteur',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutCTAText',
      title: 'Texte bouton "À propos"',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'aboutCTALink',
      title: 'Lien bouton "À propos"',
      type: 'string',
      group: 'about',
    }),
    defineField({
      name: 'pillars',
      title: 'Piliers / Valeurs',
      type: 'array',
      group: 'about',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Titre' }),
            defineField({ name: 'description', type: 'text', title: 'Description', rows: 2 }),
          ],
        },
      ],
    }),

    // ── Services ──
    defineField({
      name: 'servicesBadge',
      title: 'Badge section Services',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesTitle',
      title: 'Titre section Services',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesButtonText',
      title: 'Texte bouton Services',
      type: 'string',
      group: 'services',
    }),
    defineField({
      name: 'servicesButtonLink',
      title: 'Lien bouton Services',
      type: 'string',
      group: 'services',
    }),

    // ── Processus ──
    defineField({
      name: 'processBadge',
      title: 'Badge section Processus',
      type: 'string',
      group: 'process',
    }),
    defineField({
      name: 'processTitle',
      title: 'Titre section Processus',
      type: 'string',
      group: 'process',
    }),
    defineField({
      name: 'processTitleHighlight',
      title: 'Titre surligné Processus',
      type: 'string',
      group: 'process',
    }),
    defineField({
      name: 'processSubtitle',
      title: 'Sous-titre Processus',
      type: 'text',
      group: 'process',
    }),

    // ── Blog ──
    defineField({
      name: 'blogBadge',
      title: 'Badge section Blog',
      type: 'string',
      group: 'blog',
    }),
    defineField({
      name: 'blogTitle',
      title: 'Titre section Blog',
      type: 'string',
      group: 'blog',
    }),
    defineField({
      name: 'blogButtonText',
      title: 'Texte bouton Blog',
      type: 'string',
      group: 'blog',
    }),

    // ── CTA ──
    defineField({
      name: 'ctaHeadline',
      title: 'Titre CTA',
      type: 'text',
      rows: 2,
      group: 'cta',
    }),
    defineField({
      name: 'ctaCTAText',
      title: 'Texte bouton CTA',
      type: 'string',
      group: 'cta',
    }),
    defineField({
      name: 'ctaCTALink',
      title: 'Lien bouton CTA',
      type: 'url',
      group: 'cta',
    }),
    defineField({
      name: 'ctaFloatingImages',
      title: 'Images flottantes',
      type: 'array',
      group: 'cta',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'image', type: 'image', title: 'Image' }),
            defineField({ name: 'class', type: 'string', title: 'Classes CSS position' }),
            defineField({ name: 'speed', type: 'number', title: 'Vitesse parallax' }),
          ],
        },
      ],
    }),
    ...seoFields,
  ],
})

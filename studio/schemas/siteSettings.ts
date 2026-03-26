import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'
import { seoFields } from './objects/seo'

export default defineType({
  name: 'siteSettings',
  title: 'Paramètres du Site',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'general', title: 'Général', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'form', title: 'Formulaire de contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'siteDescription',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'aboutText',
      title: 'Texte "À propos" (Footer)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'phones',
      title: 'Téléphones',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'object',
      fields: [
        defineField({ name: 'street', type: 'string', title: 'Rue' }),
        defineField({ name: 'floor', type: 'string', title: 'Étage' }),
        defineField({ name: 'city', type: 'string', title: 'Ville' }),
        defineField({ name: 'mapUrl', type: 'url', title: 'Lien Google Maps' }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', type: 'string', title: 'Plateforme' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'businessHours',
      title: "Horaires d'ouverture",
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'days', type: 'string', title: 'Jours' }),
            defineField({ name: 'hours', type: 'string', title: 'Heures' }),
            defineField({ name: 'isClosed', type: 'boolean', title: 'Fermé ?' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'googleRating',
      title: 'Note Google',
      type: 'number',
    }),
    defineField({
      name: 'googleReviewCount',
      title: 'Nombre d\'avis Google',
      type: 'string',
    }),
    defineField({
      name: 'appointmentUrl',
      title: 'Lien Rendez-vous (Dentisto)',
      type: 'url',
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'Numéro WhatsApp',
      type: 'string',
    }),
    // ── Navigation ──
    defineField({
      name: 'navLinks',
      title: 'Liens de navigation',
      type: 'array',
      group: 'navigation',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'href', type: 'string', title: 'Lien' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'Texte bouton CTA',
      type: 'string',
      group: 'navigation',
    }),
    defineField({
      name: 'ctaButtonLink',
      title: 'Lien bouton CTA',
      type: 'string',
      group: 'navigation',
    }),
    defineField({
      name: 'locationButtonText',
      title: 'Texte bouton localisation',
      type: 'string',
      group: 'navigation',
    }),
    defineField({
      name: 'googleMapsButtonText',
      title: 'Texte bouton Google Maps',
      type: 'string',
      group: 'navigation',
    }),

    // ── Footer ──
    defineField({
      name: 'footerAboutTitle',
      title: 'Titre section À propos (Footer)',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerNavTitle',
      title: 'Titre section Navigation (Footer)',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerHoraireTitle',
      title: 'Titre section Horaires (Footer)',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerContactTitle',
      title: 'Titre section Contact (Footer)',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Texte copyright (Footer)',
      type: 'string',
      group: 'footer',
    }),

    // ── Formulaire de contact ──
    defineField({
      name: 'formLabelName',
      title: 'Label champ Nom',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formLabelPhone',
      title: 'Label champ Téléphone',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formLabelEmail',
      title: 'Label champ Email',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formLabelService',
      title: 'Label champ Service',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formLabelDate',
      title: 'Label champ Date',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formServicePlaceholder',
      title: 'Placeholder sélection service',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formDisclaimerText',
      title: 'Texte avertissement formulaire',
      type: 'text',
      group: 'form',
    }),
    defineField({
      name: 'formSubmitText',
      title: 'Texte bouton envoyer',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formSuccessMessage',
      title: 'Message de succès',
      type: 'text',
      group: 'form',
    }),
    defineField({
      name: 'formErrorMessage',
      title: "Message d'erreur",
      type: 'text',
      group: 'form',
    }),

    ...seoFields,
  ],
})

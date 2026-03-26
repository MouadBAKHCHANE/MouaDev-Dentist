import { defineType, defineField } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'testimonial',
  title: 'Témoignage',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date (texte)',
      type: 'string',
      description: 'Ex: "Il y a 6 mois"',
    }),
    defineField({
      name: 'stats',
      title: 'Statistiques',
      type: 'string',
      description: 'Ex: "2 avis" ou "31 avis"',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      description: 'Ex: "Local Guide" (optionnel)',
    }),
    defineField({
      name: 'text',
      title: 'Texte du témoignage',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stars',
      title: 'Étoiles',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: 'avatarColor',
      title: "Couleur de l'avatar",
      type: 'string',
      description: 'Code hex, ex: #EA4335',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'text' },
  },
})

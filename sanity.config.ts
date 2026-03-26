import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './studio/schemas'

const singletonTypes = ['siteSettings', 'homePage', 'servicesPage', 'contactPage']

const singleton = (S: any, title: string, schemaType: string) =>
  S.listItem()
    .title(title)
    .id(schemaType)
    .child(S.document().schemaType(schemaType).documentId(schemaType))

export default defineConfig({
  name: 'cabinet-chorfi',
  title: 'Cabinet Dentaire Chorfi',

  projectId: 'slklyupp',
  dataset: 'production',

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            singleton(S, 'Paramètres du Site', 'siteSettings'),
            singleton(S, "Page d'Accueil", 'homePage'),
            singleton(S, 'Page Services', 'servicesPage'),
            singleton(S, 'Page Contact', 'contactPage'),

            S.divider(),

            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('processStep').title('Processus de Soin'),
            S.documentTypeListItem('beforeAfterCase').title('Avant / Après'),
            S.documentTypeListItem('testimonial').title('Témoignages'),
            S.documentTypeListItem('galleryItem').title('Galerie'),

            S.divider(),

            S.documentTypeListItem('blogPost').title('Articles'),
            S.documentTypeListItem('faq').title('FAQ'),
            S.documentTypeListItem('teamMember').title('Équipe'),
            S.documentTypeListItem('clinicFeature').title('Le Cabinet'),

            S.divider(),

            S.documentTypeListItem('legalPage').title('Pages Légales'),
            S.documentTypeListItem('sitemapSection').title('Plan du Site'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },
})

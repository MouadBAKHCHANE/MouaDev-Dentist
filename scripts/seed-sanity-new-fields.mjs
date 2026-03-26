import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'slklyupp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function patchByType(type, patches) {
  const doc = await client.fetch(`*[_type == "${type}"][0]{ _id }`);
  if (!doc) {
    console.log(`⚠ No document found for type: ${type}, creating...`);
    await client.create({ _type: type, ...patches });
    console.log(`✓ Created ${type}`);
    return;
  }
  await client.patch(doc._id).set(patches).commit();
  console.log(`✓ Updated ${type} (${doc._id})`);
}

async function main() {
  console.log('--- Seeding new Sanity fields ---\n');

  // === SITE SETTINGS ===
  console.log('== Site Settings ==');
  await patchByType('siteSettings', {
    navLinks: [
      { _type: 'object', _key: 'nav1', label: 'Accueil', href: '/' },
      { _type: 'object', _key: 'nav2', label: 'Le Cabinet', href: '/qui-sommes-nous' },
      { _type: 'object', _key: 'nav3', label: 'Nos Soins', href: '/services' },
      { _type: 'object', _key: 'nav4', label: 'Articles', href: '/blog' },
      { _type: 'object', _key: 'nav5', label: 'Contact', href: '/contact' }
    ],
    ctaButtonText: 'Prendre Rendez-vous',
    ctaButtonLink: '/contact',
    locationButtonText: 'Voir Localisation',
    googleMapsButtonText: 'Ouvrir dans Google Maps',
    footerAboutTitle: 'À propos',
    footerNavTitle: 'Navigation',
    footerHoraireTitle: 'Horaires',
    footerContactTitle: 'Contact',
    footerCopyright: '© 2026 Cabinet Dentaire Chorfi | Tous droits réservés. Conçu par <a href="https://wa.me/212611714711" target="_blank" rel="noopener noreferrer" class="text-white font-medium hover:text-oralix-brand transition-colors">MouaDev</a>.',
    formLabelName: 'Nom Complet',
    formLabelPhone: 'Téléphone',
    formLabelEmail: 'E-mail',
    formLabelService: 'Type de soin',
    formLabelDate: 'Date souhaitée',
    formServicePlaceholder: 'Choisir un soin',
    formDisclaimerText: "J'autorise le cabinet à me recontacter pour confirmer mon rendez-vous*",
    formSubmitText: 'Confirmer ma demande de rendez-vous',
    formSuccessMessage: 'Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.',
    formErrorMessage: 'Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.',
    googleMapsUrl: 'https://www.google.com/maps/place/CABINET+DENTAIRE+CHORFI+Dr+CHORFI+Zainab/@34.0377681,-6.8033237,17z'
  });

  // === HOME PAGE ===
  console.log('\n== Home Page ==');
  await patchByType('homePage', {
    heroReviewText: 'Témoignages et avis',
    heroReviewVerified: 'Vérifiés sur Google',
    heroSubCtaText: 'Qui sommes-nous?',
    heroSubCtaLink: '/qui-sommes-nous',
    heroSubtitle: 'Préparez-vous à des traitements sans douleur et à un sourire que vous adorerez !',
    aboutBadge: 'Qui sommes-nous ?',
    aboutButtonText: 'À propos du Cabinet Dentaire Chorfi',
    aboutButtonLink: '/qui-sommes-nous',
    servicesBadge: 'Nos soins',
    servicesTitle: 'Nos soins',
    servicesButtonText: 'Voir Tous Les Services',
    servicesButtonLink: '/services',
    processBadge: 'Notre Méthode de Travail',
    processTitle: 'Processus de',
    processTitleHighlight: 'Soin',
    processSubtitle: 'De votre première visite à votre check-up final, nous avons simplifié chaque étape pour votre confort.',
    blogBadge: 'Articles',
    blogTitle: 'Nos articles',
    blogButtonText: "Lire plus d'articles",
    ctaCTAText: 'Prendre Rendez-vous',
    ctaCTALink: '/contact'
  });

  // === SERVICES PAGE ===
  console.log('\n== Services Page ==');
  await patchByType('servicesPage', {
    serviceCTAText: 'Contactez-nous'
  });

  // === CONTACT PAGE ===
  console.log('\n== Contact Page ==');
  await patchByType('contactPage', {
    contactInfoPhoneTitle: 'Téléphone',
    contactInfoAddressTitle: 'Notre Adresse',
    contactInfoHoursTitle: "Horaires d'ouverture",
    contactInfoHoursDetails: ['Lun - Ven: 09h - 13h | 15h - 19h', 'Sam : 09h - 13h'],
    faqBadge: 'Questions fréquentes',
    faqTitle: 'Aide et informations',
    helpCtaText: 'Contactez-nous',
    mapBadge: 'Localisation',
    mapTitle: 'Nous trouver au cabinet',
    mapButtonText: 'Ouvrir dans Google Maps'
  });

  // === BLOG PAGE (new singleton) ===
  console.log('\n== Blog Page ==');
  const blogDoc = await client.fetch(`*[_type == "blogPage"][0]{ _id }`);
  if (!blogDoc) {
    await client.create({
      _type: 'blogPage',
      pageTitle: 'Conseils et actualités dentaires',
      pageBadge: 'Articles',
      filterCategories: ['Soin de Canal', 'Esthétique Dentaire', 'Implants Dentaires', 'Orthodontie', 'Prévention'],
      readArticleText: "Lire l'article"
    });
    console.log('✓ Created blogPage');
  } else {
    await client.patch(blogDoc._id).set({
      pageTitle: 'Conseils et actualités dentaires',
      pageBadge: 'Articles',
      filterCategories: ['Soin de Canal', 'Esthétique Dentaire', 'Implants Dentaires', 'Orthodontie', 'Prévention'],
      readArticleText: "Lire l'article"
    }).commit();
    console.log('✓ Updated blogPage');
  }

  // === ABOUT PAGE (new singleton) ===
  console.log('\n== About Page ==');
  const aboutDoc = await client.fetch(`*[_type == "aboutPage"][0]{ _id }`);
  if (!aboutDoc) {
    await client.create({
      _type: 'aboutPage',
      doctorName: 'Dr Zainab Chorfi',
      doctorTitle: 'Chirurgien-dentiste',
      heroLocationLabel: 'Localisation',
      heroLocationAddress: 'Avenue Moulay Youssef n° 19, 1er étage Tabriquet, Salé',
      heroLocationLinkText: 'Voir sur Google Maps',
      heroContactLabel: 'Contact',
      heroContactPhone: '+212 644-801152',
      heroContactEmail: 'contact@cabinetdentairechorfi.ma',
      heroHoraireLabel: 'Horaires',
      heroHoraires: [
        { _type: 'object', _key: 'h1', day: 'Lundi – Vendredi', hours: '09h - 13h | 15h - 19h', isClosed: false },
        { _type: 'object', _key: 'h2', day: 'Samedi', hours: '09h - 13h', isClosed: false },
        { _type: 'object', _key: 'h3', day: 'Dimanche', hours: 'Fermé', isClosed: true }
      ],
      bioTitle: 'Notre Fondatrice',
      bioText: "Le Dr Chorfi Zainab transforme l'expérience du patient en un moment serein et personnalisé.",
      expertiseTitle: 'Expertises Clés',
      clinicTitle: 'Notre <br/> Clinique',
      clinicSubtitle: "Un espace moderne conçu pour votre confort, avec un équipement de pointe et une ambiance apaisante pour des soins d'exception."
    });
    console.log('✓ Created aboutPage');
  } else {
    console.log('✓ aboutPage already exists');
  }

  // === Publish any drafts ===
  console.log('\n== Publishing drafts ==');
  const drafts = await client.fetch(`*[_id in path("drafts.**")]{ _id, _type }`);
  for (const draft of drafts) {
    const publishedId = draft._id.replace('drafts.', '');
    const draftDoc = await client.fetch(`*[_id == $id][0]`, { id: draft._id });
    delete draftDoc._id;
    delete draftDoc._rev;
    await client.createOrReplace({ ...draftDoc, _id: publishedId });
    await client.delete(draft._id);
    console.log(`  Published: ${publishedId}`);
  }

  console.log('\n--- All Sanity fields seeded! ---');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });

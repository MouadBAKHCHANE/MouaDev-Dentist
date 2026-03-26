import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'slklyupp',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Helper: patch a document by query
async function patchByType(type, patches) {
  const doc = await client.fetch(`*[_type == "${type}"][0]{ _id }`);
  if (!doc) {
    console.log(`⚠ No document found for type: ${type}`);
    return;
  }
  await client.patch(doc._id).set(patches).commit();
  console.log(`✓ Updated ${type} (${doc._id})`);
}

// Helper: patch all documents of a type
async function patchAllByType(type, matchField, updates) {
  const docs = await client.fetch(`*[_type == "${type}"]{ _id, ${matchField} }`);
  for (const doc of docs) {
    const update = updates.find(u => u.match === doc[matchField]);
    if (update) {
      await client.patch(doc._id).set(update.set).commit();
      console.log(`✓ Updated ${type}: ${doc[matchField]}`);
    }
  }
}

async function main() {
  console.log('--- Updating Sanity CMS content ---\n');

  // =============================================
  // 1. HOME PAGE (homePage singleton)
  // =============================================
  console.log('== Page 1: Home ==');

  // About text (comma after Salé + reworded)
  await patchByType('homePage', {
    aboutText: "Situé en plein centre de Salé, le Cabinet Dentaire Chorfi propose des soins dentaires de qualité dans un cadre calme, professionnel et rassurant. Le cabinet dispose d'équipements récents, d'une approche humaine et d'une écoute attentive de chaque patient. Votre confort et votre confiance sont au cœur de notre engagement.",
    // CTA headline
    ctaHeadline: "Obtenez le sourire que vous méritez <br /> dès aujourd'hui !",
    // Pillars
    pillars: [
      { _type: 'object', _key: 'p1', title: "Expertise", description: "Plusieurs années de savoir-faire au service de votre sourire." },
      { _type: 'object', _key: 'p2', title: "Sérénité", description: "Une approche douce et psychologique pour des soins sans stress." },
      { _type: 'object', _key: 'p3', title: "Innovation", description: "Des technologies de pointe pour une précision maximale." },
      { _type: 'object', _key: 'p4', title: "Accompagnement", description: "Un parcours de soin sur mesure et un suivi attentif." }
    ]
  });

  // =============================================
  // 2. SITE SETTINGS
  // =============================================
  console.log('\n== Site Settings ==');
  await patchByType('siteSettings', {
    aboutText: "Le Cabinet Dentaire Chorfi à Salé vous offre des soins dentaires complets et de haute qualité. Le Dr Zainab Chorfi vous accueille dans un environnement confortable pour vos traitements en omnipratique, en esthétique dentaire et en prévention.",
    address: {
      _type: 'object',
      street: "Avenue Moulay Youssef n° 19",
      floor: "1er étage",
      city: "Tabriquet, Salé",
      mapUrl: "https://www.google.com/maps/place/CABINET+DENTAIRE+CHORFI+Dr+CHORFI+Zainab/@34.0377681,-6.8033237,17z"
    },
    businessHours: [
      { _type: 'object', _key: 'bh1', days: 'Lundi – Vendredi', hours: '09h - 13h | 15h - 19h', isClosed: false },
      { _type: 'object', _key: 'bh2', days: 'Samedi', hours: '09h - 13h', isClosed: false },
      { _type: 'object', _key: 'bh3', days: 'Dimanche', hours: 'Fermé', isClosed: true }
    ]
  });

  // =============================================
  // 3. SERVICES (individual service documents)
  // =============================================
  console.log('\n== Services ==');
  await patchAllByType('service', 'title', [
    {
      match: "Dentisterie esthétique",
      set: {
        description: "Amélioration du sourire grâce à des traitements modernes et sur mesure.",
      }
    },
    {
      match: "Dentisterie restauratrice",
      set: {
        description: "Protégez vos dents grâce à des restaurations adaptées",
      }
    },
    {
      match: "Implantologie",
      set: {
        features: ["Remplacement durable", "Stabilité totale", "Confort et esthétique"]
      }
    },
    {
      match: "Orthodontie",
      set: {
        features: ["Bilans orthodontiques", "Évaluations complètes", "Brackets & Gouttières"]
      }
    }
  ]);

  // =============================================
  // 4. BLOG POSTS
  // =============================================
  console.log('\n== Blog Posts ==');
  const blogPosts = await client.fetch(`*[_type == "blogPost"]{ _id, title }`);
  for (const post of blogPosts) {
    let newTitle = post.title;
    if (post.title.includes("Réinventer Son Sourire")) newTitle = post.title.replace("Réinventer Son Sourire", "réinventer son sourire");
    if (post.title.includes("l'Écoute est notre Meilleur Outil")) newTitle = post.title.replace("l'Écoute est notre Meilleur Outil", "l'écoute est notre meilleur outil");
    if (post.title.includes("Le Trio Gagnant pour un Sourire Éclatant")) newTitle = "Le trio gagnant pour un sourire éclatant";
    if (newTitle !== post.title) {
      await client.patch(post._id).set({ title: newTitle }).commit();
      console.log(`✓ Updated blog: ${post.title} → ${newTitle}`);
    }
  }

  // =============================================
  // 5. SERVICES PAGE (servicesPage singleton)
  // =============================================
  console.log('\n== Services Page ==');
  await patchByType('servicesPage', {
    badge: "• Services",
    title: "Nos soins",
    stats: [
      { _type: 'object', _key: 's1', label: "années d'expérience", value: "Plusieurs" },
      { _type: 'object', _key: 's2', label: "sourires transformés", value: "De nombreux" }
    ]
  });

  // =============================================
  // 6. CONTACT PAGE (contactPage singleton)
  // =============================================
  console.log('\n== Contact Page ==');
  await patchByType('contactPage', {
    pageTitle: "Prêt pour un nouveau sourire ?",
  });

  // =============================================
  // 7. TEAM MEMBER (Dr Chorfi)
  // =============================================
  console.log('\n== Team Member ==');
  const team = await client.fetch(`*[_type == "teamMember"][0]{ _id, trainings }`);
  if (team) {
    const newTrainings = (team.trainings || []).map(t => {
      let updated = t;
      if (t.startsWith("Certifié en")) updated = t.replace("Certifié en", "Certifiée en");
      if (t === "Formation de facettes composite stratifié") updated = "Formation en facettes composites stratifiées";
      if (t === "Certificat post universitaire en orthopédie dento-faciale") updated = "Certificat post-universitaire en orthopédie";
      return updated;
    });
    await client.patch(team._id).set({
      name: "Dr Zainab Chorfi",
      title: "Chirurgien-dentiste",
      trainings: newTrainings
    }).commit();
    console.log('✓ Updated team member: Dr Zainab Chorfi');
  }

  // =============================================
  // 8. CLINIC FEATURES
  // =============================================
  console.log('\n== Clinic Features ==');
  await patchAllByType('clinicFeature', 'title', [
    { match: "Scan 3D & Digital", set: { title: "Scan 3D et empreintes numériques" } },
    { match: "Imagerie Avancée", set: { title: "Imagerie avancée" } },
    { match: "Soins Personnalisés", set: { title: "Soins personnalisés" } },
    { match: "Espace d'Attente", set: { title: "Espace d'attente" } },
    { match: "Accueil & Conseil", set: { title: "Accueil & Conseil", description: "Un accueil personnalisé pour vous accompagner dans votre parcours de soins." } },
    { match: "Radiographie Panoramique", set: { title: "Radiographie panoramique" } },
  ]);

  // =============================================
  // 9. FAQ
  // =============================================
  console.log('\n== FAQ ==');
  await patchAllByType('faq', 'question', [
    {
      match: "Quelles sont les méthodes de paiement ?",
      set: { answer: "Nous acceptons les espèces, les chèques, les virements bancaires." }
    }
  ]);

  console.log('\n--- All Sanity CMS updates complete! ---');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

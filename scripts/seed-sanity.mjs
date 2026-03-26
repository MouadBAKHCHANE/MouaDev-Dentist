/**
 * Seed script: Populate Sanity with all current hardcoded content
 * Run: node scripts/seed-sanity.mjs
 * Requires SANITY_API_TOKEN in .env
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ── Read .env manually ────────────────────────────────
const envFile = fs.readFileSync(path.join(ROOT, '.env'), 'utf-8')
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=')).map(l => {
    const [key, ...rest] = l.split('=')
    return [key.trim(), rest.join('=').trim()]
  })
)

const client = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
})

// ── Image upload helper ───────────────────────────────
const imageCache = {}

async function uploadImage(relativePath) {
  if (imageCache[relativePath]) return imageCache[relativePath]

  const absolutePath = path.join(ROOT, 'public', relativePath)
  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠ Image not found: ${relativePath}`)
    return null
  }

  try {
    const asset = await client.assets.upload('image', fs.createReadStream(absolutePath), {
      filename: path.basename(relativePath),
    })
    const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    imageCache[relativePath] = ref
    console.log(`  ✓ Uploaded: ${relativePath}`)
    return ref
  } catch (err) {
    console.error(`  ✗ Failed to upload ${relativePath}:`, err.message)
    return null
  }
}

// ── Seed functions ────────────────────────────────────

async function seedSiteSettings() {
  console.log('\n▸ Seeding siteSettings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Cabinet Dentaire Chorfi',
    siteDescription: 'Le Cabinet Dentaire Chorfi à Salé vous offre des soins dentaires complets et de haute qualité.',
    aboutText: "Le Cabinet Dentaire Chorfi à Salé vous offre des soins dentaires complets et de haute qualité. Le Dr Zainab Chorfi vous accueille dans un environnement confortable pour vos traitements en omnipratique, esthétique dentaire et prévention.",
    phones: ['0644801152', '0538716787'],
    email: 'contact@cabinetdentairechorfi.ma',
    address: {
      street: 'Avenue Moulay Youssef n 19',
      floor: '1er étage',
      city: 'Tabriquet, Salé',
      mapUrl: 'https://www.google.com/maps/place/CABINET+DENTAIRE+CHORFI+Dr+CHORFI+Zainab/@34.0378219,-6.803389,17z',
    },
    socialLinks: [
      { _key: 'ig', platform: 'Instagram', url: 'https://www.instagram.com/cabinet.dentaire.chorfi/' },
      { _key: 'fb', platform: 'Facebook', url: 'https://www.facebook.com/61576404963248/about/' },
      { _key: 'wa', platform: 'WhatsApp', url: 'https://wa.me/212644801152' },
      { _key: 'dt', platform: 'Dentisto', url: 'https://dentisto.ma/rendez-vous/docteurs/chorfi-zainab-2520' },
    ],
    businessHours: [
      { _key: 'lv', days: 'Lundi - Vendredi', hours: '09h - 13h | 15h - 19h', isClosed: false },
      { _key: 'sa', days: 'Samedi', hours: '09h - 13h', isClosed: false },
      { _key: 'di', days: 'Dimanche', hours: 'Fermé', isClosed: true },
    ],
    googleRating: 5.0,
    googleReviewCount: '10+ avis',
    appointmentUrl: 'https://dentisto.ma/rendez-vous/docteurs/chorfi-zainab-2520',
    whatsappNumber: '212644801152',
  })
  console.log('  ✓ siteSettings created')
}

async function seedHomePage() {
  console.log('\n▸ Seeding homePage...')

  const heroSlides = []
  const slideFiles = [
    { path: '/images/Diaporama hero image/1ere photo.webp', alt: 'Cabinet Dentaire Chorfi 1' },
    { path: '/images/Diaporama hero image/2eme photo.webp', alt: 'Cabinet Dentaire Chorfi 2' },
    { path: '/images/Diaporama hero image/3eme photo.webp', alt: 'Cabinet Dentaire Chorfi 3' },
    { path: '/images/Diaporama hero image/4eme photo.webp', alt: 'Cabinet Dentaire Chorfi 4' },
    { path: '/images/Diaporama hero image/5eme photo.webp', alt: 'Cabinet Dentaire Chorfi 5' },
  ]

  for (const slide of slideFiles) {
    const img = await uploadImage(slide.path)
    if (img) {
      heroSlides.push({ _key: `slide-${heroSlides.length}`, ...img, alt: slide.alt })
    }
  }

  const drImage = await uploadImage('/images/le cabinet/dr-chorfi-office.jpg.webp')

  const floatingImages = []
  const floatingFiles = [
    { path: '/moroccan_patient_1_1772212564642.webp', class: 'top-[10%] left-[15%] w-24 h-24 lg:w-32 lg:h-32', speed: 50 },
    { path: '/moroccan_patient_2_1772212578695.webp', class: 'top-[20%] right-[20%] w-20 h-20 lg:w-28 lg:h-28', speed: -40 },
    { path: '/moroccan_patient_3_1772212594944.webp', class: 'bottom-[20%] left-[10%] w-28 h-28 lg:w-36 lg:h-36', speed: 30 },
    { path: '/moroccan_patient_4_1772212608273.webp', class: 'top-[45%] left-[5%] w-16 h-16 lg:w-24 lg:h-24', speed: -60 },
    { path: '/moroccan_patient_5_1772212623083.webp', class: 'bottom-[42%] right-[10%] w-24 h-24 lg:w-32 lg:h-32', speed: 45 },
    { path: '/moroccan_patient_6_1772212637380.webp', class: 'bottom-[15%] right-[12%] w-20 h-20 lg:w-28 lg:h-28', speed: -35 },
  ]

  for (const fi of floatingFiles) {
    const img = await uploadImage(fi.path)
    if (img) {
      floatingImages.push({ _key: `float-${floatingImages.length}`, image: img, class: fi.class, speed: fi.speed })
    }
  }

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    heroSlides,
    heroHeadline: 'Illuminez Votre Sourire Aujourd\'hui',
    heroSubtitle: 'Préparez-vous à des traitements sans douleur et à un sourire que vous adorerez!',
    heroCTAText: 'Qui sommes-nous?',
    heroCTALink: '/qui-sommes-nous',
    aboutText: "Situé en plein centre de Salé le Cabinet Dentaire Chorfi propose des soins dentaires de qualité dans un cadre calme, professionnel et rassurant. Équipements récents, approche humaine et écoute attentive de chaque patient. Votre confort et votre confiance sont au cœur de notre engagement.",
    aboutDoctorImage: drImage,
    aboutDoctorName: 'Dr Chorfi Zainab',
    aboutDoctorTitle: 'Chirurgien-Dentiste',
    aboutCTAText: 'À propos du Cabinet Dentaire Chorfi',
    aboutCTALink: '/qui-sommes-nous',
    pillars: [
      { _key: 'p1', title: 'Expertise', description: 'plusieurs années de savoir-faire au service de votre sourire.' },
      { _key: 'p2', title: 'Sérénité', description: 'Une approche douce et psychologique pour des soins sans stress.' },
      { _key: 'p3', title: 'Innovation', description: 'Des technologies de pointe pour une précision maximale.' },
      { _key: 'p4', title: 'Accompagnement', description: 'Un suivi personnalisé à chaque étape de votre parcours de soin.' },
    ],
    ctaHeadline: 'Obtenez le sourire que vous méritez dès aujourd\'hui !',
    ctaCTAText: 'Prendre Rendez-vous',
    ctaCTALink: 'https://dentisto.ma/rendez-vous/docteurs/chorfi-zainab-2520',
    ctaFloatingImages: floatingImages,
  })
  console.log('  ✓ homePage created')
}

async function seedServicesPage() {
  console.log('\n▸ Seeding servicesPage...')
  const poster = await uploadImage('/original_hero_service_1772228247469.webp')
  await client.createOrReplace({
    _id: 'servicesPage',
    _type: 'servicesPage',
    badge: '• SERVICES',
    title: 'Nos Soins',
    description: '',
    videoUrl: 'https://videos.pexels.com/video-files/6630295/6630295-hd_1366_720_25fps.mp4',
    posterImage: poster,
    stats: [
      { _key: 's1', label: "Années d'Expérience", value: 'Plusieurs' },
      { _key: 's2', label: 'Sourires Transformés', value: 'Divers' },
    ],
  })
  console.log('  ✓ servicesPage created')
}

async function seedServices() {
  console.log('\n▸ Seeding services...')
  const services = [
    { num: 1, title: 'Dentisterie esthétique', desc: 'amélioration du sourire grâce à des traitements modernes et sur mesure', features: ['Blanchiment', 'Facettes', 'Couronnes'], image: '/images/services/cosmetic.webp', link: '/contact' },
    { num: 2, title: 'Dentisterie restauratrice', desc: 'Protégez vos dents avec des restaurations et des nettoyages réguliers', features: ['Examen dentaire et nettoyage', 'Soins complets', 'Radiographie dentaire'], image: '/images/services/pediatrics.webp', link: '/contact' },
    { num: 3, title: 'Implantologie', desc: 'remplacement des dents manquantes par des implants fiables et esthétiques, pour un confort et une stabilité à long terme', features: ['Remplacement durable', 'Stabilité totale', 'Confort & Esthétique'], image: '/images/services/restorative.webp', link: '/contact' },
    { num: 4, title: 'Orthodontie', desc: "correction de l'alignement dentaire pour un sourire équilibré et une meilleure santé bucco-dentaire", features: ['Bilans Orthodontiques', 'Évaluations Complètes', 'Brackets & Gouttières'], image: '/images/services/ortho.webp', link: '/contact' },
  ]

  for (const s of services) {
    const img = await uploadImage(s.image)
    await client.createOrReplace({
      _id: `service-${s.num}`,
      _type: 'service',
      orderRank: s.num,
      title: s.title,
      description: s.desc,
      features: s.features,
      image: img,
      slug: { _type: 'slug', current: s.title.toLowerCase().replace(/\s+/g, '-').replace(/[éè]/g, 'e') },
      link: s.link,
    })
    console.log(`  ✓ Service ${s.num}: ${s.title}`)
  }
}

async function seedProcessSteps() {
  console.log('\n▸ Seeding processSteps...')
  const steps = [
    { num: 1, title: 'Prendre Rendez-vous', desc: "N'attendez pas pour offrir à votre sourire les soins qu'il mérite. Que ce soit pour un contrôle de routine, un traitement esthétique ou une urgence dentaire, notre équipe d'experts est là pour vous. Réservez votre visite en quelques clics et profitez de soins dentaires personnalisés dans un cadre confortable et moderne.", features: ['Réservation en ligne facile', 'Horaires flexibles selon votre emploi du temps', 'Professionnels dentaires experts et accueillants', 'Rendez-vous le jour même ou le lendemain'], image: '/images/process/step1.webp' },
    { num: 2, title: 'Consultation & Évaluation', desc: "Votre chemin vers un sourire sain et éclatant commence par une consultation et une évaluation approfondies. Notre équipe dentaire expérimentée évaluera votre santé bucco-dentaire, discutera de vos préoccupations et créera un plan de traitement personnalisé rien que pour vous.", features: ['Identifier tôt tout problème dentaire', 'Conseils personnalisés', 'Soins professionnels et bienveillants', 'Outils de diagnostic avancés'], image: '/images/process/step2.webp' },
    { num: 3, title: 'Plan de Traitement Personnalisé', desc: "Nous créons une feuille de route pour votre santé dentaire. Notre équipe explique clairement chaque option, s'assurant que vous êtes à l'aise et informé. Votre plan est optimisé tant pour l'esthétique que pour la santé bucco-dentaire à long terme.", features: ['Solutions sur mesure', 'Plan clair et transparent', 'Soins axés sur le confort', 'Résultats optimisés'], image: '/images/process/step 3.webp' },
    { num: 4, title: 'Traitement & Suivi', desc: "Notre engagement ne s'arrête pas à votre intervention. Des traitements de routine aux soins dentaires avancés, nous veillons à ce que chaque étape soit soigneusement gérée et que votre récupération soit étroitement surveillée pour des résultats optimaux.", features: ['Traitement expert', 'Conseils post-traitement', 'Soins continus', 'Approche centrée sur le patient'], image: '/images/process/step 4.webp' },
  ]

  for (const s of steps) {
    const img = await uploadImage(s.image)
    await client.createOrReplace({
      _id: `processStep-${s.num}`,
      _type: 'processStep',
      orderRank: s.num,
      title: s.title,
      description: s.desc,
      features: s.features,
      image: img,
    })
    console.log(`  ✓ Step ${s.num}: ${s.title}`)
  }
}

async function seedBeforeAfterCases() {
  console.log('\n▸ Seeding beforeAfterCases...')
  const cases = [
    { title: 'Facettes esthétiques', before: '/images/Cas clinique/Facettes esthétiques after.webp', after: '/images/Cas clinique/Facettes esthétiques before.webp' },
    { title: 'Couronnes esthétiques', before: '/images/Cas clinique/Couronnes esthétiques before.webp', after: '/images/Cas clinique/Couronnes esthétiques after.webp' },
    { title: 'Blanchiment', before: '/images/Cas clinique/ba_tooth_before.webp', after: '/images/Cas clinique/ba_tooth_after.webp' },
    { title: 'Couronne en Zircone', before: '/images/Cas clinique/Couronne en Zircone before.webp', after: '/images/Cas clinique/Couronne en Zircone after.webp' },
    { title: 'Détartrage', before: '/images/Cas clinique/Détartrage before.webp', after: '/images/Cas clinique/Détartrage after.webp' },
    { title: 'Restauration de double fracture', before: '/images/Cas clinique/Restauration de double fracture before.webp', after: '/images/Cas clinique/Restauration de double fracture after.webp' },
    { title: 'Extraction de dent de sagesse', before: '/images/Cas clinique/ba_radio_before.webp', after: '/images/Cas clinique/ba_radio_after.webp' },
    { title: 'Prothèse', before: '/images/Cas clinique/ba_implants_before.webp', after: '/images/Cas clinique/ba_implants_after.webp' },
  ]

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i]
    const beforeImg = await uploadImage(c.before)
    const afterImg = await uploadImage(c.after)
    await client.createOrReplace({
      _id: `beforeAfter-${i + 1}`,
      _type: 'beforeAfterCase',
      orderRank: i + 1,
      title: c.title,
      beforeImage: beforeImg,
      afterImage: afterImg,
    })
    console.log(`  ✓ Case ${i + 1}: ${c.title}`)
  }
}

async function seedTestimonials() {
  console.log('\n▸ Seeding testimonials...')
  const testimonials = [
    { name: 'Nada Semmar', date: 'Il y a 6 mois', stats: '2 avis', text: "Une dentiste exceptionnelle, avec compétence, bienveillance et bonne écoute. À recommander sans hésitation !", stars: 5, color: '#a67c6c' },
    { name: 'Abderrahmane El Mabrouki', date: 'Il y a 6 mois', stats: '1 avis', text: "Dr.CHORFI is skilled, friendly, and makes every patient feel comfortable. Highly recommend", stars: 5, color: '#C2185B' },
    { name: 'Hiba El Arabi', date: 'Il y a 8 mois', stats: '1 avis', text: "Je recommande vivement cette clinique dentaire ! Le personnel est extrêmement professionnel, attentionné et toujours à l'écoute. L'accueil est chaleureux, les locaux sont modernes et impeccables, et les soins prodigués sont d'une grande qualité.", stars: 5, color: '#E65100' },
    { name: 'Khadija Chahboune', date: 'Il y a 6 mois', stats: '1 avis', text: "Très bon dentiste ! Accueil chaleureux, explications claires et travail soigné. On se sent en confiance dès la première consultation. Les soins ont été réalisés avec beaucoup de professionnalisme et de douceur.", stars: 5, color: '#BF360C' },
    { name: 'Lamiae Arzaaz', date: 'Il y a 8 mois', stats: '31 avis', status: 'Local Guide', text: "Dr Chorfi est ma dentiste de référence sur Rabat/Salé. Cette jeune dame, au-delà de sa compétence et de son aisance, est clairement soucieuse du détail. De plus, son côté humain permet de se sentir à l'aise très rapidement.", stars: 5, color: '#EA4335' },
    { name: 'Hajar Allam', date: 'Il y a 1 mois', stats: '6 avis', text: "Masha allah très professionnelle et gentille ! Je recommande vivement !!", stars: 5, color: '#4285F4' },
    { name: 'H.Y', date: 'Il y a 9 mois', stats: '5 avis', text: "Accueil très professionnel, soins de grande qualité et équipements ultra modernes. On se sent entre de bonnes mains du début à la fin. Je recommande sans hésiter", stars: 5, color: '#34A853' },
    { name: 'Said chorfi', date: 'Il y a 9 mois', stats: '2 avis • 1 photo', text: "Ma dentiste préférée à Salé. Un service exceptionnel et une équipe très accueillante. Je recommande vivement !", stars: 5, color: '#5D4037' },
    { name: 'mariam el mabrouki', date: 'Il y a 6 mois', stats: '1 avis', text: "Une prise en charge impeccable et un accueil chaleureux. Très satisfaite des soins reçus chez Dr Chorfi.", stars: 5, color: '#FF6D00' },
    { name: 'Widad Fartas', date: 'Il y a 8 mois', stats: '5 avis', text: "Expérience agréable au cabinet dr.chorfi , les soins ont été réalisés sans douleur avec résultat très satisfaisant 🙏 Je recommande vivement !", stars: 5, color: '#673AB7' },
  ]

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    await client.createOrReplace({
      _id: `testimonial-${i + 1}`,
      _type: 'testimonial',
      name: t.name,
      date: t.date,
      stats: t.stats,
      status: t.status || undefined,
      text: t.text,
      stars: t.stars,
      avatarColor: t.color,
    })
    console.log(`  ✓ Testimonial ${i + 1}: ${t.name}`)
  }
}

async function seedGalleryItems() {
  console.log('\n▸ Seeding galleryItems...')
  const items = [
    { type: 'video', videoUrl: '/videos/Dr Zainab vd 1 st.MP4', poster: '/images/posters/video-1-poster.webp' },
    { type: 'video', videoUrl: '/videos/Dr zainab vd 2 st.MP4', poster: '/images/posters/video-2-poster.webp' },
    { type: 'image', src: '/images/le cabinet/clinic-6.jpg.jpeg.webp' },
    { type: 'image', src: '/images/le cabinet/clinic-5.jpg.webp' },
    { type: 'image', src: '/images/le cabinet/clinic-4.jpg.webp' },
    { type: 'image', src: '/images/le cabinet/clinic-3.jpg.webp' },
    { type: 'image', src: '/images/le cabinet/clinic-2.jpg.webp' },
    { type: 'image', src: '/images/le cabinet/clinic-1.jpg.webp' },
  ]

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const doc = {
      _id: `gallery-${i + 1}`,
      _type: 'galleryItem',
      orderRank: i + 1,
      type: item.type,
    }

    if (item.type === 'video') {
      doc.videoUrl = item.videoUrl
      doc.videoPoster = await uploadImage(item.poster)
    } else {
      doc.image = await uploadImage(item.src)
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ Gallery ${i + 1}: ${item.type}`)
  }
}

async function seedBlogPosts() {
  console.log('\n▸ Seeding blogPosts...')
  const posts = [
    {
      id: 'blog-facettes-et-couronnes',
      title: 'Facettes et Couronnes : Réinventer Son Sourire',
      slug: 'facettes-et-couronnes',
      category: 'Esthétique Dentaire',
      date: '12 Mars 2026',
      author: 'Dr Zainab Chorfi',
      image: '/images/blog/veneers.png',
      excerpt: "Découvrez comment le sourire sur mesure peut transformer votre harmonie faciale grâce aux technologies numériques.",
      isTall: false,
      content: [
        { _key: 'c1', type: 'p', text: "Le sourire est bien plus qu'une simple expression faciale : il joue un rôle essentiel dans l'harmonie du visage et dans la confiance en soi. Avec le temps, certaines dents peuvent se tacher, s'user, se fracturer ou présenter des anomalies de forme, ce qui peut altérer l'apparence globale." },
        { _key: 'c2', type: 'p', text: "Aujourd'hui, l'esthétique dentaire permet de corriger presque toutes les imperfections grâce au 'Digital Smile Design' ou le sourire sur mesure. Par le biais des outils numériques, nous réalisons désormais une analyse morpho-faciale complète. On étudie la ligne des lèvres, la couleur de la peau et même la personnalité du patient pour que le nouveau sourire soit en parfaite harmonie avec son visage." },
        { _key: 'c3', type: 'h2', text: 'La facette dentaire : La subtilité avant tout' },
        { _key: 'c4', type: 'p', text: "Considérée comme une 'lentille de contact' pour la dent, la facette est une fine pellicule, généralement en céramique, que l'on vient coller sur la face visible de la dent. Elle est idéale pour masquer des colorations permanentes, corriger une forme irrégulière, fermer un petit espace ou rectifier un léger alignement." },
        { _key: 'c5', type: 'h2', text: 'La couronne : La reconstitution complète' },
        { _key: 'c6', type: 'p', text: "Contrairement à la facette, la couronne recouvre l'intégralité de la dent. Elle joue un double rôle : esthétique et fonctionnel. Elle est idéale pour les dents très abîmées, dévitalisées ou présentant de grosses caries." },
      ],
    },
    {
      id: 'blog-ecoute-meilleur-outil',
      title: "Pourquoi l'Écoute est notre Meilleur Outil",
      slug: 'ecoute-meilleur-outil',
      category: 'Approche Humaine',
      date: '10 Mars 2026',
      author: 'Dr Zainab Chorfi',
      image: '/images/blog/listening.png',
      excerpt: "La peur du dentiste n'est pas une fatalité. Découvrez comment nous créons une bulle de sérénité pour vos soins.",
      isTall: true,
      content: [
        { _key: 'c1', type: 'p', text: "Pour beaucoup de personnes, la visite chez le dentiste peut être source d'appréhension. On dit souvent que la moitié du soin dentaire se joue avant même que le patient n'ouvre la bouche, il est donc essentiel de comprendre que le soin ne concerne pas uniquement les dents, mais aussi la personne qui se trouve en face de nous." },
        { _key: 'c2', type: 'p', text: "Car en réalité la 'peur du dentiste' n'est pas une fatalité, c'est un signal. Par conséquent notre premier rôle est d'écouter sans jugement, de créer une 'bulle de sérénité' car l'environnement du cabinet joue un rôle majeur sur le système nerveux." },
        { _key: 'c3', type: 'h2', text: 'La douceur comme standard' },
        { _key: 'c4', type: 'p', text: "Nous avons structuré nos espaces pour rompre avec l'image froide et stressante des cabinets traditionnels. La douceur est notre standard clinique, mettant le patient à l'aise afin de garantir une gestion de la douleur irréprochable." },
        { _key: 'c5', type: 'p', text: "Un patient détendu est un patient qui vit mieux son traitement, qui cicatrise plus vite et qui revient avec plaisir. Pour nous, vous mettre à l'aise n'est pas un 'petit plus' commercial, c'est le fondement même d'une dentisterie éthique et moderne." },
      ],
    },
    {
      id: 'blog-trio-gagnant-sourire',
      title: 'Le Trio Gagnant pour un Sourire Éclatant',
      slug: 'trio-gagnant-sourire',
      category: 'Hygiène & Prévention',
      date: '05 Mars 2026',
      author: 'Dr Zainab Chorfi',
      image: '/images/blog/trio-sourire.png',
      excerpt: "Détartrage, aéropolissage et blanchiment : le protocole complet pour une santé bucco-dentaire durable.",
      isTall: false,
      content: [
        { _key: 'c1', type: 'p', text: "Avoir un beau sourire ne se résume pas seulement à la blancheur. C'est avant tout une question de santé. Le brossage quotidien seul n'est pas suffisant ; avec le temps, la plaque dentaire peut se transformer en tartre qui favorise l'apparition d'inflammations gingivales." },
        { _key: 'c2', type: 'h2', text: '1. Le Détartrage' },
        { _key: 'c3', type: 'p', text: "Essentiel pour éliminer les dépôts solides au-dessus et sous la gencive qui sont impossibles à enlever avec une simple brosse à dents." },
        { _key: 'c4', type: 'h2', text: "2. L'Aéropolissage" },
        { _key: 'c5', type: 'p', text: "Souvent confondu avec le détartrage, l'aéropolissage est une technique de finition de haute précision qui pulvérise les taches de surface comme celles causées par le café, le thé ou le tabac." },
        { _key: 'c6', type: 'h2', text: '3. Le Blanchiment : La Touche Finale' },
        { _key: 'c7', type: 'p', text: "Une fois que le terrain est parfaitement préparé, le blanchiment dentaire peut révéler tout son potentiel. Appliquer un produit de blanchiment sur du tartre serait inefficace et inhomogène." },
      ],
    },
  ]

  for (const p of posts) {
    const img = await uploadImage(p.image)
    await client.createOrReplace({
      _id: p.id,
      _type: 'blogPost',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      date: p.date,
      author: p.author,
      coverImage: img,
      excerpt: p.excerpt,
      isTall: p.isTall,
      content: p.content,
    })
    console.log(`  ✓ Blog: ${p.title}`)
  }
}

async function seedFaqs() {
  console.log('\n▸ Seeding FAQs...')
  const faqs = [
    { q: 'Quelles sont les méthodes de paiement ?', a: "Nous acceptons les espèces, les chèques et les virements bancaires ainsi que certaines couvertures d'assurance." },
    { q: 'Acceptez-vous les urgences ?', a: "Oui, nous réservons des créneaux quotidiens pour recevoir les patients en cas de douleur aiguë ou d'imprévu." },
    { q: 'Comment se déroule la première visite ?', a: "La première consultation comprend un examen complet, des radiographies si nécessaire et l'établissement d'un plan de traitement personnalisé." },
    { q: 'Le cabinet est-il accessible ?', a: "Oui, notre équipe est là pour vous accueillir confortablement au 1er étage de l'immeuble." },
  ]

  for (let i = 0; i < faqs.length; i++) {
    await client.createOrReplace({
      _id: `faq-${i + 1}`,
      _type: 'faq',
      orderRank: i + 1,
      question: faqs[i].q,
      answer: faqs[i].a,
    })
    console.log(`  ✓ FAQ ${i + 1}: ${faqs[i].q.substring(0, 40)}...`)
  }
}

async function seedTeamMembers() {
  console.log('\n▸ Seeding teamMembers...')
  const drImage = await uploadImage('/images/le cabinet/dr-chorfi-office.jpg.webp')
  await client.createOrReplace({
    _id: 'team-dr-chorfi',
    _type: 'teamMember',
    orderRank: 1,
    name: 'Dr. Zainab Chorfi',
    title: 'Chirurgien-Dentiste',
    image: drImage,
    bio: '',
    trainings: [
      "Lauréate de la faculté de médecine dentaire de Rabat",
      "Certifié en Parodontie par le centre de formation français 'LearnyLib'",
      "Certifié en Endodontie par le centre de formation français 'LearnyLib'",
      "Certifié en Stratification directe anterieures par le centre de formation français 'LearnyLib'",
      "Formation de facettes composite stratifié",
      "Formation en chirurgie buccale",
      "Certificat post universitaire en orthopédie dento-faciale",
      "Certificat en imagerie dento-maxillaire et radioprotection",
    ],
  })
  console.log('  ✓ Dr. Zainab Chorfi')
}

async function seedClinicFeatures() {
  console.log('\n▸ Seeding clinicFeatures...')
  const features = [
    { title: 'Scan 3D & Digital', desc: 'Technologies de pointe pour une précision chirurgicale et esthétique.', image: '/images/le cabinet/clinic-1.jpg.webp' },
    { title: 'Imagerie Avancée', desc: "Diagnostics d'une extrême précision avec nos équipements d'imagerie.", image: '/images/le cabinet/clinic-2.jpg.webp' },
    { title: 'Soins Personnalisés', desc: 'Une approche humaine et technologique pour chaque patient.', image: '/images/le cabinet/clinic-6.jpg.jpeg.webp' },
    { title: "Espace d'Attente", desc: 'Un cadre apaisant et élégant pour votre confort avant le traitement.', image: '/images/le cabinet/clinic-3.jpg.webp' },
    { title: 'Accueil & Conseil', desc: 'Un accueil personnalisé pour vous accompagner dans votre parcours de soin.', image: '/images/le cabinet/clinic-4.jpg.webp' },
    { title: 'Radiographie Panoramique', desc: 'Équipement Myray pour une vision globale et précise de votre santé dentaire.', image: '/images/le cabinet/clinic-5.jpg.webp' },
  ]

  for (let i = 0; i < features.length; i++) {
    const img = await uploadImage(features[i].image)
    await client.createOrReplace({
      _id: `clinicFeature-${i + 1}`,
      _type: 'clinicFeature',
      orderRank: i + 1,
      title: features[i].title,
      description: features[i].desc,
      image: img,
    })
    console.log(`  ✓ Feature ${i + 1}: ${features[i].title}`)
  }
}

async function seedLegalPages() {
  console.log('\n▸ Seeding legalPages...')
  await client.createOrReplace({
    _id: 'legal-politique-de-confidentialite',
    _type: 'legalPage',
    pageId: 'politique-de-confidentialite',
    title: 'Votre Vie Privée est Notre Priorité',
    subtitle: 'Confidentialité',
    lastUpdated: '28 Février 2026',
    content: [
      { _key: 'l1', type: 'p', text: 'Dernière mise à jour : 28 Février 2026' },
      { _key: 'l2', type: 'h2', text: '1. Collecte des informations' },
      { _key: 'l3', type: 'p', text: "Nous collectons des informations lorsque vous remplissez notre formulaire de contact ou de prise de rendez-vous sur le site. Les informations collectées incluent votre nom, votre adresse e-mail et votre numéro de téléphone." },
      { _key: 'l4', type: 'h2', text: '2. Utilisation des informations' },
      { _key: 'l5', type: 'p', text: 'Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :' },
      { _key: 'l6', type: 'ul', text: "Vous contacter par téléphone ou e-mail pour confirmer un rendez-vous.\nRépondre à vos demandes spécifiques concernant nos soins dentaires.\nAméliorer l'expérience utilisateur sur notre site web." },
      { _key: 'l7', type: 'h2', text: '3. Confidentialité des données' },
      { _key: 'l8', type: 'p', text: "Nous sommes les seuls propriétaires des informations collectées sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour n'importe quelle raison, sans votre consentement." },
      { _key: 'l9', type: 'h2', text: '4. Protection des informations' },
      { _key: 'l10', type: 'p', text: "Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne (Protocole SSL)." },
      { _key: 'l11', type: 'h2', text: '5. Consentement' },
      { _key: 'l12', type: 'p', text: 'En utilisant notre site, vous consentez à notre politique de confidentialité.' },
    ],
  })
  console.log('  ✓ Politique de confidentialité')
}

async function seedSitemapSections() {
  console.log('\n▸ Seeding sitemapSections...')
  const sections = [
    {
      id: 'sitemap-pages',
      category: 'Pages Principales',
      items: [
        { _key: 'i1', name: 'Accueil', href: '/' },
        { _key: 'i2', name: 'Le Cabinet (Qui Sommes Nous)', href: '/qui-sommes-nous' },
        { _key: 'i3', name: 'Nos Soins (Services)', href: '/services' },
        { _key: 'i4', name: 'Articles & Actualités', href: '/blog' },
        { _key: 'i5', name: 'Contact & Rendez-vous', href: '/contact' },
      ],
    },
    {
      id: 'sitemap-services',
      category: 'Nos Soins',
      items: [
        { _key: 'i1', name: 'Dentisterie Pédiatrique', href: '/services#pediatrics' },
        { _key: 'i2', name: 'Dentisterie Esthétique', href: '/services#cosmetic' },
        { _key: 'i3', name: 'Implantologie', href: '/services#implants' },
        { _key: 'i4', name: 'Orthodontie', href: '/services#ortho' },
      ],
    },
    {
      id: 'sitemap-legal',
      category: 'Légal',
      items: [
        { _key: 'i1', name: 'Politique de Confidentialité', href: '/politique-de-confidentialite' },
        { _key: 'i2', name: 'Plan du Site', href: '/plan-du-site' },
      ],
    },
  ]

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i]
    await client.createOrReplace({
      _id: s.id,
      _type: 'sitemapSection',
      orderRank: i + 1,
      category: s.category,
      items: s.items,
    })
    console.log(`  ✓ Sitemap: ${s.category}`)
  }
}

// ── Main ──────────────────────────────────────────────

async function main() {
  console.log('🦷 Seeding Sanity for Cabinet Dentaire Chorfi...')
  console.log(`   Project: ${env.SANITY_PROJECT_ID} / ${env.SANITY_DATASET}`)

  await seedSiteSettings()
  await seedHomePage()
  await seedServicesPage()
  await seedServices()
  await seedProcessSteps()
  await seedBeforeAfterCases()
  await seedTestimonials()
  await seedGalleryItems()
  await seedBlogPosts()
  await seedFaqs()
  await seedTeamMembers()
  await seedClinicFeatures()
  await seedLegalPages()
  await seedSitemapSections()

  console.log('\n✅ Seed complete! All content has been populated in Sanity.')
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

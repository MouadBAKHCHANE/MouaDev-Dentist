import { client } from './sanity'

export const SITE_URL = 'https://www.cabinetdentairechorfi.com'

// Stable @id anchors so the entities reference each other instead of being
// three unrelated blobs. Google resolves the graph through these.
export const DENTIST_ID = `${SITE_URL}/#dentist`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const DOCTOR_ID = `${SITE_URL}/qui-sommes-nous#dentiste`

const GEO = { latitude: 34.0378219, longitude: -6.803389 }

// Used when the free-text hours in Sanity can't be parsed, so a content edit
// can never silently produce broken openingHours.
const FALLBACK_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '13:00' },
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '15:00', closes: '19:00' },
  { days: ['Saturday'], opens: '09:00', closes: '13:00' },
]

const DAY_MAP: Record<string, string> = {
  lundi: 'Monday', mardi: 'Tuesday', mercredi: 'Wednesday', jeudi: 'Thursday',
  vendredi: 'Friday', samedi: 'Saturday', dimanche: 'Sunday',
}
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// ── Parsing helpers for the French free-text hour fields ──────────────

function toIsoTime(raw: string): string | null {
  const m = raw.match(/(\d{1,2})\s*h\s*(\d{2})?/i)
  return m ? `${m[1].padStart(2, '0')}:${m[2] ?? '00'}` : null
}

function parseDays(raw: string): string[] {
  const found = [...raw.toLowerCase().matchAll(/lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/g)]
    .map((m) => DAY_MAP[m[0]])
  // "Lundi – Vendredi" is a range, not two separate days.
  if (found.length === 2 && /[–—-]/.test(raw)) {
    const from = DAY_ORDER.indexOf(found[0])
    const to = DAY_ORDER.indexOf(found[1])
    if (from > -1 && to > from) return DAY_ORDER.slice(from, to + 1)
  }
  return found
}

function parseHours(raw: string): Array<{ opens: string; closes: string }> {
  return raw
    .split('|')
    .map((segment) => {
      const [open, close] = segment.split(/[-–—]/)
      if (!open || !close) return null
      const opens = toIsoTime(open)
      const closes = toIsoTime(close)
      return opens && closes ? { opens, closes } : null
    })
    .filter((s): s is { opens: string; closes: string } => s !== null)
}

function buildOpeningHours(businessHours: any[] | undefined) {
  const specs = (businessHours ?? [])
    .filter((b) => b && !b.isClosed && b.days && b.hours)
    .flatMap((b) => {
      const dayOfWeek = parseDays(b.days)
      if (!dayOfWeek.length) return []
      return parseHours(b.hours).map((h) => ({ dayOfWeek, ...h }))
    })

  const source = specs.length ? specs : FALLBACK_HOURS.map((h) => ({ dayOfWeek: h.days, opens: h.opens, closes: h.closes }))

  return source.map((s) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: s.dayOfWeek,
    opens: s.opens,
    closes: s.closes,
  }))
}

// Sanity stores local format ("0644801152"); schema.org wants E.164.
function intlPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('212')) return `+${digits}`
  if (digits.startsWith('0')) return `+212${digits.slice(1)}`
  return `+${digits}`
}

// ── Data ──────────────────────────────────────────────────────────────

export async function getSchemaData() {
  return client.fetch(
    `{
      "settings": *[_type == "siteSettings"][0]{
        siteName, siteDescription, phones, email,
        address, socialLinks[]{ url },
        businessHours[]{ days, hours, isClosed }
      },
      "services": *[_type == "service"] | order(orderRank asc){
        title, description, "slug": slug.current
      },
      "doctor": *[_type == "teamMember"] | order(orderRank asc)[0]{
        name, title, trainings
      }
    }`
  )
}

// ── Builders ──────────────────────────────────────────────────────────

export function buildDoctor(doctor: any) {
  if (!doctor?.name) return null

  const trainings: string[] = doctor.trainings ?? []

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': DOCTOR_ID,
    name: doctor.name,
    jobTitle: doctor.title ?? 'Chirurgien-dentiste',
    url: `${SITE_URL}/qui-sommes-nous`,
    medicalSpecialty: 'Dentistry',
    worksFor: { '@id': DENTIST_ID },
    // Each certification is a discrete credential — this is the strongest
    // E-E-A-T signal the practice has and it was absent from the markup.
    hasCredential: trainings.map((t) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: t,
    })),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Faculté de Médecine Dentaire de Rabat',
    },
    knowsLanguage: ['fr', 'ar'],
  }
}

export function buildDentist(settings: any, services: any[] = [], doctor: any = null) {
  const phones = (settings?.phones ?? ['0644801152', '0538716787']).map(intlPhone)
  const address = settings?.address ?? {}
  const streetAddress = [address.street, address.floor].filter(Boolean).join(', ')
  const sameAs = (settings?.socialLinks ?? []).map((s: any) => s?.url).filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': DENTIST_ID,
    name: settings?.siteName ?? 'Cabinet Dentaire Chorfi',
    description: settings?.siteDescription,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    image: [`${SITE_URL}/logo.webp`, `${SITE_URL}/hero-image.webp`, `${SITE_URL}/about-image.webp`],
    telephone: phones,
    ...(settings?.email ? { email: settings.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress || 'Avenue Moulay Youssef n° 19, 1er étage',
      addressLocality: address.city ?? 'Tabriquet, Salé',
      addressRegion: 'Rabat-Salé-Kénitra',
      postalCode: '11000',
      addressCountry: 'MA',
    },
    geo: { '@type': 'GeoCoordinates', ...GEO },
    ...(address.mapUrl ? { hasMap: address.mapUrl } : {}),
    areaServed: [
      { '@type': 'City', name: 'Salé' },
      { '@type': 'City', name: 'Rabat' },
      { '@type': 'Place', name: 'Tabriquet' },
    ],
    openingHoursSpecification: buildOpeningHours(settings?.businessHours),
    priceRange: '$$',
    currenciesAccepted: 'MAD',
    paymentAccepted: 'Espèces, Carte bancaire, Chèque',
    knowsLanguage: ['fr', 'ar'],
    medicalSpecialty: 'Dentistry',
    ...(sameAs.length ? { sameAs } : {}),
    ...(doctor?.name
      ? { employee: { '@id': DOCTOR_ID }, founder: { '@id': DOCTOR_ID } }
      : {}),
    // Surfaces the four treatments as discrete offerings rather than
    // burying them in prose.
    ...(services.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Soins dentaires',
            itemListElement: services.map((s: any) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'MedicalProcedure',
                name: s.title,
                ...(s.description ? { description: s.description } : {}),
                procedureType: 'https://schema.org/TherapeuticProcedure',
                ...(s.slug ? { url: `${SITE_URL}/services#${s.slug}` } : {}),
              },
            })),
          },
        }
      : {}),
  }
}

export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: 'Cabinet Dentaire Chorfi',
    inLanguage: 'fr',
    publisher: { '@id': DENTIST_ID },
  }
}

/** Site-wide graph injected on every page by the layout. */
export async function buildSiteSchema() {
  const { settings, services, doctor } = await getSchemaData()
  return [
    buildWebSite(),
    buildDentist(settings, services ?? [], doctor),
    buildDoctor(doctor),
  ].filter(Boolean)
}

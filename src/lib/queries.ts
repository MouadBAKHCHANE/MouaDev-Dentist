import { client } from './sanity'

// ── Singleton queries ─────────────────────────────────

export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0] {
      siteName, siteDescription, aboutText,
      logo,
      phones, email, address,
      navLinks[]{ label, href },
      ctaButtonText, ctaButtonLink, locationButtonText, googleMapsButtonText,
      socialLinks[]{ platform, url },
      businessHours[]{ days, hours, isClosed },
      googleRating, googleReviewCount,
      appointmentUrl, whatsappNumber,
      footerAboutTitle, footerNavTitle, footerHoraireTitle, footerContactTitle, footerCopyright,
      formLabelName, formLabelPhone, formLabelEmail, formLabelService, formLabelDate,
      formServicePlaceholder, formDisclaimerText, formSubmitText, formSuccessMessage, formErrorMessage,
      seo{ metaTitle, metaDescription, ogImage, noIndex }
    }`
  )
}

export async function getHomePage() {
  return client.fetch(
    `*[_type == "homePage"][0] {
      heroSlides[]{ asset->, alt },
      heroHeadline, heroSubtitle, heroCTAText, heroCTALink,
      heroReviewText, heroReviewVerified, heroSubCtaText, heroSubCtaLink,
      aboutBadge, aboutText, aboutDoctorImage, aboutDoctorName, aboutDoctorTitle,
      aboutCTAText, aboutCTALink, aboutButtonText, aboutButtonLink,
      pillars[]{ title, description },
      servicesBadge, servicesTitle, servicesButtonText, servicesButtonLink,
      processBadge, processTitle, processTitleHighlight, processSubtitle,
      blogBadge, blogTitle, blogButtonText,
      ctaHeadline, ctaCTAText, ctaCTALink,
      ctaFloatingImages[]{ image{ asset-> }, class, speed },
      seo{ metaTitle, metaDescription, ogImage, noIndex }
    }`
  )
}

// ── Collection queries ────────────────────────────────

export async function getServices() {
  return client.fetch(
    `*[_type == "service"] | order(orderRank asc) {
      orderRank, title, description, features, image, slug, link
    }`
  )
}

export async function getProcessSteps() {
  return client.fetch(
    `*[_type == "processStep"] | order(orderRank asc) {
      orderRank, title, description, features, image
    }`
  )
}

export async function getBeforeAfterCases() {
  return client.fetch(
    `*[_type == "beforeAfterCase"] | order(orderRank asc) {
      title, beforeImage, afterImage
    }`
  )
}

export async function getTestimonials() {
  return client.fetch(
    `*[_type == "testimonial"] {
      name, date, stats, status, text, stars, avatarColor
    }`
  )
}

export async function getGalleryItems() {
  return client.fetch(
    `*[_type == "galleryItem"] | order(orderRank asc) {
      type, image, videoUrl, videoPoster
    }`
  )
}

export async function getFaqs() {
  return client.fetch(
    `*[_type == "faq"] | order(orderRank asc) {
      question, answer
    }`
  )
}

export async function getTeamMembers() {
  return client.fetch(
    `*[_type == "teamMember"] | order(orderRank asc) {
      name, title, image, bio, trainings
    }`
  )
}

export async function getClinicFeatures() {
  return client.fetch(
    `*[_type == "clinicFeature"] | order(orderRank asc) {
      title, description, image
    }`
  )
}

// ── Blog queries ──────────────────────────────────────

export async function getAllBlogPosts() {
  return client.fetch(
    `*[_type == "blogPost"] | order(date desc) {
      "slug": slug.current,
      title, excerpt, coverImage, date, category, isTall
    }`
  )
}

export async function getBlogPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      "slug": slug.current,
      _updatedAt,
      title, category, date, author, coverImage, excerpt,
      content[]{ type, text },
      seo{ metaTitle, metaDescription, ogImage, noIndex }
    }`,
    { slug }
  )
}

export async function getAllBlogSlugs() {
  return client.fetch<{ slug: string }[]>(
    `*[_type == "blogPost"]{ "slug": slug.current }`
  )
}

// ── Legal / Static pages ──────────────────────────────

export async function getLegalPage(pageId: string) {
  return client.fetch(
    `*[_type == "legalPage" && pageId == $pageId][0] {
      title, subtitle, lastUpdated,
      content[]{ type, text }
    }`,
    { pageId }
  )
}

export async function getSitemapLinks() {
  return client.fetch(
    `*[_type == "sitemapSection"] | order(orderRank asc) {
      category,
      items[]{ name, href }
    }`
  )
}

// ── Contact page ─────────────────────────────────────

export async function getContactPage() {
  return client.fetch(
    `*[_type == "contactPage"][0] {
      pageTitle, pageSubtitle, headerImage,
      contactInfoPhoneTitle, contactInfoAddressTitle, contactInfoHoursTitle, contactInfoHoursDetails,
      formBadge, formTitle,
      serviceOptions,
      faqBadge, faqTitle,
      helpTitle, helpText, helpCtaText,
      mapBadge, mapTitle, mapButtonText,
      mapEmbedUrl,
      seo{ metaTitle, metaDescription, ogImage, noIndex }
    }`
  )
}

// ── Services page ─────────────────────────────────────

export async function getServicesPage() {
  return client.fetch(
    `*[_type == "servicesPage"][0] {
      badge, title, description, videoUrl, posterImage,
      stats[]{ label, value },
      serviceCTAText,
      seo{ metaTitle, metaDescription, ogImage, noIndex }
    }`
  )
}

// ── Blog page ────────────────────────────────────────

export async function getBlogPage() {
  return client.fetch(
    `*[_type == "blogPage"][0] {
      pageTitle, pageBadge, filterCategories, readArticleText,
      seo{ metaTitle, metaDescription, ogImage, noIndex }
    }`
  )
}

// ── About page ───────────────────────────────────────

export async function getAboutPage() {
  return client.fetch(
    `*[_type == "aboutPage"][0] {
      doctorName, doctorTitle, doctorImage,
      heroLocationLabel, heroLocationAddress, heroLocationLinkText,
      heroContactLabel, heroContactPhone, heroContactEmail,
      heroHoraireLabel, heroHoraires[]{ day, hours, isClosed },
      bioTitle, bioText, expertiseTitle,
      clinicTitle, clinicSubtitle,
      seo{ metaTitle, metaDescription, ogImage, noIndex }
    }`
  )
}

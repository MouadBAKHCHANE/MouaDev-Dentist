// The Sanity `date` field is free text and holds either ISO ("2026-03-12")
// or French display text ("12 Mars 2026"). Schema.org needs ISO 8601, the UI
// needs French — both must parse from either form.

const FR_MONTHS: Record<string, number> = {
  janvier: 0, fevrier: 1, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, août: 7, septembre: 8, octobre: 9, novembre: 10,
  decembre: 11, décembre: 11,
}

export function parseFlexibleDate(raw?: string): Date | null {
  if (!raw) return null
  const m = raw.toLowerCase().match(/(\d{1,2})\s+([a-zà-ü]+)\s+(\d{4})/)
  if (m && FR_MONTHS[m[2]] !== undefined) {
    return new Date(Date.UTC(Number(m[3]), FR_MONTHS[m[2]], Number(m[1])))
  }
  const parsed = new Date(raw)
  return isNaN(parsed.getTime()) ? null : parsed
}

/** ISO date (yyyy-mm-dd) for schema.org, or undefined when unparseable. */
export function toIsoDate(raw?: string): string | undefined {
  const d = parseFlexibleDate(raw)
  return d ? d.toISOString().slice(0, 10) : undefined
}

/** French display date ("12 mars 2026"); falls back to the raw text. */
export function toFrenchDate(raw?: string): string {
  const d = parseFlexibleDate(raw)
  return d
    ? d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    : (raw ?? '')
}

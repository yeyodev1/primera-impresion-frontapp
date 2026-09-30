/**
 * Teléfonos de los formularios en formato internacional (E.164: `+593991234567`)
 * para que ventas pueda escribir por la API de WhatsApp sin limpiar datos.
 *
 * La persona elige el país (Ecuador por defecto) y escribe su número como lo
 * conoce: con o sin el 0 inicial, con espacios o guiones. Aquí se limpia y se
 * arma el número completo.
 */

export interface Country {
  code: string
  name: string
  dial: string
}

export const DEFAULT_COUNTRY = 'EC'

export const COUNTRIES: readonly Country[] = [
  { code: 'EC', name: 'Ecuador', dial: '593' },
  { code: 'CO', name: 'Colombia', dial: '57' },
  { code: 'PE', name: 'Perú', dial: '51' },
  { code: 'US', name: 'Estados Unidos', dial: '1' },
  { code: 'MX', name: 'México', dial: '52' },
  { code: 'PA', name: 'Panamá', dial: '507' },
  { code: 'CL', name: 'Chile', dial: '56' },
  { code: 'AR', name: 'Argentina', dial: '54' },
  { code: 'VE', name: 'Venezuela', dial: '58' },
  { code: 'BO', name: 'Bolivia', dial: '591' },
  { code: 'CR', name: 'Costa Rica', dial: '506' },
  { code: 'ES', name: 'España', dial: '34' },
]

function country(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]!
}

/** Solo dígitos, sin el 0 de marcación nacional ni el código de país si lo pegaron. */
function nationalDigits(code: string, raw: string): string {
  const { dial } = country(code)
  let digits = raw.replace(/\D/g, '')
  if (raw.trim().startsWith('+') && digits.startsWith(dial)) digits = digits.slice(dial.length)
  else if (digits.startsWith('00' + dial)) digits = digits.slice(dial.length + 2)
  // Código de país escrito sin «+» (593991234567): lo que sigue ya es el número.
  else if (digits.startsWith(dial) && digits.length - dial.length >= 8) digits = digits.slice(dial.length)
  return digits.replace(/^0+/, '')
}

/**
 * ¿El número es válido para ese país? En Ecuador se exige un celular
 * (9 dígitos que empiezan en 9, p. ej. 099 123 4567) cuando `mobileOnly`; si
 * no, se acepta también un fijo (8 dígitos, p. ej. 04 234 5678). Para otros
 * países se valida el largo que permite E.164.
 */
export function isValidPhone(code: string, raw: string, mobileOnly = false): boolean {
  const digits = nationalDigits(code, raw)
  if (code === 'EC') return /^9\d{8}$/.test(digits) || (!mobileOnly && /^[2-7]\d{7}$/.test(digits))
  const total = country(code).dial.length + digits.length
  return digits.length >= 6 && total <= 15
}

/** Número completo en E.164: `+593991234567`. */
export function toInternational(code: string, raw: string): string {
  return `+${country(code).dial}${nationalDigits(code, raw)}`
}

/** Deja escribir solo lo que puede formar parte de un teléfono. */
export function sanitizePhoneInput(raw: string): string {
  return raw.replace(/[^\d\s+()-]/g, '').slice(0, 20)
}

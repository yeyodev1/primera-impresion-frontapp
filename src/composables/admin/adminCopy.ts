import type { ApiError, Category, LeadStatus, LeadType, Solution } from '@/types'

/**
 * Textos y reglas compartidas del panel. Viven acá y no en site.ts porque son
 * internos: el equipo comercial los ve, el visitante del sitio nunca.
 */

export const LEAD_STATUS: Record<LeadStatus, string> = {
  new: 'Nueva',
  contacted: 'Contactada',
  closed: 'Cerrada',
}

export const LEAD_TYPE: Record<LeadType, string> = {
  contact: 'Contacto',
  access: 'Solicitud de acceso',
}

export const LEAD_STATUS_TONE: Record<LeadStatus, 'accent' | 'info' | 'muted'> = {
  new: 'accent',
  contacted: 'info',
  closed: 'muted',
}

export const ADMIN_NAV = [
  { label: 'Panel', to: '/admin', icon: 'fa-solid fa-gauge', exact: true },
  { label: 'Solicitudes', to: '/admin/solicitudes', icon: 'fa-solid fa-inbox', badge: true },
  { label: 'Categorías', to: '/admin/categorias', icon: 'fa-solid fa-layer-group' },
  { label: 'Soluciones', to: '/admin/soluciones', icon: 'fa-solid fa-boxes-stacked' },
  { label: 'Blog', to: '/admin/blog', icon: 'fa-solid fa-newspaper' },
] as const

// Límites que Google suele mostrar completos en el resultado de búsqueda.
export const SEO_TITLE_MAX = 60
export const SEO_DESCRIPTION_MAX = 155

/** Mensaje del API tal cual (viene en español) o uno genérico. */
export function apiMessage(error: unknown, fallback = 'Algo salió mal, intenta de nuevo'): string {
  return (error as ApiError)?.message || fallback
}

export function apiStatus(error: unknown): number {
  return (error as ApiError)?.status ?? 0
}

/** wa.me solo acepta dígitos; un 09… ecuatoriano se pasa a 593… */
export function whatsappLink(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 10) digits = `593${digits.slice(1)}`
  return `https://wa.me/${digits}`
}

export function categoryNames(
  values: Solution['categories'] | null | undefined,
  all: Category[] = [],
): string {
  return (values ?? [])
    .map((value) =>
      typeof value === 'string' ? (all.find((c) => c._id === value)?.name ?? '') : value.name,
    )
    .filter(Boolean)
    .join(', ')
}

export function refId(value: { _id: string } | string | null | undefined): string {
  if (!value) return ''
  return typeof value === 'string' ? value : value._id
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(value: string): string {
  return dateTime.format(new Date(value))
}

/** Columna de <AdminTable>. */
export interface AdminColumn {
  key: string
  label: string
  width?: string // ancho fijo en escritorio; sin él la columna crece
  primary?: boolean // título de la tarjeta en móvil (sin etiqueta)
  align?: 'start' | 'end'
}

/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

/** Imagen subida a Cloudinary. Vacía mientras el cliente diseña sus fotos. */
export interface MediaImage {
  url: string
  publicId: string
}

/** Familia de soluciones (Etiquetas, Gran formato…). */
export interface Category {
  _id: string
  name: string
  slug: string
  description: string
  icon: string // clase Font Awesome, ej: 'fa-solid fa-tag'
  image: MediaImage | null
  order: number
  isPublished: boolean
  solutionsCount?: number
}

/** Producto representativo del escaparate: no se vende acá, se consulta. */
export interface Solution {
  _id: string
  name: string
  slug: string
  category: Pick<Category, '_id' | 'name' | 'slug'> | string
  summary: string
  description: string
  options: string[]
  image: MediaImage | null
  isFeatured: boolean
  isPublished: boolean
  order: number
}

export const POST_CATEGORIES = [
  'Materiales',
  'Etiquetas',
  'Gran formato',
  'Empaques',
  'Consejos de impresión',
] as const
export type PostCategory = (typeof POST_CATEGORIES)[number]

/** Artículo del blog. content en Markdown básico (## títulos, listas, **negritas**, enlaces). */
export interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: PostCategory
  coverImage: MediaImage | null
  author: string
  seoTitle: string
  seoDescription: string
  relatedCategory: Pick<Category, '_id' | 'name' | 'slug'> | string | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type LeadType = 'contact' | 'access'
export type LeadStatus = 'new' | 'contacted' | 'closed'

/** Lo que manda el sitio público al enviar un formulario. */
export interface LeadPayload {
  type: LeadType
  name: string
  company: string
  email: string
  phone: string
  role?: string
  products?: string
  frequency?: string
  message?: string
  source?: string // ruta desde la que se envió, ej: '/soluciones/etiquetas-de-papel'
  consent: boolean
  // Antispam: campo trampa invisible (debe ir vacío) y ms desde que se abrió el form.
  website: string
  elapsedMs: number
}

export interface Lead extends Omit<LeadPayload, 'website' | 'elapsedMs'> {
  _id: string
  status: LeadStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  leads: { total: number; new: number; access: number; contact: number }
  solutions: number
  categories: number
  posts: { total: number; published: number }
}

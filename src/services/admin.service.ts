import APIBase from './httpBase'
import type {
  AdminStats,
  Category,
  Lead,
  LeadStatus,
  LeadType,
  MediaImage,
  Paginated,
  Post,
  PostCategory,
  Solution,
} from '@/types'

export interface CategoryInput {
  name: string
  description?: string
  icon?: string
  image?: MediaImage | null
  isPublished?: boolean
}

export interface SolutionInput {
  name: string
  categories: string[]
  summary?: string
  description?: string
  options?: string[]
  image?: MediaImage | null
  isFeatured?: boolean
  isPublished?: boolean
}

export interface PostInput {
  title: string
  slug?: string
  excerpt?: string
  content?: string
  category: PostCategory
  coverImage?: MediaImage | null
  author?: string
  seoTitle?: string
  seoDescription?: string
  relatedCategory?: string | null
  isPublished?: boolean
}

export interface LeadFilters {
  type?: LeadType | ''
  status?: LeadStatus | ''
  page?: number
  limit?: number
}

/** Arma el query string sin mandar filtros vacíos. */
function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    const { data } = await this.get<AdminStats>('admin/stats')
    return data
  }

  // Categorías
  async listCategories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('admin/categories')
    return data
  }

  async createCategory(body: CategoryInput): Promise<Category> {
    const { data } = await this.post<Category>('admin/categories', body)
    return data
  }

  async updateCategory(id: string, body: Partial<CategoryInput>): Promise<Category> {
    const { data } = await this.put<Category>(`admin/categories/${id}`, body)
    return data
  }

  async deleteCategory(id: string): Promise<void> {
    await this.delete(`admin/categories/${id}`)
  }

  async reorderCategories(ids: string[]): Promise<void> {
    await this.put('admin/categories/reorder', { ids })
  }

  // Soluciones
  async listSolutions(categoryId = ''): Promise<Solution[]> {
    const { data } = await this.get<Solution[]>(`admin/solutions${query({ category: categoryId })}`)
    return data
  }

  async createSolution(body: SolutionInput): Promise<Solution> {
    const { data } = await this.post<Solution>('admin/solutions', body)
    return data
  }

  async updateSolution(id: string, body: Partial<SolutionInput>): Promise<Solution> {
    const { data } = await this.put<Solution>(`admin/solutions/${id}`, body)
    return data
  }

  async deleteSolution(id: string): Promise<void> {
    await this.delete(`admin/solutions/${id}`)
  }

  /** Puede ser solo la categoría filtrada: el API reacomoda dentro de sus puestos. */
  async reorderSolutions(ids: string[]): Promise<void> {
    await this.put('admin/solutions/reorder', { ids })
  }

  // Blog
  async listPosts(page = 1, limit = 20): Promise<Paginated<Post>> {
    const { data } = await this.get<Paginated<Post>>(`admin/posts${query({ page, limit })}`)
    return data
  }

  async getPost(id: string): Promise<Post> {
    const { data } = await this.get<Post>(`admin/posts/${id}`)
    return data
  }

  async createPost(body: PostInput): Promise<Post> {
    const { data } = await this.post<Post>('admin/posts', body)
    return data
  }

  async updatePost(id: string, body: Partial<PostInput>): Promise<Post> {
    const { data } = await this.put<Post>(`admin/posts/${id}`, body)
    return data
  }

  async deletePost(id: string): Promise<void> {
    await this.delete(`admin/posts/${id}`)
  }

  // Solicitudes que llegan desde los formularios del sitio
  async listLeads(filters: LeadFilters = {}): Promise<Paginated<Lead>> {
    const { type, status, page = 1, limit = 20 } = filters
    const { data } = await this.get<Paginated<Lead>>(
      `admin/leads${query({ type, status, page, limit })}`,
    )
    return data
  }

  async updateLead(id: string, body: { status?: LeadStatus; notes?: string }): Promise<Lead> {
    const { data } = await this.patch<Lead>(`admin/leads/${id}`, body)
    return data
  }

  async deleteLead(id: string): Promise<void> {
    await this.delete(`admin/leads/${id}`)
  }

  /** Sube una imagen a Cloudinary vía el backapp. 503 si Cloudinary no está configurado. */
  async uploadImage(file: File): Promise<MediaImage> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await this.post<MediaImage>('admin/uploads/image', form, undefined, {
      timeout: 60000,
    })
    return data
  }
}

export const adminService = new AdminService()

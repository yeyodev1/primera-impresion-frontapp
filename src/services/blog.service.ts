import APIBase from './httpBase'
import type { Paginated, Post, PostCategory } from '@/types'

interface PostFilters {
  category?: PostCategory
  page?: number
  limit?: number
}

class BlogService extends APIBase {
  /** Listado público: solo publicados y sin `content` (se pide al abrir el artículo). */
  async posts(filters: PostFilters = {}): Promise<Paginated<Post>> {
    const params: Record<string, string | number> = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 9,
    }
    if (filters.category) params.category = filters.category
    const { data } = await this.get<Paginated<Post>>('posts', undefined, { params })
    return data
  }

  // No puede llamarse `post`: pisaría el método HTTP protegido de APIBase.
  async getPost(slug: string): Promise<Post> {
    const { data } = await this.get<Post>(`posts/${encodeURIComponent(slug)}`)
    return data
  }
}

export const blogService = new BlogService()

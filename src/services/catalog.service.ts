import APIBase from './httpBase'
import type { Category, Solution } from '@/types'

interface SolutionFilters {
  category?: string // slug de la categoría
  featured?: boolean
}

class CatalogService extends APIBase {
  async categories(): Promise<Category[]> {
    const { data } = await this.get<Category[]>('categories')
    return data
  }

  async category(slug: string): Promise<Category> {
    const { data } = await this.get<Category>(`categories/${encodeURIComponent(slug)}`)
    return data
  }

  async solutions(filters: SolutionFilters = {}): Promise<Solution[]> {
    const params: Record<string, string> = {}
    if (filters.category) params.category = filters.category
    if (filters.featured) params.featured = 'true'
    const { data } = await this.get<Solution[]>('solutions', undefined, { params })
    return data
  }

  async solution(slug: string): Promise<Solution> {
    const { data } = await this.get<Solution>(`solutions/${encodeURIComponent(slug)}`)
    return data
  }
}

export const catalogService = new CatalogService()

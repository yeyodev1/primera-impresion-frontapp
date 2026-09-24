import { ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { ApiError, Category, Solution } from '@/types'

/**
 * Categorías compartidas entre Home, Soluciones y Detalle: se piden una vez
 * por carga (estado de módulo) porque cambian muy poco.
 */
const categories = ref<Category[]>([])
const categoriesLoading = ref(false)
const categoriesError = ref('')
let categoriesRequest: Promise<void> | null = null

async function loadCategories(force = false): Promise<void> {
  if (categoriesRequest && !force) return categoriesRequest
  if (categories.value.length && !force) return

  categoriesLoading.value = true
  categoriesError.value = ''
  categoriesRequest = catalogService
    .categories()
    .then((data) => {
      categories.value = data
    })
    .catch((error: ApiError) => {
      categoriesError.value = error.message
      categoriesRequest = null
    })
    .finally(() => {
      categoriesLoading.value = false
    })
  return categoriesRequest
}

/** La categoría de una solución puede venir poblada o como id. */
export function categoryOf(solution: Solution): { name: string; slug: string } | null {
  if (typeof solution.category === 'string') {
    const found = categories.value.find((c) => c._id === solution.category)
    return found ? { name: found.name, slug: found.slug } : null
  }
  return solution.category
}

export function useCatalog() {
  return { categories, categoriesLoading, categoriesError, loadCategories }
}

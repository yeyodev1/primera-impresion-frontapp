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

/** Las categorías de una solución pueden venir pobladas o como ids. */
export function categoriesOf(solution: Solution): { name: string; slug: string }[] {
  return (solution.categories ?? []).flatMap((value) => {
    if (typeof value !== 'string') return [value]
    const found = categories.value.find((c) => c._id === value)
    return found ? [{ name: found.name, slug: found.slug }] : []
  })
}

/** La familia principal (la primera) para tarjetas, migas y relacionadas. */
export function categoryOf(solution: Solution): { name: string; slug: string } | null {
  return categoriesOf(solution)[0] ?? null
}

export function useCatalog() {
  return { categories, categoriesLoading, categoriesError, loadCategories }
}

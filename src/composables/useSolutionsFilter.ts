import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { useCatalog } from './useCatalog'
import { useResource } from './useResource'
import { site } from '@/config/site'

/**
 * Filtro de Soluciones sincronizado con `?categoria=<slug>`: el enlace se
 * puede compartir y las tarjetas de categoría del Home llegan ya filtradas.
 */
export function useSolutionsFilter() {
  const route = useRoute()
  const router = useRouter()
  const { categories, categoriesLoading, categoriesError, loadCategories } = useCatalog()
  const solutions = useResource((category: string) => catalogService.solutions({ category: category || undefined }))

  const active = computed<string>({
    get: () => (typeof route.query.categoria === 'string' ? route.query.categoria : ''),
    set: (slug) => {
      const query = { ...route.query }
      if (slug) query.categoria = slug
      else delete query.categoria
      router.replace({ query })
    },
  })

  const options = computed(() => [
    { label: site.solutions.allLabel, value: '' },
    ...categories.value.map((c) => ({ label: c.name, value: c.slug })),
  ])

  const iconBySlug = computed(() => Object.fromEntries(categories.value.map((c) => [c.slug, c.icon])))

  function iconFor(category: unknown): string | undefined {
    if (category && typeof category === 'object' && 'slug' in category) {
      return iconBySlug.value[(category as { slug: string }).slug] || undefined
    }
    return undefined
  }

  loadCategories()
  watch(active, (slug) => solutions.load(slug), { immediate: true })

  function retry() {
    if (categoriesError.value) loadCategories(true)
    solutions.retry()
  }

  return { active, options, categoriesLoading, solutions, iconFor, retry }
}

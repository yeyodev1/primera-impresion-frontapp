import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { whatsappLink, copy } from '@/config/site'
import type { Solution } from '@/types'
import { categoryOf, useCatalog } from './useCatalog'
import { useResource } from './useResource'
import { useSeo } from './useSeo'

/** Detalle de una solución con sus relacionadas de la misma categoría. */
export function useSolutionDetail() {
  const route = useRoute()
  const { categories, loadCategories } = useCatalog()
  const solution = useResource((slug: string) => catalogService.solution(slug))
  const related = ref<Solution[]>([])

  const category = computed(() => (solution.data.value ? categoryOf(solution.data.value) : null))
  const icon = computed(
    () => categories.value.find((c) => c.slug === category.value?.slug)?.icon || 'fa-solid fa-print',
  )
  const whatsapp = computed(() =>
    solution.data.value ? whatsappLink(copy.solutions.whatsappMessage(solution.data.value.name)) : whatsappLink(),
  )

  async function loadRelated(current: Solution) {
    related.value = []
    const slug = categoryOf(current)?.slug
    if (!slug) return
    try {
      const list = await catalogService.solutions({ category: slug })
      related.value = list.filter((s) => s._id !== current._id).slice(0, 3)
    } catch {
      // Las relacionadas son un extra: si fallan, la sección no aparece.
    }
  }

  loadCategories()
  watch(
    () => route.params.slug,
    (slug) => {
      if (typeof slug === 'string') solution.load(slug)
    },
    { immediate: true },
  )
  watch(solution.data, (value) => {
    if (value) loadRelated(value)
  })

  useSeo(() => {
    const s = solution.data.value
    if (!s) return null
    return { title: s.name, description: s.summary || s.description.slice(0, 160), image: s.image?.url }
  })

  return { solution, related, category, icon, whatsapp }
}

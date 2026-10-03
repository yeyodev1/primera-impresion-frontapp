import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalogService } from '@/services/catalog.service'
import { site } from '@/config/site'
import type { Solution } from '@/types'
import { categoriesOf, useCatalog } from './useCatalog'
import { useResource } from './useResource'

export interface InkOption {
  label: string
  value: string
  count: number
  icon?: string
}

/**
 * Catálogo de Soluciones filtrado en el cliente y sincronizado con
 * `?categoria=<slug>` (el enlace se comparte y las familias del Home llegan
 * ya filtradas).
 *
 * La URL se actualiza con `history.replaceState` y no con el router: el
 * `scrollBehavior` global lleva arriba en cada navegación y filtrar no debe
 * mover la página. Si la ruta cambia desde fuera (un enlace a otra familia),
 * el filtro la sigue.
 *
 * Se piden todas las soluciones una sola vez: así cambiar de familia es
 * instantáneo y las tarjetas pueden reacomodarse con FLIP en vez de
 * desaparecer detrás de un "cargando".
 */
export function useSolutionsCatalog() {
  const route = useRoute()
  const { categories, categoriesError, loadCategories } = useCatalog()
  const all = useResource(() => catalogService.solutions())

  const fromRoute = () => (typeof route.query.categoria === 'string' ? route.query.categoria : '')
  const current = ref(fromRoute())
  watch(
    () => route.query.categoria,
    () => (current.value = fromRoute()),
  )

  const active = computed<string>({
    get: () => current.value,
    set: (slug) => {
      current.value = slug
      const url = new URL(window.location.href)
      if (slug) url.searchParams.set('categoria', slug)
      else url.searchParams.delete('categoria')
      const path = `${url.pathname}${url.search}${url.hash}`
      // `current` es la ruta que vue-router reescribe al salir de la página:
      // actualizarla evita que el filtro se pierda al volver atrás.
      window.history.replaceState({ ...window.history.state, current: path }, '', path)
    },
  })

  const slugsOf = (s: Solution) => categoriesOf(s).map((c) => c.slug)
  const solutions = computed(() => all.data.value ?? [])

  const options = computed<InkOption[]>(() => [
    { label: site.solutions.allLabel, value: '', count: solutions.value.length },
    ...categories.value.map((c) => ({
      label: c.name,
      value: c.slug,
      icon: c.icon,
      count: solutions.value.filter((s) => slugsOf(s).includes(c.slug)).length,
    })),
  ])

  // Un slug desconocido en la URL no cae en "Todas": muestra el pliego vacío.
  const activeOption = computed<InkOption>(
    () =>
      options.value.find((o) => o.value === active.value) ?? {
        label: active.value,
        value: active.value,
        count: 0,
      },
  )
  const isVisible = (s: Solution) => !active.value || slugsOf(s).includes(active.value)
  const visibleCount = computed(() => solutions.value.filter(isVisible).length)

  const iconBySlug = computed(() =>
    Object.fromEntries(categories.value.map((c) => [c.slug, c.icon])),
  )
  // Con una familia activa, el ícono es el de esa familia; si no, el de la principal.
  const iconFor = (s: Solution): string | undefined => {
    const slugs = slugsOf(s)
    const slug = active.value && slugs.includes(active.value) ? active.value : slugs[0]
    return (slug && iconBySlug.value[slug]) || undefined
  }

  function load() {
    loadCategories()
    all.load()
  }

  function retry() {
    if (categoriesError.value) loadCategories(true)
    all.retry()
  }

  return {
    active,
    options,
    activeOption,
    solutions,
    visibleCount,
    isVisible,
    iconFor,
    loading: all.loading,
    error: all.error,
    categoriesCount: computed(() => categories.value.length),
    load,
    retry,
  }
}

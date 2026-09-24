import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogService } from '@/services/blog.service'
import { POST_CATEGORIES, type PostCategory } from '@/types'
import { copy } from '@/components/site/copy'
import { useResource } from './useResource'

/**
 * Listado del blog con tema y página en la URL (`?tema=…&pagina=2`), para
 * que "atrás" y los enlaces compartidos conserven el filtro.
 */
export function useBlogList() {
  const route = useRoute()
  const router = useRouter()
  const posts = useResource((category: PostCategory | undefined, page: number) =>
    blogService.posts({ category, page, limit: 9 }),
  )

  const category = computed<string>({
    get: () => {
      const value = route.query.tema
      return typeof value === 'string' && (POST_CATEGORIES as readonly string[]).includes(value) ? value : ''
    },
    set: (value) => {
      const query = { ...route.query }
      delete query.pagina
      if (value) query.tema = value
      else delete query.tema
      router.replace({ query })
    },
  })

  const page = computed(() => Math.max(1, Number(route.query.pagina) || 1))

  function goTo(next: number) {
    router.push({ query: { ...route.query, pagina: next > 1 ? String(next) : undefined } })
  }

  const options = [
    { label: copy.blog.allLabel, value: '' },
    ...POST_CATEGORIES.map((c) => ({ label: c, value: c })),
  ]

  watch(
    [category, page],
    ([cat, p]) => posts.load((cat || undefined) as PostCategory | undefined, p),
    { immediate: true },
  )

  return { posts, category, page, options, goTo }
}

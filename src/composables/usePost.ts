import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { blogService } from '@/services/blog.service'
import { renderMarkdown } from '@/utils/markdown'
import { useResource } from './useResource'
import { useSeo } from './useSeo'

/** Artículo del blog: carga por slug, HTML del Markdown y metadatos SEO. */
export function usePost() {
  const route = useRoute()
  const post = useResource((slug: string) => blogService.getPost(slug))

  const html = computed(() => (post.data.value ? renderMarkdown(post.data.value.content || '') : ''))

  // relatedCategory puede venir poblada o como id; sin slug no hay enlace.
  const related = computed(() => {
    const value = post.data.value?.relatedCategory
    return value && typeof value === 'object' ? value : null
  })

  watch(
    () => route.params.slug,
    (slug) => {
      if (typeof slug === 'string') post.load(slug)
    },
    { immediate: true },
  )

  useSeo(() => {
    const p = post.data.value
    if (!p) return null
    return {
      title: p.seoTitle || p.title,
      description: p.seoDescription || p.excerpt,
      image: p.coverImage?.url,
    }
  })

  return { post, html, related }
}

import { ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Post } from '@/types'
import { apiMessage } from './adminCopy'

export function useAdminPosts(limit = 20) {
  const toast = useToastStore()
  const posts = ref<Post[]>([])
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const result = await adminService.listPosts(page.value, limit)
      posts.value = result.items
      pages.value = Math.max(1, result.pages)
      total.value = result.total
    } catch (error) {
      toast.error(apiMessage(error, 'No se pudieron cargar los artículos'))
    } finally {
      loading.value = false
    }
  }

  watch(page, load)

  async function remove(post: Post) {
    try {
      await adminService.deletePost(post._id)
      toast.success('Artículo eliminado')
      await load()
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return { posts, page, pages, total, loading, load, remove }
}

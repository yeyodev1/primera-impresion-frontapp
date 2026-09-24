import { ref } from 'vue'
import { adminService, type CategoryInput } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Category } from '@/types'
import { apiMessage } from './adminCopy'

// Compartido: la vista de soluciones y el editor del blog usan la misma lista.
const categories = ref<Category[]>([])
const loading = ref(false)
const loaded = ref(false)

export function useAdminCategories() {
  const toast = useToastStore()

  async function load(force = true) {
    if (loaded.value && !force) return
    loading.value = true
    try {
      categories.value = await adminService.listCategories()
      loaded.value = true
    } catch (error) {
      toast.error(apiMessage(error, 'No se pudieron cargar las categorías'))
    } finally {
      loading.value = false
    }
  }

  /** Crea o actualiza. Devuelve true si se guardó. */
  async function save(body: CategoryInput, id?: string): Promise<boolean> {
    try {
      if (id) await adminService.updateCategory(id, body)
      else await adminService.createCategory(body)
      toast.success(id ? 'Categoría actualizada' : 'Categoría creada')
      await load()
      return true
    } catch (error) {
      toast.error(apiMessage(error))
      return false
    }
  }

  async function togglePublished(category: Category) {
    const next = !category.isPublished
    category.isPublished = next
    try {
      await adminService.updateCategory(category._id, { isPublished: next })
      toast.success(next ? 'Categoría visible en el sitio' : 'Categoría oculta del sitio')
    } catch (error) {
      category.isPublished = !next
      toast.error(apiMessage(error))
    }
  }

  // El 409 ("tiene soluciones") llega con un mensaje claro: va directo al toast.
  async function remove(category: Category) {
    try {
      await adminService.deleteCategory(category._id)
      toast.success('Categoría eliminada')
      categories.value = categories.value.filter((c) => c._id !== category._id)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return { categories, loading, load, save, togglePublished, remove }
}

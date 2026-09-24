import { ref, watch } from 'vue'
import { adminService, type SolutionInput } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Solution } from '@/types'
import { apiMessage } from './adminCopy'

export function useAdminSolutions(initialCategory = '') {
  const toast = useToastStore()
  const solutions = ref<Solution[]>([])
  const loading = ref(false)
  const categoryFilter = ref(initialCategory)

  async function load() {
    loading.value = true
    try {
      solutions.value = await adminService.listSolutions(categoryFilter.value)
    } catch (error) {
      toast.error(apiMessage(error, 'No se pudieron cargar las soluciones'))
    } finally {
      loading.value = false
    }
  }

  watch(categoryFilter, load)

  async function save(body: SolutionInput, id?: string): Promise<boolean> {
    try {
      if (id) await adminService.updateSolution(id, body)
      else await adminService.createSolution(body)
      toast.success(id ? 'Solución actualizada' : 'Solución creada')
      await load()
      return true
    } catch (error) {
      toast.error(apiMessage(error))
      return false
    }
  }

  /** Cambio optimista de un interruptor; se revierte si el API falla. */
  async function toggle(solution: Solution, field: 'isPublished' | 'isFeatured') {
    const next = !solution[field]
    solution[field] = next
    try {
      await adminService.updateSolution(solution._id, { [field]: next })
      const labels = {
        isPublished: next ? 'Solución visible en el sitio' : 'Solución oculta del sitio',
        isFeatured: next ? 'Marcada como destacada' : 'Ya no es destacada',
      }
      toast.success(labels[field])
    } catch (error) {
      solution[field] = !next
      toast.error(apiMessage(error))
    }
  }

  async function remove(solution: Solution) {
    try {
      await adminService.deleteSolution(solution._id)
      toast.success('Solución eliminada')
      solutions.value = solutions.value.filter((s) => s._id !== solution._id)
    } catch (error) {
      toast.error(apiMessage(error))
    }
  }

  return { solutions, loading, categoryFilter, load, save, toggle, remove }
}

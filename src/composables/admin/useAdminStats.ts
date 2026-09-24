import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { AdminStats } from '@/types'

// Estado de módulo: el badge del menú y el panel leen el mismo número.
const stats = ref<AdminStats | null>(null)
const loading = ref(false)

export function useAdminStats() {
  async function refresh() {
    loading.value = true
    try {
      stats.value = await adminService.stats()
    } catch {
      // El badge es informativo: si falla, simplemente no se muestra.
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, refresh }
}

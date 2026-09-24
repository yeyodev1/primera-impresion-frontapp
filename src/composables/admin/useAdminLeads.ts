import { reactive, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Lead, LeadStatus, LeadType } from '@/types'
import { apiMessage } from './adminCopy'
import { useAdminStats } from './useAdminStats'

export function useAdminLeads(limit = 20) {
  const toast = useToastStore()
  const { refresh: refreshStats } = useAdminStats()

  const leads = ref<Lead[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)
  const filters = reactive({ type: '' as LeadType | '', status: '' as LeadStatus | '', page: 1 })

  async function load() {
    loading.value = true
    try {
      const result = await adminService.listLeads({ ...filters, limit })
      leads.value = result.items
      total.value = result.total
      pages.value = Math.max(1, result.pages)
    } catch (error) {
      toast.error(apiMessage(error, 'No se pudieron cargar las solicitudes'))
    } finally {
      loading.value = false
    }
  }

  // Cambiar un filtro vuelve a la primera página; cambiar de página solo recarga.
  watch(
    () => [filters.type, filters.status],
    () => {
      if (filters.page !== 1) filters.page = 1
      else load()
    },
  )
  watch(() => filters.page, load)

  async function update(
    lead: Lead,
    body: { status?: LeadStatus; notes?: string },
  ): Promise<Lead | null> {
    try {
      const updated = await adminService.updateLead(lead._id, body)
      leads.value = leads.value.map((l) => (l._id === updated._id ? updated : l))
      toast.success(body.status ? 'Estado actualizado' : 'Notas guardadas')
      if (body.status) refreshStats()
      return updated
    } catch (error) {
      toast.error(apiMessage(error))
      return null
    }
  }

  async function remove(lead: Lead): Promise<boolean> {
    try {
      await adminService.deleteLead(lead._id)
      toast.success('Solicitud eliminada')
      await load()
      refreshStats()
      return true
    } catch (error) {
      toast.error(apiMessage(error))
      return false
    }
  }

  return { leads, total, pages, loading, filters, load, update, remove }
}

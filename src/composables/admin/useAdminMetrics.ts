import { computed, reactive, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import type { ApiError, Metrics, MetricsFilters, MetricsRow } from '@/types'
import { apiMessage } from './adminCopy'

const TZ = 'America/Guayaquil'
const DAY = 86_400_000
const HOUR = 3_600_000
// en-CA da AAAA-MM-DD, el formato que pide el API.
const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TZ })

export function ecuadorDay(daysAgo = 0): string {
  return dayFormat.format(new Date(Date.now() - daysAgo * DAY))
}

/**
 * Cloudflare solo devuelve los días (u horas) con visitas: se rellenan los
 * huecos con cero para que el eje del tiempo no mienta.
 */
export function fillSeries(data: Metrics): MetricsRow[] {
  const empty = (value: string) => ({ value, pageviews: 0, visits: 0 })
  if (data.hourly) {
    const byHour = new Map(data.series.map((r) => [new Date(r.value).getTime(), r]))
    const start = new Date(`${data.from}T00:00:00-05:00`).getTime()
    const end = new Date(`${data.to}T23:00:00-05:00`).getTime()
    const out: MetricsRow[] = []
    for (let t = start; t <= end; t += HOUR) {
      out.push(byHour.get(t) ?? empty(new Date(t).toISOString()))
    }
    return out
  }
  const byDay = new Map(data.series.map((r) => [r.value, r]))
  const out: MetricsRow[] = []
  // Mediodía UTC: sumar días nunca cruza de fecha por la zona horaria.
  for (let t = Date.parse(`${data.from}T12:00:00Z`); t <= Date.parse(`${data.to}T12:00:00Z`); t += DAY) {
    const day = new Date(t).toISOString().slice(0, 10)
    out.push(byDay.get(day) ?? empty(day))
  }
  return out
}

export function useAdminMetrics() {
  const preset = ref<number | null>(7)
  const filters = reactive({ from: ecuadorDay(6), to: ecuadorDay(0), path: '', country: '', device: '' })
  const data = ref<Metrics | null>(null)
  const loading = ref(false)
  const error = ref('')
  const notConnected = ref(false)
  let request = 0

  const series = computed(() => (data.value ? fillSeries(data.value) : []))
  const active = computed(() =>
    (['path', 'country', 'device'] as const)
      .filter((key) => filters[key])
      .map((key) => ({ key, value: filters[key] })),
  )

  function setPreset(days: number) {
    preset.value = days
    filters.from = ecuadorDay(days - 1)
    filters.to = ecuadorDay(0)
  }

  function setFilter(key: keyof MetricsFilters, value: string) {
    filters[key] = filters[key] === value ? '' : value
  }

  async function load() {
    // Si el usuario cambia de filtro rápido, solo vale la última respuesta.
    const id = ++request
    loading.value = true
    error.value = ''
    try {
      const result = await adminService.metrics({ ...filters })
      if (id !== request) return
      data.value = result
      notConnected.value = false
    } catch (e) {
      if (id !== request) return
      notConnected.value = (e as ApiError)?.status === 503
      error.value = notConnected.value ? '' : apiMessage(e, 'No se pudieron cargar las métricas')
    } finally {
      if (id === request) loading.value = false
    }
  }

  watch(filters, load, { deep: true, immediate: true })

  return { preset, filters, data, series, active, loading, error, notConnected, setPreset, setFilter }
}

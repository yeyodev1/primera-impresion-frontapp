import { ref, shallowRef } from 'vue'
import type { ApiError } from '@/types'

/**
 * Carga de datos con los tres estados que la vista necesita pintar:
 * cargando, error (con reintento) y "no existe" (404) aparte del error.
 * Si llegan dos cargas seguidas (cambio rápido de filtro), gana la última.
 */
export function useResource<T, A extends unknown[] = []>(fetcher: (...args: A) => Promise<T>) {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref('')
  const notFound = ref(false)
  let lastArgs: A | null = null
  let ticket = 0

  async function load(...args: A): Promise<void> {
    const current = ++ticket
    lastArgs = args
    loading.value = true
    error.value = ''
    notFound.value = false

    try {
      const result = await fetcher(...args)
      if (current === ticket) data.value = result
    } catch (err) {
      if (current !== ticket) return
      const apiError = err as ApiError
      data.value = null
      if (apiError.status === 404) notFound.value = true
      else error.value = apiError.message
    } finally {
      if (current === ticket) loading.value = false
    }
  }

  function retry() {
    if (lastArgs) return load(...lastArgs)
  }

  return { data, loading, error, notFound, load, retry }
}

import { nextTick, onBeforeUnmount, onMounted, watch, type Ref } from 'vue'

/**
 * Foco accesible del menú móvil: al abrir va al primer enlace del panel, al
 * cerrar vuelve al botón; Escape cierra y Tab queda atrapado entre el botón
 * y los enlaces del panel mientras está abierto.
 */
export function useMenuFocus(open: Ref<boolean>, root: Ref<HTMLElement | null>, trigger: Ref<HTMLElement | null>, panelSelector: string) {
  const panelLinks = () => Array.from(root.value?.querySelectorAll<HTMLElement>(`${panelSelector} a`) ?? [])

  watch(open, async (value) => {
    await nextTick()
    if (value) panelLinks()[0]?.focus()
    else trigger.value?.focus({ preventScroll: true })
  })

  function onKey(event: KeyboardEvent) {
    if (!open.value) return
    if (event.key === 'Escape') open.value = false
    if (event.key !== 'Tab') return
    const items = [trigger.value, ...panelLinks()].filter(Boolean) as HTMLElement[]
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
}

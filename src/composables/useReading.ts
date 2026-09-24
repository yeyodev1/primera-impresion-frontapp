import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { ScrollTrigger, refreshScroll } from './motion/useGsap'

/**
 * Lectura de un artículo: índice de secciones (los h2 del Markdown, a los que
 * se les pone id para enlazarlos), avance de lectura 0–1 y sección activa.
 *
 * No es una animación: el indicador funciona igual con reduced motion. Un
 * solo ScrollTrigger sobre el cuerpo del artículo; se rehace cuando cambia el
 * HTML (otro artículo) y se mata al desmontar.
 */
export function useReading(prose: Ref<HTMLElement | null>, html: Ref<string>) {
  const headings = ref<Array<{ id: string; text: string }>>([])
  const progress = ref(0)
  const active = ref(-1)
  let trigger: ScrollTrigger | null = null
  let nodes: HTMLElement[] = []

  function markActive() {
    const line = window.innerHeight * 0.35
    let current = -1
    nodes.forEach((node, i) => {
      if (node.getBoundingClientRect().top < line) current = i
    })
    active.value = current
  }

  function build() {
    trigger?.kill()
    const el = prose.value
    if (!el) return
    nodes = Array.from(el.querySelectorAll<HTMLElement>('h2'))
    nodes.forEach((node, i) => (node.id = `seccion-${i + 1}`))
    headings.value = nodes.map((node) => ({ id: node.id, text: node.textContent ?? '' }))
    trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 35%',
      end: 'bottom 75%',
      onUpdate: (self) => {
        progress.value = self.progress
        markActive()
      },
      onRefresh: (self) => {
        progress.value = self.progress
        markActive()
      },
    })
  }

  async function rebuild() {
    await nextTick()
    build()
    refreshScroll()
  }

  watch(html, rebuild)
  onMounted(rebuild)
  onBeforeUnmount(() => {
    trigger?.kill()
    trigger = null
  })

  return { headings, progress, active }
}

/** Minutos de lectura estimados (200 palabras por minuto, mínimo 1). */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

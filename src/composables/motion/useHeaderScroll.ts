import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Estado del header según el scroll:
 * - `scrolled`: pasó el umbral → fondo sólido con blur.
 * - `hidden`: bajando se esconde, subiendo reaparece (nunca con el menú abierto
 *   ni con el foco dentro del header).
 * - `onDark`: ¿lo que pasa por debajo del header es oscuro? Se detecta
 *   mirando el color de fondo real del elemento bajo el header (en cada
 *   frame de scroll), así que funciona con cualquier página y sección sin que
 *   las vistas tengan que avisar.
 * - La barra de progreso se escribe directo en el elemento (sin reactividad
 *   por frame).
 */
function isDarkColor(color: string): boolean | null {
  const m = color.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const [r = 0, g = 0, b = 0, a = 1] = m[1]!.split(',').map((v) => parseFloat(v))
  if (a < 0.5) return null
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110
}

export function useHeaderScroll(header: Ref<HTMLElement | null>, bar: Ref<HTMLElement | null>, locked: Ref<boolean>) {
  const route = useRoute()
  const scrolled = ref(false)
  const hidden = ref(false)
  const onDark = ref(true)
  let lastY = 0
  let ticking = false

  function detectTone() {
    const el = header.value
    if (!el) return
    const probeY = el.offsetHeight + 4
    const stack = document.elementsFromPoint(window.innerWidth / 2, probeY)
    for (const node of stack) {
      if (el.contains(node)) continue
      let cur: Element | null = node
      while (cur) {
        const dark = isDarkColor(getComputedStyle(cur).backgroundColor)
        if (dark !== null) {
          onDark.value = dark
          return
        }
        cur = cur.parentElement
      }
    }
    onDark.value = false
  }

  function update() {
    ticking = false
    const y = window.scrollY
    scrolled.value = y > 24
    const goingDown = y > lastY + 4
    const goingUp = y < lastY - 4
    const focusInside = header.value?.contains(document.activeElement) ?? false
    if (locked.value || y < 120 || focusInside) hidden.value = false
    else if (goingDown) hidden.value = true
    else if (goingUp) hidden.value = false
    if (Math.abs(y - lastY) > 4) lastY = y
    detectTone()

    const max = document.documentElement.scrollHeight - window.innerHeight
    if (bar.value) bar.value.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    // La vista llega después del header: medir cuando ya pintó.
    setTimeout(detectTone, 60)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  // Tras cambiar de página, la cortina tapa ~0.3 s: medir el fondo nuevo después.
  watch(
    () => route.path,
    async () => {
      hidden.value = false
      await nextTick()
      setTimeout(update, 80)
      setTimeout(update, 450)
    },
  )

  return { scrolled, hidden, onDark }
}

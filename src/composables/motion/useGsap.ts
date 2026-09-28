import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Punto único de entrada a GSAP en el sitio público.
 *
 * - Registra ScrollTrigger una sola vez (import con efecto: basta importar
 *   algo de este archivo).
 * - `useGsapContext(scope, setup)` crea un `gsap.context` acotado al elemento
 *   y lo revierte al desmontar: tweens, ScrollTriggers y estilos en línea se
 *   limpian solos. Si `setup` devuelve una función, se llama también al
 *   desmontar (útil para tickers y listeners que GSAP no conoce).
 * - `useGsapMedia(scope, setup)` igual, pero con `gsap.matchMedia` para
 *   efectos que solo existen en un breakpoint (el pin desde lg, por ejemplo)
 *   y que se deshacen solos al cruzar el breakpoint.
 * - `refreshScroll()` recalcula posiciones tras cargar datos del API.
 *
 * Regla de la casa: el contenido nunca depende de la animación. Los estados
 * iniciales (opacidad 0, desplazamientos) los pone JS justo antes de animar;
 * con reduced motion `setup` recibe `reduced: true` y no se oculta nada.
 *
 * Uso:
 *   const root = ref<HTMLElement | null>(null)
 *   useGsapContext(root, ({ reduced }) => {
 *     if (reduced) return
 *     gsap.from('.item', { y: 40, autoAlpha: 0, stagger: 0.08, scrollTrigger: { trigger: root.value, start: 'top 80%' } })
 *   })
 */

let registered = false

function register() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  gsap.defaults({ ease: 'power3.out', duration: 0.9 })
  // La barra de direcciones del móvil cambia el alto al hacer scroll: no refrescar por eso.
  ScrollTrigger.config({ ignoreMobileResize: true })
  // Las fuentes web cambian la altura de los titulares: recalcular al tenerlas.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  watchPageHeight()
  registered = true
}

/**
 * Si la página cambia de alto después de calcular los disparadores (llegan
 * datos del API, cargan imágenes, termina una transición de página), sus
 * posiciones quedan viejas y hay secciones que no aparecen hasta seguir
 * bajando, o nunca si el disparador quedó más allá del final. Se vigila el
 * alto del documento y se recalcula cuando cambia de verdad.
 */
/**
 * Red de seguridad: una entrada de una sola vez (`once`) cuyo elemento ya está
 * en pantalla (o quedó arriba) y no arrancó, arranca ya. Así ningún titular
 * queda escondido bajo su máscara aunque un disparador llegue desfasado.
 */
function revealStragglers() {
  const limit = window.innerHeight * 0.9
  for (const st of ScrollTrigger.getAll()) {
    const anim = st.animation
    if (!st.vars.once || !anim || anim.progress() > 0 || anim.isActive()) continue
    const el = st.trigger
    if (el instanceof Element && el.getBoundingClientRect().top < limit) anim.play()
  }
}

function watchPageHeight() {
  if (typeof ResizeObserver === 'undefined') return
  const docHeight = () => document.documentElement.scrollHeight
  let lastHeight = docHeight()
  let timer = 0
  ScrollTrigger.addEventListener('refresh', () => {
    lastHeight = docHeight()
    revealStragglers()
  })
  ScrollTrigger.addEventListener('scrollEnd', revealStragglers)
  new ResizeObserver(() => {
    if (Math.abs(docHeight() - lastHeight) < 2) return
    window.clearTimeout(timer)
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
  }).observe(document.body)
}

register()

export { gsap, ScrollTrigger }

export const MQ = {
  reduced: '(prefers-reduced-motion: reduce)',
  motion: '(prefers-reduced-motion: no-preference)',
  fine: '(hover: hover) and (pointer: fine)',
  lg: '(min-width: 1024px)',
  md: '(min-width: 768px)',
} as const

function matches(query: string): boolean {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

export function prefersReducedMotion(): boolean {
  return matches(MQ.reduced)
}

/** Puntero con hover real (ratón/trackpad): tilt, imán y seguidores solo ahí. */
export function hasFinePointer(): boolean {
  return matches(MQ.fine)
}

let refreshQueued = 0

/** Recalcula todos los ScrollTriggers en el siguiente frame (con debounce). */
export function refreshScroll(): void {
  if (typeof window === 'undefined') return
  cancelAnimationFrame(refreshQueued)
  refreshQueued = requestAnimationFrame(() => {
    refreshQueued = requestAnimationFrame(() => ScrollTrigger.refresh())
  })
}

/** Espera al DOM actualizado y refresca: llamar después de pintar datos del API. */
export async function refreshAfterData(): Promise<void> {
  await nextTick()
  refreshScroll()
}

type Cleanup = void | (() => void)
interface SetupArgs {
  reduced: boolean
  self: gsap.Context
  el: HTMLElement
}

export function useGsapContext(scope: Ref<HTMLElement | null>, setup: (args: SetupArgs) => Cleanup) {
  let ctx: gsap.Context | null = null
  let cleanup: Cleanup

  function build() {
    const el = scope.value
    if (!el) return
    const reduced = prefersReducedMotion()
    ctx = gsap.context((self) => {
      cleanup = setup({ reduced, self, el })
    }, el)
  }

  function destroy() {
    if (typeof cleanup === 'function') cleanup()
    cleanup = undefined
    ctx?.revert()
    ctx = null
  }

  /** Reconstruye las animaciones (p. ej. cuando llegan datos que cambian el DOM). */
  async function rebuild() {
    destroy()
    await nextTick()
    build()
    refreshScroll()
  }

  onMounted(build)
  onBeforeUnmount(destroy)

  return { rebuild, get context() { return ctx } }
}

export function useGsapMedia(scope: Ref<HTMLElement | null>, setup: (mm: gsap.MatchMedia, el: HTMLElement) => void) {
  let mm: gsap.MatchMedia | null = null

  function build() {
    const el = scope.value
    if (!el) return
    mm = gsap.matchMedia(el)
    setup(mm, el)
  }

  function destroy() {
    mm?.revert()
    mm = null
  }

  async function rebuild() {
    destroy()
    await nextTick()
    build()
    refreshScroll()
  }

  onMounted(build)
  onBeforeUnmount(destroy)

  return { rebuild }
}

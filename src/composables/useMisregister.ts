import type { Ref } from 'vue'
import { gsap, hasFinePointer, useGsapContext } from './motion/useGsap'

/**
 * Desregistro CMYK controlado (página 404). Cada capa `[data-ink]` dentro de
 * `root` tiene un vector de desplazamiento (`data-dx`, `data-dy` en em y
 * `data-rot` en grados). La cantidad de desregistro `m` (0 = alineado,
 * 1 = máximo) sale de:
 *  - puntero fino: la distancia del cursor al centro del bloque; al acercarse,
 *    la prensa se calibra;
 *  - táctil: un ciclo que respira solo (se descalibra y se vuelve a alinear).
 * Con reduced motion no se hace nada y las tintas quedan alineadas.
 */
export function useMisregister(root: Ref<HTMLElement | null>) {
  return useGsapContext(root, ({ reduced, el }) => {
    if (reduced) return
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-ink]'))
    const em = () => parseFloat(getComputedStyle(el).fontSize) || 100
    const movers = layers.map((layer) => ({
      dx: Number(layer.dataset.dx) || 0,
      dy: Number(layer.dataset.dy) || 0,
      rot: Number(layer.dataset.rot) || 0,
      x: gsap.quickTo(layer, 'x', { duration: 0.7, ease: 'power3.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 0.7, ease: 'power3.out' }),
      r: gsap.quickTo(layer, 'rotation', { duration: 0.9, ease: 'power3.out' }),
    }))

    function apply(m: number) {
      const size = em()
      movers.forEach((mv) => {
        mv.x(mv.dx * size * m)
        mv.y(mv.dy * size * m)
        mv.r(mv.rot * m)
      })
    }

    // Entrada: sale de prensa muy desregistrado y se asienta a medias.
    apply(1)

    if (hasFinePointer()) {
      function move(event: PointerEvent) {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const reach = Math.hypot(window.innerWidth, window.innerHeight) / 2
        const d = Math.hypot(event.clientX - cx, event.clientY - cy)
        apply(gsap.utils.clamp(0, 1, d / reach) ** 1.4)
      }
      window.addEventListener('pointermove', move)
      return () => window.removeEventListener('pointermove', move)
    }

    const state = { m: 1 }
    gsap
      .timeline({ repeat: -1, repeatDelay: 0.6 })
      .to(state, { m: 0, duration: 1.8, ease: 'expo.inOut', onUpdate: () => apply(state.m) })
      .to(state, { m: 0, duration: 1.6 })
      .to(state, { m: 0.9, duration: 1.4, ease: 'power2.in', onUpdate: () => apply(state.m) })
  })
}

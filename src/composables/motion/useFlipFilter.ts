import { nextTick, onBeforeUnmount, watch, type Ref, type WatchSource } from 'vue'
import { Flip } from 'gsap/Flip'
import { gsap, prefersReducedMotion, refreshScroll } from './useGsap'

gsap.registerPlugin(Flip)

/**
 * Reacomodo FLIP de una lista filtrada con `v-show` (los elementos no se
 * destruyen, solo se ocultan). Justo antes de que cambie `source` se toma la
 * foto de las posiciones; después del render, las hojas que siguen se
 * deslizan a su nuevo lugar, las que salen se encogen y las que entran suben
 * desde una máscara, como pliegos saliendo de la prensa.
 *
 * Con reduced motion el filtro cambia en seco. `selector` apunta a los
 * elementos que se muestran/ocultan dentro de `root`.
 */
export function useFlipFilter(
  root: Ref<HTMLElement | null>,
  source: WatchSource,
  selector: string,
) {
  let state: Flip.FlipState | null = null
  let running: gsap.core.Timeline | null = null
  onBeforeUnmount(() => running?.kill())

  watch(
    source,
    () => {
      if (!root.value || prefersReducedMotion()) return
      state = Flip.getState(root.value.querySelectorAll(selector))
    },
    { flush: 'pre' },
  )

  watch(source, async () => {
    await nextTick()
    const el = root.value
    if (!el || !state) return refreshScroll()
    const snapshot = state
    state = null
    running?.progress(1)
    running = Flip.from(snapshot, {
      targets: el.querySelectorAll(selector),
      duration: 0.7,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.02,
      onEnter: (items) =>
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 60, rotation: 1.5, clipPath: 'inset(100% 0% 0% 0%)' },
          {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.8,
            ease: 'expo.out',
            delay: 0.12,
            stagger: 0.06,
            clearProps: 'opacity,visibility,transform,clipPath',
          },
        ),
      onLeave: (items) =>
        gsap.to(items, { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }),
      onComplete: refreshScroll,
    })
  })
}

import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { gsap, prefersReducedMotion, ScrollTrigger } from './useGsap'

/**
 * Motor del marquee infinito: mueve una pista con N copias del grupo y la
 * envuelve al recorrer el ancho de una copia. La velocidad se multiplica con
 * la velocidad del scroll y cambia de sentido cuando el scroll sube, como un
 * rodillo que arrastra el papel.
 *
 * Devuelve `copies`, cuántas copias pintar para que nunca quede un hueco.
 */
export function useMarquee(
  root: Ref<HTMLElement | null>,
  track: Ref<HTMLElement | null>,
  opts: { speed: number; direction: 'left' | 'right'; reactive: boolean },
) {
  const copies = ref(2)
  let x = 0
  let groupWidth = 0
  let boost = 0
  let scrollDir = 1
  let ro: ResizeObserver | null = null
  let st: ScrollTrigger | null = null
  let io: IntersectionObserver | null = null
  let visible = true
  let setX: ((value: number) => void) | null = null
  const dir = opts.direction === 'left' ? -1 : 1

  function measure() {
    const first = track.value?.firstElementChild as HTMLElement | null
    if (!first || !root.value) return
    groupWidth = first.offsetWidth
    const needed = Math.ceil(root.value.offsetWidth / Math.max(groupWidth, 1)) + 1
    if (needed > copies.value) copies.value = needed
  }

  function tick(_time: number, delta: number) {
    if (!visible || !groupWidth || !setX) return
    boost *= 0.92
    const velocity = opts.speed * (1 + boost) * dir * scrollDir
    x += (velocity * delta) / 1000
    // Envuelve en [-groupWidth, 0) para que el salto no se note.
    x = gsap.utils.wrap(-groupWidth, 0, x)
    setX(x)
  }

  onMounted(() => {
    if (!track.value || !root.value) return
    measure()
    ro = new ResizeObserver(measure)
    ro.observe(root.value)
    // Si cambian los textos (llegan del API) cambia el ancho del grupo.
    ro.observe(track.value.firstElementChild as HTMLElement)
    if (prefersReducedMotion()) return

    setX = gsap.quickSetter(track.value, 'x', 'px') as (value: number) => void
    x = dir > 0 ? -groupWidth : 0
    io = new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting))
    io.observe(root.value)
    gsap.ticker.add(tick)

    if (opts.reactive) {
      st = ScrollTrigger.create({
        trigger: root.value,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate(self) {
          boost = Math.min(Math.abs(self.getVelocity()) / 260, 7)
          scrollDir = self.direction
        },
      })
    }
  })

  onBeforeUnmount(() => {
    gsap.ticker.remove(tick)
    ro?.disconnect()
    io?.disconnect()
    st?.kill()
  })

  return { copies }
}

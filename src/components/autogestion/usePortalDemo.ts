import { nextTick, ref, type Ref } from 'vue'
import { Flip } from 'gsap/Flip'
import { gsap, ScrollTrigger, useGsapContext } from '@/composables/motion/useGsap'

gsap.registerPlugin(Flip)

/**
 * Coreografía de la interfaz simulada del portal (PortalMock).
 *
 * Un bucle de ~8 s: el cursor entra y pulsa "Repetir pedido", el estado del
 * pedido avanza de Recibido a Entregado y, al terminar, el producto pedido
 * sube al principio de «Mis productos» (FLIP), como el último usado.
 * Solo corre mientras la tarjeta está en pantalla. Con reduced motion queda
 * un cuadro fijo con el pedido "En producción".
 */
export function usePortalDemo(root: Ref<HTMLElement | null>, count: number, steps: number) {
  const order = ref(Array.from({ length: count }, (_, i) => i))
  const step = ref(1)
  const pressed = ref(false)

  function rotate() {
    const el = root.value
    if (!el) return
    const rows = el.querySelectorAll('.portal__row')
    const state = Flip.getState(rows)
    const next = [...order.value]
    next.unshift(next.pop()!)
    order.value = next
    nextTick(() => Flip.from(state, { duration: 0.8, ease: 'expo.inOut', stagger: 0.04 }))
  }

  useGsapContext(root, ({ reduced, el }) => {
    if (reduced) return
    step.value = -1
    const cursor = el.querySelector('.portal__cursor')
    const button = el.querySelector('.portal__repeat')
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.6,
      paused: true,
      defaults: { ease: 'power3.inOut' },
    })

    tl.fromTo(cursor, { x: 140, y: 120, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 1.1 })
      .to(button, { scale: 0.9, duration: 0.12, ease: 'power2.in' })
      .call(() => {
        pressed.value = true
        step.value = 0
      })
      .to(button, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
      .to(cursor, { x: 60, y: 150, autoAlpha: 0, duration: 0.9 }, '+=0.2')
    for (let i = 1; i < steps; i++)
      tl.call(() => void (step.value = i), undefined, `+=${i === 1 ? 0 : 0.9}`)
    tl.call(
      () => {
        pressed.value = false
        rotate()
      },
      undefined,
      '+=1.1',
    ).call(() => void (step.value = -1), undefined, '+=1.4')

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    })
    return () => {
      st.kill()
      tl.kill()
    }
  })

  return { order, step, pressed }
}

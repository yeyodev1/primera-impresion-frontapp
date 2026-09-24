import { gsap, hasFinePointer, prefersReducedMotion } from './useGsap'

/**
 * Hace que `follower` siga al cursor mientras está sobre `area`, con inercia
 * y una leve inclinación según la velocidad horizontal (como una hoja que se
 * arrastra). Aparece al entrar y se encoge al salir.
 *
 * Pensado para llamarse dentro de `useGsapContext` (sus tweens se limpian con
 * el contexto); devuelve la función que quita los listeners. Sin puntero
 * fino o con reduced motion no hace nada.
 */
export function pointerFollow(area: HTMLElement, follower: HTMLElement): () => void {
  if (!hasFinePointer() || prefersReducedMotion()) return () => {}

  gsap.set(follower, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 })
  const xTo = gsap.quickTo(follower, 'x', { duration: 0.55, ease: 'power3.out' })
  const yTo = gsap.quickTo(follower, 'y', { duration: 0.55, ease: 'power3.out' })
  const rTo = gsap.quickTo(follower, 'rotation', { duration: 0.8, ease: 'power3.out' })
  let lastX = 0
  // Las coordenadas se miden contra el contenedor posicionado del seguidor,
  // que puede no ser el área que escucha el puntero.
  const origin = () => ((follower.offsetParent as HTMLElement | null) ?? area).getBoundingClientRect()

  function move(event: PointerEvent) {
    const rect = origin()
    const x = event.clientX - rect.left
    xTo(x)
    yTo(event.clientY - rect.top)
    rTo(gsap.utils.clamp(-8, 8, (x - lastX) * 0.6))
    lastX = x
  }

  function enter(event: PointerEvent) {
    const rect = origin()
    lastX = event.clientX - rect.left
    gsap.set(follower, { x: lastX, y: event.clientY - rect.top })
    gsap.to(follower, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto' })
  }

  function leave() {
    gsap.to(follower, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: 'power2.in', overwrite: 'auto' })
  }

  area.addEventListener('pointermove', move)
  area.addEventListener('pointerenter', enter)
  area.addEventListener('pointerleave', leave)
  return () => {
    area.removeEventListener('pointermove', move)
    area.removeEventListener('pointerenter', enter)
    area.removeEventListener('pointerleave', leave)
  }
}

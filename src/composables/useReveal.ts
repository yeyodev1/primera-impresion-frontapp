import type { Directive } from 'vue'

/**
 * Aparición sutil al entrar en pantalla.
 *
 * Un solo IntersectionObserver para todo el sitio (estado de módulo) y los
 * estilos van en línea para no depender de clases globales. Con
 * prefers-reduced-motion, o sin IntersectionObserver, no se oculta nada:
 * el contenido nunca queda invisible por culpa de la animación.
 *
 * Uso: `import { vReveal } from '@/composables/useReveal'` y
 * `<section v-reveal>` o `<article v-reveal="index">` para escalonar.
 */

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
let observer: IntersectionObserver | null = null

function canAnimate(): boolean {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function show(el: HTMLElement) {
  el.style.opacity = '1'
  el.style.transform = 'none'
}

function getObserver(): IntersectionObserver {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        show(entry.target as HTMLElement)
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  return observer
}

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (!canAnimate()) return
    const delay = Math.min(binding.value ?? 0, 6) * 70
    el.style.opacity = '0'
    el.style.transform = 'translateY(18px)'
    el.style.transition = `opacity 0.6s ${EASE} ${delay}ms, transform 0.6s ${EASE} ${delay}ms`
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

export function useReveal() {
  return { vReveal }
}

<script setup lang="ts">
/**
 * MagneticButton — envoltorio magnético para un CTA (RouterLink, <a> o <button>).
 *
 * El botón se deja atraer por el cursor dentro de su caja y vuelve con un
 * rebote al salir; el texto se mueve un poco más que el fondo, con desregistro
 * CMYK leve en hover. Solo con puntero fino y sin reduced motion: en táctil
 * es un contenedor inerte.
 *
 * Props:
 *   strength  cuánto sigue al cursor, 0–1 (default 0.35)
 *   block     ocupa el ancho disponible (útil en móvil)
 *
 * Uso:
 *   <MagneticButton><RouterLink to="/contacto" class="btn btn--primary btn--press">Hablar</RouterLink></MagneticButton>
 */
import { ref } from 'vue'
import { gsap, hasFinePointer, useGsapContext } from '@/composables/motion/useGsap'

const props = withDefaults(defineProps<{ strength?: number; block?: boolean }>(), { strength: 0.35 })

const root = ref<HTMLElement | null>(null)

// La zona de atracción es más grande que el botón y el botón la sigue con
// retraso: un clic rápido cerca del borde cae en el envoltorio. Se reenvía
// al botón para que ningún clic se pierda (p. ej. el envío de un formulario).
function forwardClick(event: MouseEvent) {
  if (event.target !== root.value) return
  const target = root.value?.firstElementChild as HTMLElement | null
  target?.click()
}

useGsapContext(root, ({ reduced, el }) => {
  if (reduced || !hasFinePointer()) return
  const target = el.firstElementChild as HTMLElement | null
  if (!target) return
  const label = target.querySelectorAll<HTMLElement>(':scope > *')
  const xTo = gsap.quickTo(target, 'x', { duration: 0.5, ease: 'power3.out' })
  const yTo = gsap.quickTo(target, 'y', { duration: 0.5, ease: 'power3.out' })

  function move(event: PointerEvent) {
    const rect = el.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    xTo(dx * props.strength)
    yTo(dy * props.strength)
    gsap.to(label, { x: dx * props.strength * 0.35, y: dy * props.strength * 0.35, duration: 0.5, overwrite: 'auto' })
  }

  function leave() {
    gsap.to(target, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
    gsap.to(label, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
  }

  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
  }
})
</script>

<template>
  <span ref="root" class="magnetic" :class="{ 'magnetic--block': block }" @click="forwardClick">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.magnetic {
  display: inline-flex;
  // Zona de atracción algo mayor que el botón.
  padding: 0.6rem;
  margin: -0.6rem;

  &--block {
    display: flex;

    > :deep(*) {
      flex: 1;
    }
  }

  > :deep(*) {
    will-change: transform;
  }

  > :deep(*:hover) {
    text-shadow:
      -1.5px 0 rgba($cmyk-c, 0.7),
      1.5px 0.5px rgba($cmyk-m, 0.65);
  }
}
</style>

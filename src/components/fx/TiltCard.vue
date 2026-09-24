<script setup lang="ts">
/**
 * TiltCard — tarjeta con inclinación 3D sutil y un foco de luz que sigue al
 * cursor (como mirar una lámina barnizada a contraluz). Solo con puntero
 * fino y sin reduced motion; si no, es un contenedor normal.
 *
 * Props:
 *   as     etiqueta del contenedor (default 'article')
 *   max    grados máximos de giro (default 6)
 *   tone   'night' (foco naranja sobre oscuro) | 'paper' (foco cálido)
 *
 * Uso: <TiltCard as="li" tone="night"> ...contenido... </TiltCard>
 */
import { ref } from 'vue'
import { gsap, hasFinePointer, useGsapContext } from '@/composables/motion/useGsap'

const props = withDefaults(defineProps<{ as?: string; max?: number; tone?: 'night' | 'paper' }>(), {
  as: 'article',
  max: 6,
  tone: 'paper',
})

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced || !hasFinePointer()) return
  gsap.set(el, { transformPerspective: 900 })
  const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
  const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })

  function move(event: PointerEvent) {
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    ry((px - 0.5) * props.max * 2)
    rx((0.5 - py) * props.max * 2)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }

  function leave() {
    rx(0)
    ry(0)
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
  <component :is="as" ref="root" class="tilt" :class="`tilt--${tone}`">
    <span class="tilt__spot" aria-hidden="true"></span>
    <slot />
  </component>
</template>

<style scoped lang="scss">
.tilt {
  position: relative;
  isolation: isolate;
  transform-style: preserve-3d;

  &__spot {
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    background: radial-gradient(
      circle at var(--mx, 50%) var(--my, 50%),
      rgba($accent, 0.22),
      transparent 55%
    );
    transition: opacity 0.4s ease;
  }

  &--paper &__spot {
    background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba($accent, 0.14), transparent 55%);
  }

  @include fine-pointer {
    &:hover &__spot {
      opacity: 1;
    }
  }
}
</style>

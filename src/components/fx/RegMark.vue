<script setup lang="ts">
/**
 * RegMark — marca de registro (⊕) de imprenta. Decorativa.
 *
 * Props:
 *   size  tamaño CSS (default '1.5rem')
 *   tone  'ink' | 'light' | 'accent' | 'current' (default 'current')
 *   spin  gira despacio con el scroll de la página
 *
 * Uso: <RegMark size="2rem" tone="accent" spin />
 */
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

const props = withDefaults(
  defineProps<{ size?: string; tone?: 'ink' | 'light' | 'accent' | 'current'; spin?: boolean }>(),
  { size: '1.5rem', tone: 'current' },
)

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced || !props.spin) return
  gsap.to(el, {
    rotation: 180,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
  })
})
</script>

<template>
  <span ref="root" class="regmark" :class="`regmark--${tone}`" :style="{ width: size, height: size }" aria-hidden="true">
    <svg viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="11" />
      <circle cx="20" cy="20" r="4.5" class="regmark__core" />
      <path d="M20 0v40M0 20h40" />
    </svg>
  </span>
</template>

<style scoped lang="scss">
.regmark {
  display: inline-block;
  flex-shrink: 0;
  line-height: 0;

  svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.4;
  }

  &__core {
    fill: currentColor;
    stroke: none;
  }

  &--ink {
    color: $ink;
  }

  &--light {
    color: rgba($surface, 0.6);
  }

  &--accent {
    color: $accent;
  }
}
</style>

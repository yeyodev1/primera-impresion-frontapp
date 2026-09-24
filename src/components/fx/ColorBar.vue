<script setup lang="ts">
/**
 * ColorBar — tira de control de color (parches CMYK, sobreimpresiones y
 * escala de grises) como separador entre secciones. Los parches entran uno a
 * uno al aparecer. Decorativa.
 *
 * Props:
 *   tone    'paper' | 'night'  fondo sobre el que va (cambia rótulos y borde)
 *   labels  muestra los rótulos mono bajo cada parche (default true)
 *   compact tira fina, sin rótulos, para tarjetas
 *
 * Uso: <ColorBar tone="night" />
 */
import { ref } from 'vue'
import { fx } from '@/config/site'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

withDefaults(defineProps<{ tone?: 'paper' | 'night'; labels?: boolean; compact?: boolean }>(), {
  tone: 'paper',
  labels: true,
  compact: false,
})

// Mismo orden que fx.colorBar: C, M, Y, K, sobreimpresiones y grises.
const swatches = ['c', 'm', 'y', 'k', 'cm', 'my', 'cy', 'k75', 'k50', 'k25', 'k10', 'k0'] as const

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  gsap.from(el.querySelectorAll('.cbar__chip'), {
    scaleY: 0,
    transformOrigin: '50% 100%',
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.035,
    scrollTrigger: { trigger: el, start: 'top 95%', once: true },
  })
})
</script>

<template>
  <div ref="root" class="cbar" :class="[`cbar--${tone}`, { 'cbar--compact': compact }]" aria-hidden="true">
    <span v-for="(swatch, i) in swatches" :key="swatch" class="cbar__patch">
      <span class="cbar__chip" :class="`cbar__chip--${swatch}`"></span>
      <span v-if="labels && !compact" class="cbar__label">{{ fx.colorBar[i] }}</span>
    </span>
  </div>
</template>

<style scoped lang="scss">
$chips: (
  'c': $cmyk-c,
  'm': $cmyk-m,
  'y': $cmyk-y,
  'k': $cmyk-k,
  'cm': #2e3192,
  'my': #e3242b,
  'cy': #00a651,
  'k75': #4d4d4c,
  'k50': #8a8987,
  'k25': #c4c2be,
  'k10': #e8e5e0,
  'k0': $surface,
);

.cbar {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  width: 100%;
  max-width: 34rem;

  &__patch {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  &__chip {
    display: block;
    height: 0.85rem;

    @each $name, $color in $chips {
      &--#{$name} {
        background: $color;
      }
    }

    &--k0 {
      box-shadow: inset 0 0 0 1px $line;
    }
  }

  &__label {
    @include mono-label(0.56rem, 0.04em);
    text-align: center;
    color: $ink-muted;
  }

  &--night &__label {
    color: rgba($surface, 0.55);
  }

  &--night &__chip--k {
    box-shadow: inset 0 0 0 1px rgba($surface, 0.25);
  }

  &--compact {
    max-width: 9rem;
    gap: 1px;
  }

  &--compact &__chip {
    height: 0.4rem;
  }
}
</style>

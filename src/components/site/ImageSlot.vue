<script setup lang="ts">
import type { MediaImage } from '@/types'
import { site } from '@/config/site'
import CropMarks from './CropMarks.vue'

// Espacio de foto que no salta al llegar la imagen: el mismo aspect-ratio con
// o sin foto. Mientras el cliente diseña sus fotografías se ve un pliego en
// blanco con marcas de corte y el icono de la familia.
withDefaults(
  defineProps<{
    image?: MediaImage | null
    alt?: string
    icon?: string
    ratio?: string
    label?: string
    compact?: boolean
    tone?: 'paper' | 'night'
  }>(),
  {
    image: null,
    alt: '',
    icon: 'fa-solid fa-image',
    ratio: '4 / 3',
    label: site.solutions.detail.imagePending,
    compact: false,
    tone: 'paper',
  },
)
</script>

<template>
  <figure class="slot" :class="[`slot--${tone}`, { 'slot--compact': compact }]" :style="{ aspectRatio: ratio }">
    <img v-if="image?.url" class="slot__img" :src="image.url" :alt="alt" loading="lazy" decoding="async" />
    <template v-else>
      <CropMarks :tone="tone === 'night' ? 'light' : 'dark'" />
      <i class="slot__icon" :class="icon" aria-hidden="true"></i>
      <figcaption v-if="!compact" class="slot__label">{{ label }}</figcaption>
      <span v-else class="visually-hidden">{{ label }}</span>
    </template>
  </figure>
</template>

<style scoped lang="scss">
.slot {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: $radius-sm;
  background: $sand;
  // El borde lo separa de las secciones que también son arena.
  border: 1px solid $line;
  @include flex(column, center, center, 0.75rem);
  padding: 1.5rem;
  text-align: center;

  &--night {
    background: rgba($surface, 0.06);
    border: 1px solid rgba($surface, 0.1);
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__icon {
    font-size: clamp(2rem, 1.4rem + 2.5vw, 3.2rem);
    color: darken($line, 9%);
    filter: drop-shadow(0 1px 0 rgba($surface, 0.8));
  }

  &--night &__icon {
    color: rgba($surface, 0.28);
    filter: none;
  }

  &__label {
    max-width: 24ch;
    font-size: $text-xs;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: $ink-soft;
  }

  &--night &__label {
    color: rgba($surface, 0.6);
  }

  &--compact {
    padding: 0.75rem;
  }

  &--compact &__icon {
    font-size: 1.35rem;
  }
}
</style>

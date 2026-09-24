<script setup lang="ts">
import { computed } from 'vue'
import type { MediaImage } from '@/types'
import { site, fx } from '@/config/site'
import CropMarks from './CropMarks.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'

// Espacio de foto que no salta al llegar la imagen: el mismo aspect-ratio con
// o sin foto. Mientras el cliente diseña sus fotografías se ve como una hoja
// de prueba: trama de semitono, marcas de corte y registro, rótulo técnico
// ("FOTO · 4:3") y el icono de la familia impreso con un leve desregistro.
const props = withDefaults(
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

const spec = computed(() => `${fx.slot.photo} · ${props.ratio.replace(/\s*\/\s*/, ':')}`)
</script>

<template>
  <figure class="slot" :class="[`slot--${tone}`, { 'slot--compact': compact, 'slot--empty': !image?.url }]" :style="{ aspectRatio: ratio }">
    <img v-if="image?.url" class="slot__img" :src="image.url" :alt="alt" loading="lazy" decoding="async" />
    <template v-else>
      <span class="slot__screen" aria-hidden="true"></span>
      <CropMarks :tone="tone === 'night' ? 'light' : 'dark'" :inset="compact ? '0.45rem' : '0.75rem'" />
      <span class="slot__spec" aria-hidden="true">{{ spec }}</span>
      <RegMark v-if="!compact" class="slot__reg" size="1.1rem" :tone="tone === 'night' ? 'light' : 'ink'" />
      <i class="slot__icon" :class="icon" aria-hidden="true"></i>
      <figcaption v-if="!compact" class="slot__label">{{ label }}</figcaption>
      <span v-else class="visually-hidden">{{ label }}</span>
      <ColorBar v-if="!compact" class="slot__bar" compact />
    </template>
  </figure>
</template>

<style scoped lang="scss">
.slot {
  position: relative;
  isolation: isolate;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: linear-gradient(135deg, $sand 0%, darken($sand, 3%) 100%);
  @include flex(column, center, center, 0.75rem);
  padding: 1.5rem;
  text-align: center;

  &--night {
    background: linear-gradient(135deg, $night-soft 0%, $night 100%);
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.9s $ease;
  }

  // Trama de semitono que se carga hacia una esquina: la "tinta" de la foto.
  &__screen {
    position: absolute;
    inset: 0;
    z-index: -1;
    @include halftone-pattern(rgba($ink, 0.2), 9px, 1.5px);
    mask-image: radial-gradient(circle at 85% 90%, #000 0%, rgba(#000, 0.4) 40%, transparent 72%);
    transition: transform 0.9s $ease;
  }

  &--night &__screen {
    @include halftone-pattern(rgba($accent, 0.4), 9px, 1.5px);
  }

  &__spec {
    position: absolute;
    top: 1.1rem;
    left: 1.35rem;
    @include mono-label(0.6rem, 0.18em);
    color: $ink-muted;
  }

  &--night &__spec {
    color: rgba($surface, 0.55);
  }

  &__reg {
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    opacity: 0.6;
  }

  // Icono impreso con desregistro: sombras cian y magenta apenas corridas.
  &__icon {
    font-size: clamp(2.4rem, 1.6rem + 3vw, 4.2rem);
    color: $accent-deep;
    text-shadow:
      -3px -1px 0 rgba($cmyk-c, 0.55),
      3px 1px 0 rgba($cmyk-m, 0.45);
    mix-blend-mode: multiply;
    transition: transform 0.9s $ease;
  }

  &--night &__icon {
    color: $accent;
    mix-blend-mode: normal;
    text-shadow:
      -3px -1px 0 rgba($cmyk-c, 0.5),
      3px 1px 0 rgba($cmyk-m, 0.45);
  }

  &__label {
    max-width: 26ch;
    @include mono-label(0.62rem, 0.14em);
    color: $ink-soft;
  }

  &--night &__label {
    color: rgba($surface, 0.65);
  }

  &__bar {
    position: absolute;
    right: 1.25rem;
    bottom: 1.1rem;
    max-width: 5.5rem;
  }

  &--compact {
    padding: 0.75rem;
  }

  &--compact &__spec {
    top: 0.8rem;
    left: 0.95rem;
    font-size: 0.55rem;
  }

  &--compact &__icon {
    font-size: clamp(1.8rem, 1.3rem + 2vw, 2.8rem);
  }
}
</style>

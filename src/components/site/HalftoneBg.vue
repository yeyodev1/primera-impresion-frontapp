<script setup lang="ts">
// Trama de semitono estática en CSS (la versión viva es fx/HalftoneCanvas):
// dos lineaturas superpuestas, una clara y otra naranja desfasada, que se
// desvanecen hacia un lado como un degradado impreso en offset.
withDefaults(defineProps<{ fade?: 'left' | 'right'; tone?: 'night' | 'paper' }>(), {
  fade: 'right',
  tone: 'night',
})
</script>

<template>
  <span class="halftone" :class="[`halftone--${fade}`, `halftone--${tone}`]" aria-hidden="true"></span>
</template>

<style scoped lang="scss">
.halftone {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(rgba($surface, 0.14) 1.1px, transparent 1.7px),
    radial-gradient(rgba($accent, 0.22) 1.3px, transparent 1.9px);
  background-size:
    14px 14px,
    23px 23px;
  background-position:
    0 0,
    7px 11px;
  mask-image: linear-gradient(to left, #000 0%, rgba(#000, 0.45) 45%, transparent 88%);

  &--paper {
    background-image:
      radial-gradient(rgba($ink, 0.12) 1.1px, transparent 1.7px),
      radial-gradient(rgba($accent, 0.2) 1.3px, transparent 1.9px);
  }

  &--left {
    mask-image: linear-gradient(to right, #000 0%, rgba(#000, 0.45) 45%, transparent 88%);
  }
}
</style>

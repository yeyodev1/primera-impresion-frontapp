<script setup lang="ts">
// Trama de semitono para los bloques oscuros: puntos a baja opacidad que se
// desvanecen hacia un lado, como un degradado impreso en offset.
withDefaults(defineProps<{ fade?: 'left' | 'right' }>(), { fade: 'right' })
</script>

<template>
  <span class="halftone" :class="`halftone--${fade}`" aria-hidden="true"></span>
</template>

<style scoped lang="scss">
.halftone {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba($surface, 0.13) 1.1px, transparent 1.6px);
  background-size: 14px 14px;
  mask-image: linear-gradient(to left, #000 0%, rgba(#000, 0.5) 40%, transparent 85%);

  &--left {
    mask-image: linear-gradient(to right, #000 0%, rgba(#000, 0.5) 40%, transparent 85%);
  }
}
</style>

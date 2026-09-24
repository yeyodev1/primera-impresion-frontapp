<script setup lang="ts">
// Puntos de registro CMYK: el guiño de oficio que aparece en los pliegos de
// prueba. Puramente decorativo.
withDefaults(defineProps<{ size?: 'sm' | 'md' }>(), { size: 'sm' })
</script>

<template>
  <span class="cmyk" :class="`cmyk--${size}`" aria-hidden="true">
    <span class="cmyk__dot cmyk__dot--c"></span>
    <span class="cmyk__dot cmyk__dot--m"></span>
    <span class="cmyk__dot cmyk__dot--y"></span>
    <span class="cmyk__dot cmyk__dot--k"></span>
  </span>
</template>

<style scoped lang="scss">
.cmyk {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;

    &--c {
      background: #00a3e0;
    }
    &--m {
      background: #e0007a;
    }
    &--y {
      background: #ffd400;
    }
    &--k {
      background: #111110;
      box-shadow: 0 0 0 1px rgba($surface, 0.35);
    }
  }

  &--md &__dot {
    width: 0.7rem;
    height: 0.7rem;
  }
}
</style>

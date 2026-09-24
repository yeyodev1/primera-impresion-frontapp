<script setup lang="ts">
// Puntos de registro CMYK: el guiño de oficio que aparece en los pliegos de
// prueba. Puramente decorativo. Con `stacked` se solapan como tintas
// sobreimpresas (multiplicadas).
withDefaults(defineProps<{ size?: 'sm' | 'md'; stacked?: boolean }>(), { size: 'sm', stacked: false })
</script>

<template>
  <span class="cmyk" :class="[`cmyk--${size}`, { 'cmyk--stacked': stacked }]" aria-hidden="true">
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
  gap: 0.3rem;
  flex-shrink: 0;

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;

    &--c {
      background: $cmyk-c;
    }
    &--m {
      background: $cmyk-m;
    }
    &--y {
      background: $cmyk-y;
    }
    &--k {
      background: $cmyk-k;
      box-shadow: 0 0 0 1px rgba($surface, 0.35);
    }
  }

  &--md &__dot {
    width: 0.7rem;
    height: 0.7rem;
  }

  &--stacked {
    gap: 0;

    .cmyk__dot + .cmyk__dot {
      margin-left: -0.2rem;
    }

    .cmyk__dot {
      mix-blend-mode: multiply;
    }
  }
}
</style>

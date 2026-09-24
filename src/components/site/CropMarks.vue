<script setup lang="ts">
// Marcas de corte en las cuatro esquinas. El padre necesita position: relative.
withDefaults(defineProps<{ tone?: 'dark' | 'light' | 'accent' }>(), { tone: 'dark' })
</script>

<template>
  <span class="crop" :class="`crop--${tone}`" aria-hidden="true">
    <span class="crop__mark crop__mark--tl"></span>
    <span class="crop__mark crop__mark--tr"></span>
    <span class="crop__mark crop__mark--bl"></span>
    <span class="crop__mark crop__mark--br"></span>
  </span>
</template>

<style scoped lang="scss">
.crop {
  position: absolute;
  inset: 0.6rem;
  pointer-events: none;
  --crop-color: #{$ink-muted};

  &--light {
    --crop-color: #{rgba($surface, 0.45)};
  }

  &--accent {
    --crop-color: #{$accent};
  }

  &__mark {
    position: absolute;
    width: 0.9rem;
    height: 0.9rem;
    border-color: var(--crop-color);
    border-style: solid;
    border-width: 0;

    &--tl {
      top: 0;
      left: 0;
      border-top-width: 1.5px;
      border-left-width: 1.5px;
    }
    &--tr {
      top: 0;
      right: 0;
      border-top-width: 1.5px;
      border-right-width: 1.5px;
    }
    &--bl {
      bottom: 0;
      left: 0;
      border-bottom-width: 1.5px;
      border-left-width: 1.5px;
    }
    &--br {
      bottom: 0;
      right: 0;
      border-bottom-width: 1.5px;
      border-right-width: 1.5px;
    }
  }
}
</style>

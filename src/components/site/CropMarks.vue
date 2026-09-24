<script setup lang="ts">
// Marcas de corte de imprenta en las cuatro esquinas: dos filetes finos por
// esquina que no llegan a tocarse, como en un pliego antes de guillotinar.
// El padre necesita position: relative.
withDefaults(defineProps<{ tone?: 'dark' | 'light' | 'accent'; inset?: string }>(), {
  tone: 'dark',
  inset: '0.6rem',
})
</script>

<template>
  <span class="crop" :class="`crop--${tone}`" :style="{ inset }" aria-hidden="true">
    <span class="crop__mark crop__mark--tl"></span>
    <span class="crop__mark crop__mark--tr"></span>
    <span class="crop__mark crop__mark--bl"></span>
    <span class="crop__mark crop__mark--br"></span>
  </span>
</template>

<style scoped lang="scss">
.crop {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  --crop-color: #{$ink-muted};
  --crop-len: 0.95rem;
  --crop-gap: 0.3rem;

  &--light {
    --crop-color: #{rgba($surface, 0.5)};
  }

  &--accent {
    --crop-color: #{$accent};
  }

  &__mark {
    position: absolute;
    width: calc(var(--crop-len) + var(--crop-gap));
    height: calc(var(--crop-len) + var(--crop-gap));

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: var(--crop-color);
    }

    // Filete horizontal y vertical, separados de la esquina por --crop-gap.
    &::before {
      height: 1px;
      width: var(--crop-len);
    }

    &::after {
      width: 1px;
      height: var(--crop-len);
    }

    &--tl {
      top: 0;
      left: 0;

      &::before {
        top: 0;
        left: var(--crop-gap);
      }
      &::after {
        left: 0;
        top: var(--crop-gap);
      }
    }

    &--tr {
      top: 0;
      right: 0;

      &::before {
        top: 0;
        right: var(--crop-gap);
      }
      &::after {
        right: 0;
        top: var(--crop-gap);
      }
    }

    &--bl {
      bottom: 0;
      left: 0;

      &::before {
        bottom: 0;
        left: var(--crop-gap);
      }
      &::after {
        left: 0;
        bottom: var(--crop-gap);
      }
    }

    &--br {
      bottom: 0;
      right: 0;

      &::before {
        bottom: 0;
        right: var(--crop-gap);
      }
      &::after {
        right: 0;
        bottom: var(--crop-gap);
      }
    }
  }
}
</style>

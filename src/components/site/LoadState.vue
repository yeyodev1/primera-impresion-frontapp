<script setup lang="ts">
import { copy } from '@/config/site'
import CropMarks from './CropMarks.vue'
import RegMark from '@/components/fx/RegMark.vue'

// Estados de carga, error y vacío con la misma altura, para que la página no
// salte. Se ven como una hoja de prueba enmarcada con marcas de corte: al
// cargar gira la marca de registro y corre una tira de tinta. Los colores
// salen de currentColor, así sirve sobre papel y sobre noche.
defineProps<{ loading?: boolean; error?: string; empty?: string; icon?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="state state--loading" role="status" aria-live="polite">
    <CropMarks inset="0" />
    <RegMark class="state__reg" size="2.2rem" tone="accent" />
    <p class="state__label">{{ copy.states.loading }}</p>
    <span class="state__rail" aria-hidden="true"><span class="state__run"></span></span>
  </div>
  <div v-else-if="error" class="state state--error" role="alert">
    <CropMarks inset="0" />
    <i class="fa-solid fa-triangle-exclamation state__icon" aria-hidden="true"></i>
    <p class="state__text">{{ copy.states.error }} {{ error }}</p>
    <button type="button" class="state__retry" @click="$emit('retry')">
      <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
      {{ copy.states.retry }}
    </button>
  </div>
  <div v-else-if="empty" class="state">
    <CropMarks inset="0" />
    <i :class="icon ?? 'fa-solid fa-layer-group'" class="state__icon" aria-hidden="true"></i>
    <p class="state__text">{{ empty }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.state {
  position: relative;
  @include flex(column, center, center, 1rem);
  min-height: 15rem;
  padding: 3rem 1.5rem;
  text-align: center;

  :deep(.crop) {
    --crop-color: currentColor;
    --crop-len: 1.4rem;
    opacity: 0.45;
  }

  &__reg {
    animation: state-spin 2.4s $ease-press infinite;
  }

  &__label {
    @include mono-label(0.68rem, 0.22em);
    opacity: 0.75;
  }

  &__rail {
    position: relative;
    width: min(14rem, 70%);
    height: 2px;
    overflow: hidden;
    background: color-mix(in srgb, currentColor 22%, transparent);
  }

  &__run {
    position: absolute;
    inset: 0;
    width: 40%;
    background: $accent;
    animation: state-run 1.3s $ease-press infinite;
  }

  &__icon {
    font-size: 2rem;
    color: $accent-deep;
    text-shadow:
      -2px -1px 0 rgba($cmyk-c, 0.45),
      2px 1px 0 rgba($cmyk-m, 0.4);
  }

  &--error &__icon {
    color: $danger;
  }

  &__text {
    max-width: 46ch;
    font-size: $text-lg;
    line-height: 1.5;
    opacity: 0.8;
  }

  &__retry {
    @include flex(row, center, center, 0.55rem);
    min-height: 44px;
    padding: 0.55rem 1.1rem;
    border: 1px solid currentColor;
    border-radius: $radius-pill;
    @include mono-label(0.68rem, 0.14em);
    color: inherit;
    @include transition(background, color);
    @include focus-ring;

    &:hover {
      background: $accent-deep;
      border-color: $accent-deep;
      color: $surface;
    }
  }

  @include reduced-motion {
    &__reg,
    &__run {
      animation: none;
    }

    &__run {
      width: 100%;
      opacity: 0.6;
    }
  }
}

@keyframes state-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes state-run {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
</style>

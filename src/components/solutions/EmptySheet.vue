<script setup lang="ts">
import { fxCatalog } from '@/config/site'
import RegMark from '@/components/fx/RegMark.vue'
import CropMarks from '@/components/site/CropMarks.vue'

// Estado vacío como un pliego en blanco: marcas de corte, rótulo técnico, un
// cero hueco enorme y la invitación a hablar con un asesor (slot).
defineProps<{ text: string; icon?: string }>()
</script>

<template>
  <div class="blank" role="status">
    <CropMarks inset="0.9rem" />
    <RegMark class="blank__reg" size="1.2rem" tone="ink" />
    <span class="blank__zero" aria-hidden="true">0</span>
    <p class="blank__spec" aria-hidden="true">{{ fxCatalog.solutions.empty.spec }}</p>
    <i v-if="icon" class="blank__icon" :class="icon" aria-hidden="true"></i>
    <p class="blank__title">{{ fxCatalog.solutions.empty.title }}</p>
    <p class="blank__text">{{ text }}</p>
    <div class="blank__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.blank {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  @include flex(column, flex-start, center, 0.85rem);
  min-height: 24rem;
  padding: 3rem 1.75rem;
  background: $surface;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba($ink, 0.08);

  @include from('md') {
    padding: 4rem 3.5rem;
  }

  &__reg {
    position: absolute;
    top: 1.4rem;
    right: 1.6rem;
    opacity: 0.5;
  }

  &__zero {
    position: absolute;
    right: -0.05em;
    bottom: -0.22em;
    z-index: -1;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(14rem, 10rem + 16vw, 26rem);
    line-height: 1;
    @include outline-text(rgba($ink, 0.1), 2px);
  }

  &__spec {
    @include mono-label(0.64rem, 0.18em);
    color: $ink-muted;
  }

  &__icon {
    font-size: 2.2rem;
    color: $accent-deep;
  }

  &__title {
    max-width: 22ch;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(1.7rem, 1.2rem + 1.8vw, 2.6rem);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  &__text {
    max-width: 48ch;
    color: $ink-soft;
  }

  &__actions {
    margin-top: 0.5rem;
  }
}
</style>

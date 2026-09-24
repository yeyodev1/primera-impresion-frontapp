<script setup lang="ts">
import CropMarks from '@/components/site/CropMarks.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'

// Beneficio principal del portal como un pliego naranja grande: número hueco
// gigante, rótulo mono, icono y titular.
defineProps<{
  item: { icon: string; title: string; text: string }
  number: string
  label: string
}>()
</script>

<template>
  <article class="feat">
    <HalftoneBg tone="paper" fade="left" />
    <CropMarks inset="0.8rem" />
    <span class="feat__num" aria-hidden="true">{{ number }}</span>
    <p class="feat__label">{{ label }}</p>
    <i class="feat__icon" :class="item.icon" aria-hidden="true"></i>
    <h3 class="feat__title">{{ item.title }}</h3>
    <p class="feat__text">{{ item.text }}</p>
  </article>
</template>

<style scoped lang="scss">
.feat {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  @include flex(column, flex-start, flex-end, 0.7rem);
  min-height: 24rem;
  padding: 2rem 1.75rem;
  border-radius: 4px;
  background: $accent;
  color: $night;

  @include from('md') {
    min-height: 26rem;
    padding: 2.5rem;
  }

  &__num {
    position: absolute;
    top: 0.5rem;
    right: 1.25rem;
    z-index: -1;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(8rem, 6rem + 6vw, 13rem);
    line-height: 0.85;
    letter-spacing: -0.06em;
    @include outline-text(rgba($night, 0.35), 1.5px);
  }

  &__label {
    position: absolute;
    top: 2rem;
    left: 1.75rem;
    @include mono-label(0.64rem, 0.18em);

    @include from('md') {
      left: 2.5rem;
      top: 2.5rem;
    }
  }

  &__icon {
    font-size: 3rem;
  }

  &__title {
    font-size: clamp(2.2rem, 1.6rem + 2.4vw, 3.6rem);
    font-weight: 800;
    line-height: 0.92;
    letter-spacing: -0.045em;
  }

  &__text {
    max-width: 34ch;
    font-size: $text-lg;
    font-weight: 500;
    line-height: 1.45;
  }
}
</style>

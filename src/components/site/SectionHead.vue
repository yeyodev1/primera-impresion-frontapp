<script setup lang="ts">
import SplitReveal from '@/components/fx/SplitReveal.vue'

// Encabezado de sección: número mono de pliego + eyebrow sobre un filete,
// titular que entra por palabras y texto de apoyo. Con `tone="night"` se usa
// sobre fondos oscuros. `index` (ej. '02 / 07') es opcional.
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    text?: string
    tone?: 'paper' | 'night'
    align?: 'start' | 'center'
    as?: 'h2' | 'h3'
    index?: string
    accent?: string
  }>(),
  { tone: 'paper', align: 'start', as: 'h2' },
)
</script>

<template>
  <div class="head" :class="[`head--${tone}`, `head--${align}`]">
    <p v-if="eyebrow || index" class="head__eyebrow">
      <span v-if="index" class="head__index">{{ index }}</span>
      <span v-if="eyebrow">{{ eyebrow }}</span>
    </p>
    <SplitReveal :as="as" class="head__title" :text="title" :accent="accent" />
    <SplitReveal v-if="text" class="head__text" :text="text" by="lines" :delay="0.15" />
  </div>
</template>

<style scoped lang="scss">
.head {
  @include flex(column, flex-start, flex-start, 1rem);
  max-width: 52rem;
  margin-bottom: $space-lg;

  &--center {
    align-items: center;
    text-align: center;
    margin-inline: auto;
  }

  &__eyebrow {
    @include mono-label(0.7rem, 0.18em);
    @include flex(row, center, flex-start, 0.85rem);
    // Un punto más oscuro que $accent-deep: AA sobre papel en texto pequeño.
    color: darken($accent-deep, 4%);

    &::before {
      content: '';
      width: 2rem;
      height: 1px;
      background: currentColor;
    }
  }

  &__index {
    white-space: nowrap;
    padding: 0.2rem 0.45rem;
    border: 1px solid currentColor;
    border-radius: 2px;
  }

  &__title {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2rem, 1.2rem + 3.2vw, 4.2rem);
    line-height: 0.98;
    letter-spacing: -0.035em;
    text-wrap: balance;
    color: $ink;
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.55;
    color: $ink-soft;
    max-width: 56ch;
  }

  &--night &__eyebrow {
    color: $accent;
  }

  &--night &__title {
    color: $surface;
    --split-accent: #{$accent};
  }

  &--night &__text {
    color: rgba($surface, 0.72);
  }
}
</style>

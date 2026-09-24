<script setup lang="ts">
import { vReveal } from '@/composables/useReveal'

// Pasos numerados con el número grande en naranja, conectados por una línea
// punteada como un recorrido de producción.
withDefaults(
  defineProps<{
    steps: ReadonlyArray<{ title: string; text: string }>
    basis?: string
  }>(),
  { basis: '220px' },
)
</script>

<template>
  <ol class="steps" :style="{ '--step-basis': basis }">
    <li v-for="(step, index) in steps" :key="step.title" v-reveal="index" class="steps__item">
      <span class="steps__num" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
      <h3 class="steps__title">{{ step.title }}</h3>
      <p class="steps__text">{{ step.text }}</p>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  @include from('md') {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2rem 1.5rem;
  }

  &__item {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.4rem);
    padding-top: 1.1rem;
    border-top: 1.5px dashed $line;

    @include from('md') {
      flex: 1 1 var(--step-basis);
      min-width: 0;
    }

    &::before {
      content: '';
      position: absolute;
      top: -5px;
      left: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $accent;
    }
  }

  &__num {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.6rem, 2rem + 2.5vw, 3.6rem);
    line-height: 1;
    letter-spacing: -0.04em;
    color: $accent;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $ink;
  }

  &__text {
    color: $ink-soft;
    line-height: 1.55;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

// Pasos numerados como un recorrido de producción: número gigante hueco que
// se rellena de naranja, filete que se imprime de izquierda a derecha al
// entrar y rótulo mono del paso. La API (steps, basis) no cambia.
withDefaults(
  defineProps<{
    steps: ReadonlyArray<{ title: string; text: string }>
    basis?: string
  }>(),
  { basis: '220px' },
)

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const items = el.querySelectorAll<HTMLElement>('.steps__item')
  gsap
    .timeline({ scrollTrigger: { trigger: el, start: 'top 80%', once: true } })
    .from(el.querySelectorAll('.steps__rule'), { scaleX: 0, transformOrigin: 'left', duration: 0.9, ease: 'expo.out', stagger: 0.12 })
    .from(items, { y: 30, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.1)
})
</script>

<template>
  <ol ref="root" class="steps" :style="{ '--step-basis': basis }">
    <li v-for="(step, index) in steps" :key="step.title" class="steps__item">
      <span class="steps__rule" aria-hidden="true"></span>
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
  gap: 2.25rem;

  @include from('md') {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2.5rem 1.75rem;
  }

  &__item {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.45rem);
    padding-top: 1.25rem;

    @include from('md') {
      flex: 1 1 var(--step-basis);
      min-width: 0;
    }
  }

  &__rule {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: $ink;

    &::before {
      content: '';
      position: absolute;
      top: -4px;
      left: 0;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: $accent;
    }
  }

  &__num {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(3.4rem, 2.4rem + 3.5vw, 5.6rem);
    line-height: 0.9;
    letter-spacing: -0.05em;
    @include outline-text($accent-deep, 1.5px);
    transition: color 0.5s ease;
  }

  &__item:hover &__num {
    color: $accent;
    -webkit-text-stroke-color: $accent;
  }

  &__title {
    font-size: clamp(1.25rem, 1.05rem + 0.7vw, 1.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $ink;
  }

  &__text {
    color: $ink-soft;
    line-height: 1.55;
  }
}
</style>

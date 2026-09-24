<script setup lang="ts">
import { ref } from 'vue'
import { site, fx } from '@/config/site'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import CropMarks from '@/components/site/CropMarks.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'

// Dos formas de trabajar: dos paneles grandes y desfasados (papel y naranja)
// que se ensanchan al pasar el cursor. Cada panel es un enlace completo.
defineProps<{ index: string }>()

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced }) => {
  if (reduced) return
  gsap.from('.mode', {
    clipPath: 'inset(100% 0% 0% 0%)',
    y: 60,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.15,
    scrollTrigger: { trigger: '.modes__panels', start: 'top 80%', once: true },
  })
})
</script>

<template>
  <section id="modos" ref="root" class="modes">
    <div class="modes__inner">
      <SectionHead :index="index" :eyebrow="site.home.modes.eyebrow" :title="site.home.modes.title" />
      <div class="modes__panels">
        <article
          v-for="(mode, i) in site.home.modes.items"
          :key="mode.title"
          class="mode"
          :class="i === 0 ? 'mode--paper' : 'mode--accent'"
        >
          <HalftoneBg tone="paper" fade="right" />
          <CropMarks inset="0.9rem" />
          <p class="mode__label">{{ fx.modes.labels[i] }}</p>
          <span class="mode__num" aria-hidden="true">{{ fx.index(i + 1) }}</span>
          <i class="mode__icon" :class="mode.icon" aria-hidden="true"></i>
          <h3 class="mode__title">{{ mode.title }}</h3>
          <p class="mode__text">{{ mode.text }}</p>
          <RouterLink :to="mode.link.to" class="mode__link">
            {{ mode.link.label }}
            <span class="mode__arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.modes {
  padding-block: $space-section;
  background: $paper;

  &__inner {
    @include container(1320px);
  }

  &__panels {
    @include flex(column, stretch, flex-start, 1.25rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }
}

.mode {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  @include flex(column, flex-start, flex-start, 0.9rem);
  padding: 2.5rem 1.75rem 2rem;
  border-radius: 4px;
  min-height: 28rem;

  @include from('md') {
    flex: 1 1 0;
    min-width: 0;
    padding: 3.25rem 2.75rem 2.5rem;
    min-height: 34rem;
    transition: flex-grow 0.8s $ease;

    &:hover {
      flex-grow: 1.4;
    }

    // Composición desfasada: el segundo pliego baja.
    &--accent {
      margin-top: 6rem;
    }
  }

  &--paper {
    background: $surface;
    box-shadow: 0 0 0 1px rgba($ink, 0.08);
  }

  &--accent {
    background: $accent;
    color: $night;
  }

  &__label {
    @include mono-label(0.66rem, 0.18em);
    color: $ink-muted;
  }

  &--accent &__label {
    color: $night;
  }

  &__num {
    position: absolute;
    right: 1.5rem;
    top: 1.25rem;
    z-index: -1;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(7rem, 5rem + 8vw, 14rem);
    line-height: 0.8;
    letter-spacing: -0.06em;
    @include outline-text(rgba($ink, 0.14), 1.5px);
  }

  &--accent &__num {
    @include outline-text(rgba($night, 0.3), 1.5px);
  }

  &__icon {
    margin-top: auto;
    font-size: 2.4rem;
    color: $accent-deep;
  }

  &--accent &__icon {
    color: $night;
  }

  &__title {
    font-size: clamp(1.7rem, 1.2rem + 1.8vw, 2.8rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.035em;
    max-width: 16ch;
  }

  &__text {
    max-width: 46ch;
    line-height: 1.6;
    color: $ink-soft;
  }

  &--accent &__text {
    color: $night;
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    margin-top: 0.5rem;
    font-weight: 700;
    @include focus-ring($ink);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }

  &__arrow {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: $night;
    color: $surface;
    transform: rotate(-45deg);
    transition: transform 0.5s $ease;
  }

  &:hover &__arrow {
    transform: rotate(0);
  }
}
</style>

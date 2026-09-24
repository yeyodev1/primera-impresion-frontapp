<script setup lang="ts">
import { fx } from '@/config/site'
import HalftoneCanvas from '@/components/fx/HalftoneCanvas.vue'
import RegisterTitle from '@/components/fx/RegisterTitle.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'
import RegMark from '@/components/fx/RegMark.vue'
import CmykDots from './CmykDots.vue'

// Hero oscuro con trama viva: titular en registro CMYK a la izquierda y, en
// escritorio, la tarjeta de prueba (slot `aside`) a la derecha. El slot
// `actions` recibe los CTAs. `accent` pinta en naranja parte del titular.
defineProps<{ eyebrow: string; title: string; lead: string; accent?: string }>()
</script>

<template>
  <section class="hero">
    <HalftoneCanvas focus="br" />
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow"><CmykDots /> {{ eyebrow }}</p>
        <RegisterTitle as="h1" size="xl" tone="night" :text="title" :accent="accent" trigger="load" :delay="0.1" drift />
        <SplitReveal :text="lead" by="lines" trigger="load" :delay="0.55" class="hero__lead" />
        <div class="hero__actions">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="$slots.aside" class="hero__aside">
        <slot name="aside" />
      </div>
    </div>
    <p class="hero__foot" aria-hidden="true">
      <RegMark size="1rem" tone="light" />
      <span>{{ fx.coords }}</span>
      <span class="hero__since">{{ fx.since }}</span>
    </p>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: $night;
  color: $surface;

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
    @include flex(column, stretch, flex-start, 3rem);
    padding-top: calc(var(--header-h) + 3rem);
    padding-bottom: 4rem;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      min-height: min(100svh, 56rem);
      padding-top: calc(var(--header-h) + 4rem);
      padding-bottom: 6rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.4rem);
    max-width: 50rem;

    @include from('lg') {
      flex: 1 1 60%;
    }
  }

  &__eyebrow {
    @include mono-label(0.7rem, 0.2em);
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    color: $accent;
  }

  &__lead {
    max-width: 52ch;
    font-size: $text-lg;
    line-height: 1.55;
    color: rgba($surface, 0.78);
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.75rem);
    width: 100%;
    margin-top: 0.75rem;

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: auto;
    }
  }

  &__aside {
    @include flex(row, center, center);

    @include from('lg') {
      flex: 0 1 28rem;
    }
  }

  &__foot {
    @include container(1320px);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1.25rem;
    z-index: 1;
    @include flex(row, center, flex-start, 0.75rem);
    @include mono-label(0.6rem, 0.18em);
    color: rgba($surface, 0.5);
  }

  &__since {
    margin-left: auto;
  }
}
</style>

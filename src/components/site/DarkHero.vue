<script setup lang="ts">
import HalftoneBg from './HalftoneBg.vue'
import CmykDots from './CmykDots.vue'

// Hero oscuro con trama de semitono: texto a la izquierda y, en escritorio,
// la tarjeta de prueba (slot `aside`) a la derecha.
defineProps<{ eyebrow: string; title: string; lead: string }>()
</script>

<template>
  <section class="hero">
    <HalftoneBg />
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow"><CmykDots /> {{ eyebrow }}</p>
        <h1 class="hero__title">{{ title }}</h1>
        <p class="hero__lead">{{ lead }}</p>
        <div class="hero__actions">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="$slots.aside" class="hero__aside">
        <slot name="aside" />
      </div>
    </div>
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
    @include container(1240px);
    position: relative;
    z-index: 1;
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: 3.5rem 4rem;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-block: 6rem 6.5rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.25rem);
    max-width: 44rem;

    @include from('lg') {
      flex: 1 1 58%;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    color: $accent;
  }

  &__title {
    @include display($display-lg, 800);
    letter-spacing: -0.035em;
    line-height: 0.98;
  }

  &__lead {
    max-width: 54ch;
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
      flex: 0 1 26rem;
    }
  }
}
</style>

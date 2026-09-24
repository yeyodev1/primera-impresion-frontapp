<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import HalftoneBg from './HalftoneBg.vue'
import CmykDots from './CmykDots.vue'

// Cabecera oscura de las páginas internas. El slot por defecto recibe
// metadatos o acciones debajo del lead.
defineProps<{
  eyebrow?: string
  title: string
  lead?: string
  back?: { label: string; to: RouteLocationRaw }
}>()
</script>

<template>
  <header class="intro">
    <HalftoneBg />
    <div class="intro__inner">
      <RouterLink v-if="back" :to="back.to" class="intro__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        {{ back.label }}
      </RouterLink>
      <p v-else-if="eyebrow" class="intro__eyebrow">
        <CmykDots />
        {{ eyebrow }}
      </p>
      <h1 class="intro__title">{{ title }}</h1>
      <p v-if="lead" class="intro__lead">{{ lead }}</p>
      <div v-if="$slots.default" class="intro__extra">
        <slot />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.intro {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: $night;
  color: $surface;

  &__inner {
    @include container;
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, flex-start, 1rem);
    padding-block: 3.25rem 3.5rem;

    @include from('md') {
      padding-block: 4.5rem 5rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.75rem);
    color: $accent;
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: rgba($surface, 0.8);
    padding-block: 0.35rem;
    @include transition(color);
    @include focus-ring($accent);

    &:hover {
      color: $accent;
    }
  }

  &__title {
    @include display($display-md, 800);
    max-width: 20ch;
  }

  &__lead {
    max-width: 60ch;
    font-size: $text-lg;
    line-height: 1.55;
    color: rgba($surface, 0.78);
  }

  &__extra {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }
}
</style>

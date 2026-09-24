<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import HalftoneBg from './HalftoneBg.vue'
import CropMarks from './CropMarks.vue'
import { vReveal } from '@/composables/useReveal'

// Banner oscuro de cierre. Si se pasa `cta` pinta un botón; el slot
// `actions` permite poner varios.
defineProps<{
  title: string
  text?: string
  cta?: { label: string; to: RouteLocationRaw }
}>()
</script>

<template>
  <section class="closing">
    <div v-reveal class="closing__box">
      <HalftoneBg fade="left" />
      <CropMarks tone="light" />
      <div class="closing__copy">
        <h2 class="closing__title">{{ title }}</h2>
        <p v-if="text" class="closing__text">{{ text }}</p>
      </div>
      <div class="closing__actions">
        <slot name="actions">
          <RouterLink v-if="cta" :to="cta.to" class="btn btn--primary">
            {{ cta.label }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </slot>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.closing {
  @include container;
  padding-block: $space-xl;

  &__box {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    background: $night;
    color: $surface;
    border-radius: $radius-md;
    padding: 2.5rem 1.5rem;
    @include flex(column, flex-start, flex-start, 1.5rem);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 3.25rem 3.5rem;
      gap: 2.5rem;
    }
  }

  &__copy,
  &__actions {
    position: relative;
    z-index: 1;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.6rem);
    max-width: 38rem;
  }

  &__title {
    @include display($display-sm, 800);
  }

  &__text {
    color: rgba($surface, 0.75);
    font-size: $text-lg;
    line-height: 1.5;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    flex-shrink: 0;
  }
}
</style>

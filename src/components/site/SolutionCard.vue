<script setup lang="ts">
import { computed } from 'vue'
import type { Solution } from '@/types'
import { categoryOf } from '@/composables/useCatalog'
import ImageSlot from './ImageSlot.vue'
import { copy } from './copy'

const props = defineProps<{ solution: Solution; icon?: string }>()
const category = computed(() => categoryOf(props.solution))
</script>

<template>
  <article class="scard">
    <ImageSlot :image="solution.image" :alt="solution.name" :icon="icon" compact />
    <div class="scard__body">
      <span v-if="category" class="scard__pill">{{ category.name }}</span>
      <h3 class="scard__title">{{ solution.name }}</h3>
      <p v-if="solution.summary" class="scard__text">{{ solution.summary }}</p>
      <RouterLink :to="`/soluciones/${solution.slug}`" class="scard__link">
        {{ copy.solutions.cardCta }}
        <span class="visually-hidden">: {{ solution.name }}</span>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.scard {
  @include card;
  position: relative;
  @include flex(column, stretch, flex-start);
  padding: 0.6rem;
  border-radius: $radius-sm;
  @include transition;

  &:hover {
    border-color: rgba($accent, 0.45);
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  &__body {
    flex: 1;
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding: 1rem 0.9rem 0.9rem;
  }

  &__pill {
    padding: 0.2rem 0.65rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: darken($accent-deep, 6%);
    font-size: $text-xs;
    font-weight: 600;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.55;
  }

  &__link {
    margin-top: auto;
    padding-top: 0.5rem;
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    color: $ink;
    @include focus-ring;

    i {
      color: $accent;
      @include transition(transform);
    }

    &:hover i {
      transform: translateX(3px);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
  }
}
</style>

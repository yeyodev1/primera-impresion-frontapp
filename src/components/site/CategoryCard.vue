<script setup lang="ts">
import type { Category } from '@/types'
import ImageSlot from './ImageSlot.vue'
import { copy } from './copy'

// Familia de productos: lleva a Soluciones ya filtrado por su slug.
defineProps<{ category: Category }>()
</script>

<template>
  <article class="ccard">
    <ImageSlot :image="category.image" :alt="category.name" :icon="category.icon || undefined" ratio="16 / 10" compact />
    <div class="ccard__body">
      <p v-if="category.solutionsCount" class="ccard__count">{{ copy.solutions.count(category.solutionsCount) }}</p>
      <h3 class="ccard__title">{{ category.name }}</h3>
      <p v-if="category.description" class="ccard__text">{{ category.description }}</p>
      <RouterLink :to="{ path: '/soluciones', query: { categoria: category.slug } }" class="ccard__link">
        {{ copy.solutions.categoryCta }}
        <span class="visually-hidden">: {{ category.name }}</span>
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.ccard {
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
    @include flex(column, flex-start, flex-start, 0.45rem);
    padding: 1rem 0.9rem 0.9rem;
  }

  &__count {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $ink-soft;
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
    color: darken($accent-deep, 4%);
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
  }
}
</style>

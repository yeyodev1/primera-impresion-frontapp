<script setup lang="ts">
import type { Category } from '@/types'
import { copy, fx } from '@/config/site'
import TiltCard from '@/components/fx/TiltCard.vue'
import ImageSlot from './ImageSlot.vue'

// Familia de productos: lleva a Soluciones ya filtrado por su slug. `index`
// (opcional) pinta su número de orden en mono; `tone="night"` para fondos oscuros.
withDefaults(defineProps<{ category: Category; index?: number; tone?: 'paper' | 'night' }>(), { tone: 'paper' })
</script>

<template>
  <TiltCard class="ccard" :class="`ccard--${tone}`" :tone="tone" :max="4">
    <ImageSlot :image="category.image" :alt="category.name" :icon="category.icon || undefined" ratio="4 / 3" :tone="tone" compact />
    <div class="ccard__body">
      <p class="ccard__meta">
        <span v-if="index">{{ fx.index(index) }}</span>
        <span v-if="category.solutionsCount">{{ copy.solutions.count(category.solutionsCount) }}</span>
      </p>
      <h3 class="ccard__title">{{ category.name }}</h3>
      <p v-if="category.description" class="ccard__text">{{ category.description }}</p>
      <RouterLink :to="{ path: '/soluciones', query: { categoria: category.slug } }" class="ccard__link">
        {{ copy.solutions.categoryCta }}
        <span class="visually-hidden">: {{ category.name }}</span>
        <span class="ccard__arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
      </RouterLink>
    </div>
  </TiltCard>
</template>

<style scoped lang="scss">
.ccard {
  position: relative;
  @include flex(column, stretch, flex-start);
  padding: 0.55rem;
  border-radius: 6px;
  background: $surface;
  box-shadow: 0 0 0 1px rgba($ink, 0.07);
  @include transition(box-shadow);

  &:hover {
    box-shadow:
      0 0 0 1px rgba($accent, 0.5),
      0 24px 50px -24px rgba($ink, 0.35);
  }

  &--night {
    background: $night-soft;
    color: $surface;
    box-shadow: 0 0 0 1px rgba($surface, 0.08);
  }

  :deep(.slot__icon),
  :deep(.slot__screen) {
    transition: transform 0.9s $ease;
  }

  &:hover :deep(.slot__icon) {
    transform: scale(1.12) rotate(-4deg);
  }

  &:hover :deep(.slot__screen) {
    transform: scale(1.15);
  }

  &__body {
    flex: 1;
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding: 1.1rem 0.8rem 0.8rem;
  }

  &__meta {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    @include mono-label(0.62rem, 0.14em);
    color: $ink-muted;
  }

  &--night &__meta {
    color: rgba($surface, 0.55);
  }

  &__title {
    font-size: clamp(1.35rem, 1.1rem + 0.8vw, 1.7rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.55;
  }

  &--night &__text {
    color: rgba($surface, 0.68);
  }

  &__link {
    margin-top: auto;
    padding-top: 0.9rem;
    width: 100%;
    @include flex(row, center, space-between, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    border-top: 1px solid rgba($ink, 0.08);
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
  }

  &--night &__link {
    border-color: rgba($surface, 0.1);
  }

  &__arrow {
    @include flex(row, center, center);
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: $accent-deep;
    color: $surface;
    transform: rotate(-45deg);
    transition: transform 0.5s $ease;
  }

  &:hover &__arrow {
    transform: rotate(0);
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import type { Solution } from '@/types'
import { categoryOf } from '@/composables/useCatalog'
import { copy } from '@/config/site'
import ImageSlot from './ImageSlot.vue'

// Solución del escaparate: hoja con foto (o espacio de prueba), familia en
// mono, nombre y enlace a la ficha. Toda la tarjeta es clicable.
const props = defineProps<{ solution: Solution; icon?: string }>()
const category = computed(() => categoryOf(props.solution))
</script>

<template>
  <article class="scard">
    <ImageSlot :image="solution.image" :alt="solution.name" :icon="icon" compact />
    <div class="scard__body">
      <span v-if="category" class="scard__cat">{{ category.name }}</span>
      <h3 class="scard__title">{{ solution.name }}</h3>
      <p v-if="solution.summary" class="scard__text">{{ solution.summary }}</p>
      <RouterLink :to="`/soluciones/${solution.slug}`" class="scard__link">
        {{ copy.solutions.cardCta }}
        <span class="visually-hidden">: {{ solution.name }}</span>
        <span class="scard__arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.scard {
  position: relative;
  @include flex(column, stretch, flex-start);
  padding: 0.55rem;
  border-radius: 6px;
  background: $surface;
  box-shadow: 0 0 0 1px rgba($ink, 0.07);
  transition:
    box-shadow 0.4s ease,
    transform 0.6s $ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 0 0 1px rgba($accent, 0.5),
      0 24px 50px -24px rgba($ink, 0.35);
  }

  :deep(.slot__icon),
  :deep(.slot__img) {
    transition: transform 0.9s $ease;
  }

  &:hover :deep(.slot__icon) {
    transform: scale(1.12) rotate(-4deg);
  }

  &:hover :deep(.slot__img) {
    transform: scale(1.05);
  }

  &__body {
    flex: 1;
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding: 1.1rem 0.8rem 0.8rem;
  }

  &__cat {
    @include mono-label(0.62rem, 0.14em);
    color: darken($accent-deep, 4%);
  }

  &__title {
    font-size: clamp(1.25rem, 1.05rem + 0.7vw, 1.55rem);
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.55;
  }

  &__link {
    margin-top: auto;
    padding-top: 0.9rem;
    width: 100%;
    @include flex(row, center, space-between, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    color: $ink;
    border-top: 1px solid rgba($ink, 0.08);
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
  }

  &__arrow {
    @include flex(row, center, center);
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    border: 1px solid $ink;
    transform: rotate(-45deg);
    transition:
      transform 0.5s $ease,
      background-color 0.3s ease,
      color 0.3s ease;
  }

  &:hover &__arrow {
    transform: rotate(0);
    background: $ink;
    color: $surface;
  }
}
</style>

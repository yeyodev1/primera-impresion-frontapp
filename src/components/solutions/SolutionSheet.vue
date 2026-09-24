<script setup lang="ts">
import { computed } from 'vue'
import type { Solution } from '@/types'
import { copy } from '@/config/site'
import { fxCatalog } from '@/config/fx.catalog'
import { categoryOf } from '@/composables/useCatalog'
import TiltCard from '@/components/fx/TiltCard.vue'
import ImageSlot from '@/components/site/ImageSlot.vue'

// Lámina de catálogo sin caja: foto con tilt, número y familia en mono, nombre
// que se desregistra en CMYK al pasar el cursor. `wide`: destacada apaisada
// desde md. `rowOnMobile`: apaisada bajo 480 px. `tone="night"` sobre oscuro.
const props = withDefaults(
  defineProps<{
    solution: Solution
    icon?: string
    number?: number
    tone?: 'paper' | 'night'
    wide?: boolean
    rowOnMobile?: boolean
  }>(),
  { tone: 'paper' },
)
const category = computed(() => categoryOf(props.solution))
</script>

<template>
  <article
    class="sheet"
    :class="[`sheet--${tone}`, { 'sheet--wide': wide, 'sheet--row': rowOnMobile }]"
  >
    <TiltCard as="div" class="sheet__media" :tone="tone" :max="7">
      <ImageSlot
        :image="solution.image"
        :alt="solution.name"
        :icon="icon"
        :tone="tone"
        :ratio="wide ? '16 / 10' : '4 / 3'"
        compact
      />
    </TiltCard>
    <div class="sheet__body">
      <p class="sheet__meta">
        <span v-if="number" class="sheet__num" aria-hidden="true">{{
          fxCatalog.solutions.number(number)
        }}</span>
        <span v-if="category" class="sheet__cat">{{ category.name }}</span>
      </p>
      <h3 class="sheet__title">{{ solution.name }}</h3>
      <p v-if="solution.summary" class="sheet__text">{{ solution.summary }}</p>
      <div class="sheet__foot">
        <span class="sheet__opts">{{ fxCatalog.solutions.options(solution.options.length) }}</span>
        <RouterLink :to="`/soluciones/${solution.slug}`" class="sheet__link">
          <span class="visually-hidden">{{ copy.solutions.cardCta }}: {{ solution.name }}</span>
          <span class="sheet__arrow" aria-hidden="true"
            ><i class="fa-solid fa-arrow-right"></i
          ></span>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.sheet {
  position: relative;
  @include flex(column, stretch, flex-start);
  height: 100%;

  &__media {
    border-radius: 3px;
    box-shadow: 0 0 0 1px rgba($ink, 0.06);
    transition: box-shadow 0.5s ease;

    :deep(.slot__icon),
    :deep(.slot__img),
    :deep(.slot__screen) {
      transition: transform 0.9s $ease;
    }
  }

  &--night &__media {
    box-shadow: 0 0 0 1px rgba($surface, 0.08);
  }

  &:hover &__media {
    box-shadow: 0 30px 60px -28px rgba($ink, 0.5);
  }

  &:hover &__media :deep(.slot__icon) {
    transform: scale(1.18) rotate(-6deg);
  }

  &:hover &__media :deep(.slot__img),
  &:hover &__media :deep(.slot__screen) {
    transform: scale(1.07);
  }

  &__body {
    flex: 1;
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding-top: 1rem;
  }

  &__meta {
    width: 100%;
    @include flex(row, center, flex-start, 0.7rem);
    padding-bottom: 0.55rem;
    border-bottom: 1px solid rgba($ink, 0.14);
  }

  &--night &__meta {
    border-bottom-color: rgba($surface, 0.16);
  }

  &__num {
    padding: 0.15rem 0.35rem;
    @include mono-label(0.58rem, 0.12em);
    background: $night;
    color: $surface;
    border-radius: 2px;
    @include transition(background-color, color);
  }

  &--night &__num {
    background: $surface;
    color: $night;
  }

  &:hover &__num {
    background: $accent;
    color: $night;
  }

  &__cat {
    @include mono-label(0.6rem, 0.14em);
    color: darken($accent-deep, 4%);
  }

  &--night &__cat {
    color: $accent;
  }

  &__title {
    font-size: clamp(1.4rem, 1.15rem + 0.8vw, 1.8rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.035em;
    transition: text-shadow 0.35s ease;
  }

  // La prensa se descalibra un instante: el nombre se abre en C y M.
  &:hover &__title {
    text-shadow:
      -2px -1px 0 rgba($cmyk-c, 0.55),
      2px 1px 0 rgba($cmyk-m, 0.5);
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.55;
    color: $ink-soft;
    max-width: 44ch;
  }

  &--night &__text {
    color: rgba($surface, 0.7);
  }

  &__foot {
    width: 100%;
    margin-top: auto;
    padding-top: 0.6rem;
    @include flex(row, center, space-between, 0.75rem);
  }

  &__opts {
    @include mono-label(0.6rem, 0.14em);
    color: $ink-muted;
  }

  &--night &__opts {
    color: rgba($surface, 0.6);
  }

  &__link {
    border-radius: 50%;
    @include focus-ring;

    // Toda la lámina es clicable.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 2;
    }
  }

  &__arrow {
    @include flex(row, center, center);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 1px solid currentColor;
    transform: rotate(-45deg);
    transition:
      transform 0.5s $ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      color 0.3s ease;
  }

  &:hover &__arrow {
    transform: rotate(0);
    background: $accent-deep;
    border-color: $accent-deep;
    color: $surface;
  }

  // Destacada: foto grande al lado del texto (a todo el alto), titular mayor.
  @include from('md') {
    &--wide {
      flex-direction: row;
      align-items: stretch;
      gap: 1.75rem;
    }

    &--wide &__media {
      flex: 0 0 50%;

      :deep(.slot) {
        height: 100%;
        min-height: 17rem;
        aspect-ratio: auto !important;
      }

      // Estirada al alto de la fila ya no mide 16:10: sin rótulo de formato.
      :deep(.slot__spec) {
        display: none;
      }
    }

    &--wide &__body {
      min-width: 0;
      padding-top: 0.25rem;
    }

    &--wide &__title {
      font-size: clamp(1.8rem, 1.2rem + 1vw, 2.3rem);
      line-height: 0.95;
      overflow-wrap: break-word;
    }

    &--wide &__text {
      font-size: $text-base;
    }
  }

  // Apaisada en móvil: foto cuadrada a la izquierda, texto a la derecha.
  @include until('sm') {
    &--row {
      flex-direction: row;
      align-items: stretch;
      gap: 0.9rem;
    }

    &--row &__media {
      flex: 0 0 36%;
      align-self: flex-start;

      :deep(.slot) {
        aspect-ratio: 1 / 1 !important;
      }

      :deep(.slot__spec) {
        display: none;
      }
    }

    &--row &__body {
      min-width: 0;
      padding-top: 0;
      gap: 0.35rem;

      .sheet__title {
        font-size: 1.2rem;
      }
    }

    &--row &__text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>

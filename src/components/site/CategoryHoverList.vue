<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category } from '@/types'
import { copy, fx } from '@/config/site'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import { pointerFollow } from '@/composables/motion/usePointerFollow'
import ImageSlot from './ImageSlot.vue'

// Índice editorial de familias: número mono, nombre enorme, conteo y flecha.
// En escritorio una ficha de previsualización sigue al cursor y muestra la
// familia de la fila activa. Cada fila es un enlace a Soluciones filtrado.
// Pensado para fondo oscuro. Uso: <CategoryHoverList :categories="categories" />
const props = defineProps<{ categories: readonly Category[] }>()

const root = ref<HTMLElement | null>(null)
const active = ref(0)

const { rebuild } = useGsapContext(root, ({ reduced, el }) => {
  const follower = el.querySelector<HTMLElement>('.hlist__preview')
  const list = el.querySelector<HTMLElement>('.hlist__rows')
  const stop = follower && list ? pointerFollow(list, follower) : undefined
  if (!reduced) {
    gsap.from(el.querySelectorAll('.hlist__inner'), {
      yPercent: 105,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    })
    gsap.from(el.querySelectorAll('.hlist__row'), {
      '--rule': 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    })
  }
  return stop
})

watch(() => props.categories.length, rebuild)
</script>

<template>
  <div ref="root" class="hlist">
    <p class="hlist__label" aria-hidden="true">
      <span>{{ fx.solutions.listLabel }}</span>
      <span>{{ fx.index(categories.length) }}</span>
    </p>
    <ul class="hlist__rows">
      <li v-for="(category, index) in categories" :key="category._id" class="hlist__row" @pointerenter="active = index">
        <RouterLink
          :to="{ path: '/soluciones', query: { categoria: category.slug } }"
          class="hlist__link"
          @focus="active = index"
        >
          <span class="hlist__inner">
            <span class="hlist__num" aria-hidden="true">{{ fx.index(index + 1) }}</span>
            <span class="hlist__name">{{ category.name }}</span>
            <span v-if="category.solutionsCount" class="hlist__count">{{ copy.solutions.count(category.solutionsCount) }}</span>
            <span class="hlist__arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
          </span>
        </RouterLink>
      </li>
    </ul>

    <div class="hlist__preview" aria-hidden="true">
      <div v-for="(category, index) in categories" :key="category._id" class="hlist__card" :class="{ 'hlist__card--on': index === active }">
        <ImageSlot :icon="category.icon || undefined" :image="category.image" tone="night" compact />
        <p class="hlist__cardmeta">
          <span>{{ fx.solutions.preview }}</span>
          <span v-if="category.solutionsCount">{{ copy.solutions.count(category.solutionsCount) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hlist {
  position: relative;

  &__label {
    @include flex(row, center, space-between, 1rem);
    padding-bottom: 0.85rem;
    @include mono-label(0.66rem, 0.18em);
    color: rgba($surface, 0.55);
  }

  &__rows {
    list-style: none;
  }

  &__row {
    --rule: 1;
    position: relative;

    // Filete que se imprime de izquierda a derecha al entrar.
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 1px;
      background: rgba($surface, 0.16);
      transform: scaleX(var(--rule));
      transform-origin: left;
    }

    &:last-child::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: rgba($surface, 0.16);
    }
  }

  &__link {
    display: block;
    overflow: hidden;
    color: $surface;
    @include focus-ring;
  }

  &__inner {
    @include flex(row, center, flex-start, 1.25rem);
    padding-block: clamp(0.9rem, 0.6rem + 0.8vw, 1.4rem);
  }

  &__num {
    @include mono-label(0.7rem, 0.1em);
    color: rgba($surface, 0.5);
    width: 2rem;
    flex-shrink: 0;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(1.8rem, 0.9rem + 3.4vw, 4.4rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
    transition:
      transform 0.6s $ease,
      color 0.35s ease;
  }

  &__count {
    @include mono-label(0.68rem, 0.14em);
    color: rgba($surface, 0.6);
    flex-shrink: 0;
  }

  &__arrow {
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid rgba($surface, 0.25);
    transform: rotate(-45deg);
    transition:
      transform 0.5s $ease,
      background-color 0.3s ease,
      border-color 0.3s ease,
      color 0.3s ease;
  }

  &__link:hover &__name,
  &__link:focus-visible &__name {
    transform: translateX(1.5rem);
    color: $accent;
  }

  &__link:hover &__arrow,
  &__link:focus-visible &__arrow {
    transform: rotate(0);
    background: $accent;
    border-color: $accent;
    color: $night;
  }

  // Las filas que no se miran se apagan: el ojo va a la activa.
  @include fine-pointer {
    &__rows:hover &__link:not(:hover) {
      opacity: 0.38;
    }
  }

  &__link {
    transition: opacity 0.4s ease;
  }

  &__preview {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    width: clamp(13rem, 18vw, 17rem);
    // Alto explícito: sin él xPercent/yPercent no centran la ficha en el cursor.
    // Foto cuadrada más la línea de datos de abajo.
    aspect-ratio: 6 / 7;
    pointer-events: none;
    visibility: hidden;
  }

  &__card {
    position: absolute;
    inset: 0;
    padding: 0.5rem;
    background: $night-soft;
    border-radius: 6px;
    box-shadow: 0 40px 70px -20px rgba(#000, 0.6);
    opacity: 0;
    transform: scale(0.94);
    transition:
      opacity 0.3s ease,
      transform 0.5s $ease;

    &--on {
      opacity: 1;
      transform: none;
    }
  }

  &__cardmeta {
    @include flex(row, center, space-between, 0.5rem);
    padding: 0.7rem 0.3rem 0.2rem;
    @include mono-label(0.6rem, 0.14em);
    color: rgba($surface, 0.7);
  }
}
</style>

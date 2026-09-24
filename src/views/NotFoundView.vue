<script setup lang="ts">
import { copy, fx, fxPages } from '@/config/site'
import { ref } from 'vue'
import { hasFinePointer, prefersReducedMotion } from '@/composables/motion/useGsap'
import { useMisregister } from '@/composables/useMisregister'
import HalftoneBg from '@/components/site/HalftoneBg.vue'
import CropMarks from '@/components/site/CropMarks.vue'
import CmykDots from '@/components/site/CmykDots.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'

// 404 como error de impresión: el "404" gigante sale con las cuatro tintas
// desregistradas y se calibra cuando el cursor se acerca (en táctil respira
// solo). Rótulos de hoja de prueba rechazada alrededor.
const digits = ref<HTMLElement | null>(null)
useMisregister(digits)

// Con reduced motion las tintas quedan alineadas: no hay nada que calibrar.
const hint = prefersReducedMotion() ? '' : hasFinePointer() ? fxPages.notFound.hint : fxPages.notFound.hintTouch
// Vector de desregistro de cada tinta (em, em, grados).
const inks = [
  { key: 'c', dx: -0.06, dy: -0.025, rot: -1.5 },
  { key: 'm', dx: 0.05, dy: 0.03, rot: 1.2 },
  { key: 'y', dx: 0.02, dy: -0.05, rot: 0.6 },
  { key: 'k', dx: -0.015, dy: 0.02, rot: -0.4 },
]
</script>

<template>
  <section class="nf">
    <HalftoneBg />
    <CropMarks tone="light" inset="calc(var(--header-h) + 0.75rem) 0.9rem 0.9rem" />
    <div class="nf__inner">
      <div class="nf__meta" aria-hidden="true">
        <span><RegMark size="0.85rem" tone="accent" /> {{ fxPages.notFound.spec }}</span>
        <span class="nf__tol">{{ fxPages.notFound.tolerance }}</span>
        <span class="nf__coords">{{ fx.coords }}</span>
      </div>

      <div ref="digits" class="nf__digits" aria-hidden="true">
        <span class="nf__ghost">404</span>
        <span
          v-for="ink in inks"
          :key="ink.key"
          class="nf__ink"
          :class="`nf__ink--${ink.key}`"
          data-ink
          :data-dx="ink.dx"
          :data-dy="ink.dy"
          :data-rot="ink.rot"
          >404</span
        >
      </div>

      <div class="nf__copy">
        <div class="nf__head">
          <p class="nf__code"><CmykDots /> {{ copy.notFound.code }}</p>
          <SplitReveal as="h1" :text="copy.notFound.title" trigger="load" :delay="0.2" class="nf__title" />
        </div>
        <div class="nf__body">
          <p class="nf__text">{{ copy.notFound.text }}</p>
          <div class="nf__actions">
            <MagneticButton>
              <RouterLink to="/" class="btn btn--primary btn--press">
                {{ copy.notFound.home }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </RouterLink>
            </MagneticButton>
            <RouterLink to="/soluciones" class="btn btn--outline-light btn--press">{{ copy.notFound.explore }}</RouterLink>
          </div>
        </div>
      </div>

      <div class="nf__foot" aria-hidden="true">
        <span class="nf__hint">{{ hint }}</span>
        <ColorBar tone="night" compact class="nf__bar" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.nf {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  flex: 1;
  background: $night;
  color: $surface;

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
    @include flex(column, stretch, flex-start, 1.5rem);
    min-height: 100svh;
    padding-top: calc(var(--header-h) + 2rem);
    padding-bottom: 2.25rem;
  }

  &__meta,
  &__foot {
    @include flex(row, center, space-between, 1rem);
    @include mono-label(0.62rem, 0.18em);
    color: rgba($surface, 0.6);

    > span {
      @include flex(row, center, flex-start, 0.5rem);
      white-space: nowrap;
    }
  }

  &__meta {
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba($surface, 0.12);
  }

  &__tol {
    color: $accent;
  }

  &__tol,
  &__coords {
    display: none !important;

    @include from('md') {
      display: flex !important;
    }
  }

  // El bloque de cifras: base invisible que da la caja, tintas encima.
  &__digits {
    position: relative;
    align-self: center;
    margin-block: 1rem 0.5rem;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(8rem, 1rem + 42vw, 24rem);
    line-height: 0.8;
    letter-spacing: -0.07em;
    user-select: none;
  }

  &__ghost {
    display: block;
    visibility: hidden;
    padding-right: 0.07em;
  }

  &__ink {
    position: absolute;
    inset: 0;
    mix-blend-mode: screen;
    will-change: transform;

    &--c {
      color: $cmyk-c;
    }

    &--m {
      color: $cmyk-m;
    }

    &--y {
      color: $cmyk-y;
    }

    // Sobre negro, C+M+Y en pantalla suman blanco; K es el contorno naranja
    // de la "plancha" que queda como guía.
    &--k {
      color: transparent;
      -webkit-text-stroke: 1.5px $accent;
      mix-blend-mode: normal;
    }
  }

  &__copy {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 3rem;
    }
  }

  &__head,
  &__body {
    @include flex(column, flex-start, flex-start, 1rem);
  }

  &__body {
    @include from('lg') {
      max-width: 34rem;
    }
  }

  &__code {
    @include flex(row, center, flex-start, 0.75rem);
    @include mono-label(0.7rem, 0.2em);
    color: $accent;
  }

  &__title {
    font-family: $font-display;
    font-size: $display-lg;
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.035em;
  }

  &__text {
    max-width: 44ch;
    font-size: $text-lg;
    color: rgba($surface, 0.75);
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.8rem);
    width: 100%;
    margin-top: 0.75rem;

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: auto;
    }
  }

  &__foot {
    margin-top: auto;
    padding-top: 1.5rem;
  }

  &__bar {
    max-width: 9rem;
  }
}
</style>

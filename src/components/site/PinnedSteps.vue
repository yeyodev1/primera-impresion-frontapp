<script setup lang="ts">
import { ref } from 'vue'
import { fx } from '@/config/site'
import { usePressScroll } from '@/composables/motion/usePressScroll'
import CropMarks from './CropMarks.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'

// Pasos como pliegos que pasan por la prensa. Desde lg la sección se fija y
// los pliegos avanzan en horizontal con el scroll; en móvil es una línea de
// tiempo vertical. El slot `head` va arriba (normalmente un SectionHead).
// Uso: <PinnedSteps :steps="site.about.process"><template #head>…</template></PinnedSteps>
defineProps<{ steps: ReadonlyArray<{ title: string; text: string }> }>()

const root = ref<HTMLElement | null>(null)
usePressScroll(root)
</script>

<template>
  <section ref="root" class="press">
    <div class="press__pin">
      <div class="press__head">
        <slot name="head" />
      </div>

      <div class="press__stage">
        <div class="press__roller" aria-hidden="true">
          <span class="press__cyl"></span>
          <span class="press__rollerlabel">{{ fx.how.press }}</span>
          <span class="press__cyl"></span>
        </div>
        <span class="press__line" aria-hidden="true"></span>
        <ol class="press__track">
          <li v-for="(step, index) in steps" :key="step.title" class="press__sheet">
            <CropMarks inset="0.7rem" />
            <p class="press__spec" aria-hidden="true">
              <span>{{ fx.sheet(index + 1, steps.length) }}</span>
              <RegMark size="1rem" tone="ink" />
            </p>
            <span class="press__num" aria-hidden="true">
              {{ fx.index(index + 1) }}
              <span class="press__ink">{{ fx.index(index + 1) }}</span>
            </span>
            <h3 class="press__title">{{ step.title }}</h3>
            <p class="press__text">{{ step.text }}</p>
            <ColorBar class="press__bar" compact />
          </li>
        </ol>
      </div>

      <div class="press__progress" aria-hidden="true">
        <span>{{ fx.how.progress }}</span>
        <span class="press__rail"><span class="press__fill"></span></span>
        <span>{{ fx.index(steps.length) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.press {
  position: relative;
  // La pista del modo fijado es más ancha que la ventana: se recorta acá.
  overflow: hidden;

  &__pin {
    @include container(1320px);
    @include flex(column, stretch, flex-start);
  }

  &__stage {
    position: relative;
  }

  &__roller,
  &__progress {
    display: none;
  }

  // Línea de tiempo (móvil y reduced motion en pantallas chicas).
  &__line {
    position: absolute;
    left: 0.35rem;
    top: 0;
    bottom: 0;
    width: 1px;
    background: $accent-deep;
    transform-origin: top;
  }

  &__track {
    list-style: none;
    @include flex(column, stretch, flex-start, 1.5rem);
    padding-left: 1.75rem;
  }

  &__sheet {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.6rem);
    padding: 1.9rem 1.6rem 1.5rem;
    background: $surface;
    border-radius: 3px;
    box-shadow:
      0 1px 0 rgba($ink, 0.06),
      0 30px 60px -30px rgba($ink, 0.35);

    &::before {
      content: '';
      position: absolute;
      left: -1.75rem;
      top: 2.3rem;
      width: 0.75rem;
      height: 0.75rem;
      margin-left: -0.02rem;
      border-radius: 50%;
      background: $accent;
      box-shadow: 0 0 0 4px $sand;
    }
  }

  &__spec {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    @include mono-label(0.62rem, 0.16em);
    color: $ink-muted;
  }

  &__num {
    position: relative;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(4.5rem, 3rem + 6vw, 9rem);
    line-height: 0.85;
    letter-spacing: -0.06em;
    @include outline-text($accent-deep, 1.5px);
  }

  // Copia rellena del número: la "tinta" que se imprime al pasar el rodillo.
  &__ink {
    position: absolute;
    inset: 0;
    color: $accent;
    -webkit-text-stroke: 0;
  }

  &__title {
    font-size: clamp(1.6rem, 1.2rem + 1.4vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: $ink;
  }

  &__text {
    color: $ink-soft;
    line-height: 1.6;
    max-width: 36ch;
  }

  &__bar {
    margin-top: 0.75rem;
  }

  // Escritorio sin pin (reduced motion): cuatro pliegos en fila.
  @include from('lg') {
    &__line {
      display: none;
    }

    &__track {
      flex-direction: row;
      align-items: stretch;
      padding-left: 0;
      gap: 1.25rem;

      > * {
        flex: 1 1 0;
        min-width: 0;
      }
    }

    &__sheet::before {
      display: none;
    }
  }

  // Escritorio con pin: los pliegos cruzan el escenario por la prensa.
  &--pinned &__pin {
    height: 100vh;
    justify-content: center;
    padding-block: calc(var(--header-h) + 0.5rem) 1.75rem;
  }

  &--pinned &__head :deep(.head) {
    margin-bottom: 1.75rem;
  }

  &--pinned &__stage {
    flex: 1;
    min-height: 0;
    @include flex(row, center, flex-start);
  }

  &--pinned &__track {
    position: relative;
    z-index: 1;
    flex-wrap: nowrap;
    align-items: center;
    gap: 3vw;
    padding-inline: 34vw 22vw;
    margin-inline: calc(50% - 50vw);
    width: 100vw;

    > * {
      flex: 0 0 clamp(22rem, 34vw, 32rem);
    }
  }

  &--pinned &__sheet {
    padding: 2.2rem 2rem 1.8rem;
  }

  // El rodillo va detrás de los pliegos; delante solo cruza un filete fino
  // de tinta (::after) que marca dónde se imprime cada hoja.
  &--pinned &__roller {
    position: absolute;
    left: 24vw;
    top: -1rem;
    bottom: -1rem;
    z-index: 0;
    width: 1.4rem;
    @include flex(column, center, space-between, 0.75rem);
    pointer-events: none;
  }

  &--pinned &__stage::after {
    content: '';
    position: absolute;
    left: calc(24vw + 0.7rem);
    top: -1rem;
    bottom: -1rem;
    z-index: 2;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba($accent, 0.9) 15%, rgba($accent, 0.9) 85%, transparent);
    pointer-events: none;
  }

  &__cyl {
    flex: 1;
    width: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #111 0%, #5d5c5a 45%, #1b1b1a 100%);
    box-shadow: 0 0 30px rgba(#000, 0.25);
  }

  &__rollerlabel {
    @include mono-label(0.6rem, 0.3em);
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    color: $accent-deep;
  }

  &--pinned &__progress {
    @include flex(row, center, flex-start, 1rem);
    margin-top: 1.75rem;
    @include mono-label(0.62rem, 0.16em);
    color: $ink-muted;
  }

  &__rail {
    flex: 1;
    height: 2px;
    background: rgba($ink, 0.12);
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    background: $accent;
    transform-origin: left;
  }
}
</style>

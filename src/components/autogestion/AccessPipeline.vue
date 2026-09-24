<script setup lang="ts">
import { ref } from 'vue'
import { site, copy } from '@/config/site'
import { fxCatalog } from '@/config/fx.catalog'
import { MQ, ScrollTrigger, useGsapMedia } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'

// Proceso de acceso como una línea de producción: un filete naranja se
// dibuja con el scroll llevando la solicitud (una hoja) de estación en
// estación, y cada paso se enciende cuando la tinta lo alcanza. Desde lg la
// sección se fija y el recorrido es horizontal; debajo, vertical sin fijar.
// El avance vive en la custom property --p (0–1); sin JS o con reduced
// motion vale 1 y todo se ve completo.
defineProps<{ index: string }>()

const a = site.autogestion
const pl = fxCatalog.autogestion.pipeline
const root = ref<HTMLElement | null>(null)

useGsapMedia(root, (mm, el) => {
  const stations = Array.from(el.querySelectorAll<HTMLElement>('.pipe__station'))
  const n = stations.length

  // Umbral de cada estación: dónde cae su nodo sobre el filete (0–1).
  let marks = stations.map((_, i) => i / Math.max(n - 1, 1))
  function measure(horizontal: boolean) {
    const rail = el.querySelector<HTMLElement>('.pipe__rail')
    if (!rail) return
    const r = rail.getBoundingClientRect()
    marks = stations.map((s) => {
      const node = s.querySelector('.pipe__node')!.getBoundingClientRect()
      const at = horizontal
        ? (node.left + node.width / 2 - r.left) / r.width
        : (node.top + node.height / 2 - r.top) / r.height
      return Math.min(1, Math.max(0, at))
    })
  }

  function paint(p: number) {
    el.style.setProperty('--p', p.toFixed(4))
    stations.forEach((s, i) => s.classList.toggle('pipe__station--on', p >= marks[i]! - 0.01))
  }

  function build(pin: boolean) {
    measure(pin)
    paint(0)
    const stage = el.querySelector<HTMLElement>('.pipe__stage')
    ScrollTrigger.create({
      trigger: pin ? stage : el.querySelector('.pipe__line'),
      start: pin ? 'top top' : 'top 70%',
      end: pin ? '+=140%' : 'bottom 55%',
      pin: pin ? stage : false,
      scrub: 0.5,
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => {
        measure(pin)
        paint(self.progress)
      },
    })
    return () => paint(1)
  }

  mm.add(`${MQ.lg} and ${MQ.motion}`, () => build(true))
  mm.add(`(max-width: 1023px) and ${MQ.motion}`, () => build(false))
})
</script>

<template>
  <section ref="root" class="pipe">
    <div class="pipe__stage">
      <HalftoneBg fade="right" />
      <div class="pipe__inner">
        <SectionHead
          tone="night"
          :index="index"
          :eyebrow="copy.autogestion.stepsEyebrow"
          :title="a.processTitle"
          :text="a.processText"
        />

        <div class="pipe__line">
          <span class="pipe__end pipe__end--start" aria-hidden="true">{{ pl.start }}</span>
          <span class="pipe__end pipe__end--stop" aria-hidden="true">{{ pl.end }}</span>
          <span class="pipe__rail" aria-hidden="true"><span class="pipe__fill"></span></span>
          <span class="pipe__sheet" aria-hidden="true"><i class="fa-solid fa-file-lines"></i></span>
          <ol class="pipe__stations">
            <li
              v-for="(step, i) in a.steps"
              :key="step.title"
              class="pipe__station pipe__station--on"
            >
              <span class="pipe__node" aria-hidden="true">{{ i + 1 }}</span>
              <p class="pipe__tag">{{ pl.step(i + 1, a.steps.length) }}</p>
              <h3 class="pipe__title">{{ step.title }}</h3>
              <p class="pipe__text">{{ step.text }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pipe {
  --p: 1;
  background: $night;
  color: $surface;

  &__stage {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding-block: $space-section;

    @include from('lg') {
      min-height: 100vh;
      @include flex(column, stretch, center);
      padding-block: calc(var(--header-h) + 2rem) 3rem;
    }
  }

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
  }

  // Móvil: filete vertical a la izquierda. Desde lg: horizontal.
  &__line {
    position: relative;
    padding: 2.25rem 0 2.25rem 3.25rem;

    @include from('lg') {
      padding: 3rem 0 0;
    }
  }

  &__end {
    position: absolute;
    left: 0;
    @include mono-label(0.58rem, 0.18em);
    color: rgba($surface, 0.5);

    &--start {
      top: 0;
    }

    &--stop {
      bottom: 0;
    }

    @include from('lg') {
      top: 0;
      bottom: auto;

      &--stop {
        left: auto;
        right: 0;
      }
    }
  }

  &__rail {
    position: absolute;
    left: 1.2rem;
    top: 1.75rem;
    bottom: 1.75rem;
    width: 2px;
    background: rgba($surface, 0.14);

    @include from('lg') {
      left: 0;
      right: 0;
      top: calc(3rem + 1.5rem);
      bottom: auto;
      width: auto;
      height: 2px;
    }
  }

  &__fill {
    position: absolute;
    inset: 0;
    background: $accent;
    transform: scaleY(var(--p));
    transform-origin: top;

    @include from('lg') {
      transform: scaleX(var(--p));
      transform-origin: left;
    }
  }

  // La solicitud viaja en la punta de la tinta.
  &__sheet {
    position: absolute;
    z-index: 2;
    left: calc(1.2rem + 1px);
    top: calc(1.75rem + (100% - 3.5rem) * var(--p));
    @include flex(row, center, center);
    width: 2.2rem;
    height: 2.2rem;
    margin: -1.1rem 0 0 -1.1rem;
    border-radius: 3px;
    background: $surface;
    color: $accent-deep;
    box-shadow: 0 10px 24px -8px rgba(#000, 0.6);
    transform: rotate(-8deg);

    @include from('lg') {
      left: calc(100% * var(--p));
      top: calc(3rem + 1.5rem + 1px);
    }
  }

  &__stations {
    list-style: none;
    @include flex(column, stretch, flex-start, 2.25rem);

    @include from('lg') {
      flex-direction: row;
      gap: 1.5rem;
    }
  }

  &__station {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.45rem);
    opacity: 0.35;
    transition: opacity 0.5s ease;

    @include from('lg') {
      flex: 1 1 0;
      min-width: 0;
      padding-top: 3.75rem;
    }

    &--on {
      opacity: 1;
    }
  }

  &__node {
    position: absolute;
    left: -3.25rem;
    top: -0.2rem;
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: $night;
    box-shadow: inset 0 0 0 2px rgba($surface, 0.3);
    font-family: $font-mono;
    font-size: 0.8rem;
    transition:
      background-color 0.4s ease,
      color 0.4s ease,
      box-shadow 0.4s ease;

    @include from('lg') {
      left: 0;
      top: 0.3rem;
    }
  }

  &__station--on &__node {
    background: $accent;
    color: $night;
    box-shadow: 0 0 0 6px rgba($accent, 0.18);
  }

  &__tag {
    @include mono-label(0.6rem, 0.16em);
    color: $accent;
  }

  &__title {
    font-size: clamp(1.6rem, 1.2rem + 1.4vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1;
  }

  &__text {
    color: rgba($surface, 0.72);
  }
}
</style>

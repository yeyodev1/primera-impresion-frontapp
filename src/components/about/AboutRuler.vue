<script setup lang="ts">
import { ref } from 'vue'
import { fxPages } from '@/config/fx.pages'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import RegMark from '@/components/fx/RegMark.vue'

// Regla de imprenta de la trayectoria: un tic por año entre `from` y `to`,
// mayores cada cinco años con su cifra en mono. Con el scroll los tics se
// levantan, la tinta naranja llena el filete y el marcador lo recorre.
const props = defineProps<{ from: number; to: number }>()

const h = fxPages.about.history
const ticks = Array.from({ length: props.to - props.from + 1 }, (_, i) => props.from + i)
// Tics mayores cada cinco años, sin pisar las etiquetas de los extremos.
const isMajor = (y: number) => y === props.from || y === props.to || (y % 5 === 0 && y - props.from > 2 && props.to - y > 2)

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const ruler = el.querySelector<HTMLElement>('.aruler__ticks')
  const scrub = { trigger: ruler, start: 'top 92%', end: 'bottom 55%', scrub: 0.5 }
  gsap.fromTo('.aruler__fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: scrub })
  gsap.fromTo(
    '.aruler__marker',
    { x: 0 },
    { x: () => ruler?.clientWidth ?? 0, ease: 'none', scrollTrigger: { ...scrub, invalidateOnRefresh: true } },
  )
  gsap.from('.aruler__tick', {
    scaleY: 0,
    transformOrigin: '50% 0%',
    duration: 0.5,
    stagger: 0.025,
    ease: 'power2.out',
    scrollTrigger: { trigger: ruler, start: 'top 95%', once: true },
  })
})
</script>

<template>
  <figure ref="root" class="aruler">
    <figcaption class="aruler__caption">
      <span><RegMark size="0.9rem" tone="accent" /> {{ h.ruler }}</span>
      <span>{{ h.rulerHint(from, to) }}</span>
    </figcaption>
    <div class="aruler__ticks" aria-hidden="true">
      <span class="aruler__fill"></span>
      <span class="aruler__marker"></span>
      <span class="aruler__scale">
        <span
          v-for="y in ticks"
          :key="y"
          class="aruler__tick"
          :class="{ 'aruler__tick--major': isMajor(y) }"
          :data-year="isMajor(y) ? y : undefined"
        ></span>
      </span>
    </div>
    <p class="aruler__ends" aria-hidden="true">
      <span>{{ h.sinceLabel }}</span>
      <span>{{ h.today }}</span>
    </p>
  </figure>
</template>

<style scoped lang="scss">
.aruler {
  &__caption,
  &__ends {
    @include flex(row, center, space-between, 1rem);
    @include mono-label(0.62rem, 0.16em);
    color: $ink-muted;

    > span {
      @include flex(row, center, flex-start, 0.5rem);
    }
  }

  &__ticks {
    position: relative;
    height: 3.6rem;
    margin-top: 0.9rem;
    border-top: 1px solid $ink;
  }

  &__scale {
    @include flex(row, flex-start, space-between);
  }

  &__fill {
    position: absolute;
    left: 0;
    right: 0;
    top: -2px;
    height: 3px;
    background: $accent;
    transform-origin: left;
  }

  &__marker {
    position: absolute;
    left: 0;
    top: -0.9rem;
    width: 0;
    height: 0;
    margin-left: -0.45rem;
    border-inline: 0.45rem solid transparent;
    border-top: 0.6rem solid $accent-deep;
  }

  &__tick {
    position: relative;
    width: 1px;
    height: 0.9rem;
    background: rgba($ink, 0.55);

    &--major {
      height: 1.6rem;
      background: $ink;
    }

    // El año de cada tic mayor, en mono, como la escala de una regla.
    &--major::after {
      content: attr(data-year);
      position: absolute;
      top: 1.9rem;
      left: 50%;
      transform: translateX(-50%);
      @include mono-label(0.58rem, 0.08em);
      color: $ink-soft;
    }

    &--major:first-of-type::after {
      left: 0;
      transform: none;
    }

    &--major:last-child::after {
      left: auto;
      right: 0;
      transform: none;
    }
  }

  &__ends {
    margin-top: 0.4rem;
  }
}
</style>

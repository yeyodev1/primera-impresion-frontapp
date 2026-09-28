<script setup lang="ts">
import { ref } from 'vue'
import { site, fx, whatsappLink } from '@/config/site'
import { gsap, MQ, useGsapContext } from '@/composables/motion/useGsap'
import HalftoneCanvas from '@/components/fx/HalftoneCanvas.vue'
import RegisterTitle from '@/components/fx/RegisterTitle.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import RegMark from '@/components/fx/RegMark.vue'
import CmykDots from '@/components/site/CmykDots.vue'
import ProofCard from '@/components/site/ProofCard.vue'
import SmartLink from '@/components/site/SmartLink.vue'

// Formulario de solicitud de acceso al portal, en Autogestión.
const accessForm = '/autogestion#solicitud'

// Portada: pliego 01. Trama viva de fondo, titular gigante que entra
// desregistrado y se alinea, rótulos técnicos de la hoja y la prueba de color
// flotando con parallax.
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
  intro
    .from('.hh__meta > *', { y: -12, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.1)
    .from('.hh__eyebrow', { y: 16, opacity: 0, duration: 0.8 }, 0.2)
    // fromTo con valores finales explícitos: .btn tiene transición CSS y un
    // .from leería la opacidad a mitad de transición.
    .fromTo(
      '.hh__actions > *',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' },
      0.95,
    )
    .from('.hh__proof', { y: 120, rotation: 9, opacity: 0, duration: 1.4 }, 0.6)
    .from('.hh__scroll', { opacity: 0, duration: 0.6 }, 1.4)

  // Parallax: la prueba sube y gira un poco más rápido que la página.
  gsap.to('.hh__float', {
    yPercent: -22,
    rotation: 4,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 },
  })
  // El texto se retira al salir, solo en escritorio: en móvil el hero es
  // más alto que la pantalla y aún se está leyendo.
  if (window.matchMedia(MQ.lg).matches) {
    gsap.to('.hh__inner', {
      yPercent: 8,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'center center', end: 'bottom top', scrub: true },
    })
  }
})
</script>

<template>
  <section ref="root" class="hh">
    <HalftoneCanvas focus="br" />
    <span class="hh__guides" aria-hidden="true"></span>
    <div class="hh__inner">
      <div class="hh__meta" aria-hidden="true">
        <span><RegMark size="0.85rem" tone="accent" /> {{ fx.hero.sheet }}</span>
        <span class="hh__coords">{{ fx.coords }}</span>
        <span>{{ fx.since }}</span>
      </div>

      <p class="hh__eyebrow"><CmykDots /> {{ site.home.eyebrow }}</p>
      <RegisterTitle
        as="h1"
        size="hero"
        tone="night"
        class="hh__title"
        :text="site.home.title"
        :accent="fx.hero.accent"
        trigger="load"
        :delay="0.15"
        drift
      />

      <div class="hh__row">
        <div class="hh__copy">
          <SplitReveal :text="site.home.lead" by="lines" trigger="load" :delay="0.7" class="hh__lead" />
          <div class="hh__actions">
            <MagneticButton>
              <SmartLink :to="accessForm" class="btn btn--primary btn--press">
                {{ site.home.ctas.platform }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </SmartLink>
            </MagneticButton>
            <SmartLink :to="whatsappLink()" class="btn btn--light btn--press hh__alt">{{ site.home.ctas.advisor }}</SmartLink>
            <RouterLink to="/soluciones" class="hh__link">
              {{ site.home.ctas.explore }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
          </div>
        </div>

        <div class="hh__proof">
          <div class="hh__float">
            <ProofCard :pill="site.home.heroCard.pill" :title="site.home.heroCard.title" :items="site.home.heroCard.items" />
          </div>
        </div>
      </div>
    </div>

    <a href="#modos" class="hh__scroll">
      <span class="hh__scrollline" aria-hidden="true"></span>
      {{ fx.hero.scroll }}
    </a>
  </section>
</template>

<style scoped lang="scss">
.hh {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: $night;
  color: $surface;

  // Guías de maquetación: columnas finas como en una hoja de montaje.
  &__guides {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: linear-gradient(90deg, rgba($surface, 0.05) 1px, transparent 1px);
    background-size: calc(100% / 6) 100%;
  }

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
    @include flex(column, stretch, flex-start, 1.25rem);
    padding-top: calc(var(--header-h) + 1.5rem);
    padding-bottom: 5.5rem;

    @include from('lg') {
      min-height: 100svh;
      justify-content: center;
      padding-bottom: 6rem;
    }
  }

  &__meta {
    @include flex(row, center, space-between, 1rem);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba($surface, 0.12);
    @include mono-label(0.62rem, 0.18em);
    color: rgba($surface, 0.6);

    > span {
      @include flex(row, center, flex-start, 0.5rem);
    }
  }

  &__coords {
    display: none !important;

    @include from('md') {
      display: flex !important;
    }
  }

  &__eyebrow {
    @include mono-label(0.68rem, 0.2em);
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    color: $accent;
  }

  &__title {
    max-width: 13ch;
  }

  &__row {
    @include flex(column, stretch, flex-start, 3rem);
    margin-top: 1rem;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.75rem);
    max-width: 38rem;
  }

  &__lead {
    font-size: $text-lg;
    line-height: 1.55;
    color: rgba($surface, 0.78);
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.9rem);
    width: 100%;

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: auto;
    }
  }

  &__alt {
    --btn-fill: #{$accent};
  }

  &__link {
    @include flex(row, center, flex-start, 0.5rem);
    padding-block: 0.4rem;
    font-weight: 600;
    color: $surface;
    background: linear-gradient($accent, $accent) no-repeat 0 100% / 100% 1px;
    transition: background-size 0.45s $ease;
    @include focus-ring;

    &:hover {
      background-size: 0% 1px;
      background-position: 100% 100%;
    }
  }

  &__proof {
    align-self: center;
    width: 100%;
    max-width: 27rem;

    @include from('lg') {
      flex: 0 0 25rem;
      margin-top: -16rem;
      margin-right: 2rem;
    }

    @include from('xl') {
      flex-basis: 27rem;
      margin-top: -20rem;
    }
  }

  &__scroll {
    position: absolute;
    left: 50%;
    bottom: 1.25rem;
    z-index: 1;
    @include flex(column, center, flex-start, 0.6rem);
    transform: translateX(-50%);
    @include mono-label(0.6rem, 0.3em);
    color: rgba($surface, 0.6);
    @include focus-ring;
  }

  &__scrollline {
    position: relative;
    width: 1px;
    height: 2.6rem;
    overflow: hidden;
    background: rgba($surface, 0.15);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: $accent;
      animation: hh-scroll 2.2s $ease-press infinite;
    }
  }
}

@keyframes hh-scroll {
  0% {
    transform: translateY(-100%);
  }
  60%,
  100% {
    transform: translateY(100%);
  }
}
</style>

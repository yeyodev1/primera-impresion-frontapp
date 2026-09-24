<script setup lang="ts">
import { site, copy, fx, fxPages } from '@/config/site'
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import CropMarks from './CropMarks.vue'
import RegMark from '@/components/fx/RegMark.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'

// "Visítanos en Guayaquil": dirección real y mapa embebido (carga diferida)
// tratado como una prueba de imprenta: en escala de grises y con tinta
// naranja multiplicada, marco con marcas de corte, pin propio y coordenadas
// en mono. `index` (opcional) numera la sección.
defineProps<{ index?: string }>()

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced }) => {
  if (reduced) return
  gsap.fromTo(
    '.visit__frame',
    { clipPath: 'inset(10% 10% 10% 10%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.3,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.visit__frame', start: 'top 85%', once: true },
    },
  )
  gsap.from('.visit__pin i', {
    y: -60,
    opacity: 0,
    duration: 0.9,
    delay: 0.5,
    ease: 'bounce.out',
    scrollTrigger: { trigger: '.visit__frame', start: 'top 85%', once: true },
  })
})
</script>

<template>
  <aside ref="root" class="visit">
    <div class="visit__copy">
      <p class="visit__eyebrow">
        <span v-if="index" class="visit__index">{{ index }}</span>
        {{ fxPages.contact.visitEyebrow }}
      </p>
      <SplitReveal as="h2" :text="site.contact.visitTitle" class="visit__title" />
      <p class="visit__text">{{ site.contact.visitText }}</p>
      <address class="visit__address">
        <span class="visit__street">{{ site.address }}</span>
        <span class="visit__city">{{ site.city }}</span>
      </address>
      <p class="visit__coords" aria-hidden="true">
        <RegMark size="0.9rem" tone="accent" />
        {{ fx.coords }}
      </p>
      <a :href="site.mapsUrl" target="_blank" rel="noopener" class="btn btn--ink btn--press visit__cta">
        {{ copy.contact.mapCta }}
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        <span class="visually-hidden">{{ copy.header.newTab }}</span>
      </a>
    </div>

    <div class="visit__map">
      <CropMarks inset="0" />
      <p class="visit__spec" aria-hidden="true">
        <span>{{ fxPages.contact.mapSpec }}</span>
        <span>{{ fx.inks }}</span>
      </p>
      <div class="visit__frame">
        <iframe
          :src="mapSrc"
          :title="copy.contact.mapTitle"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
        <span class="visit__tint" aria-hidden="true"></span>
        <span class="visit__pin" aria-hidden="true">
          <span class="visit__pulse"></span>
          <i class="fa-solid fa-location-dot"></i>
          <span class="visit__pinlabel">{{ fxPages.contact.visitPin }}</span>
        </span>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.visit {
  @include flex(column, stretch, flex-start, 3rem);

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.1rem);

    @include from('lg') {
      flex: 1 1 40%;
    }
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.85rem);
    @include mono-label(0.7rem, 0.18em);
    color: darken($accent-deep, 4%);
  }

  &__index {
    padding: 0.2rem 0.45rem;
    border: 1px solid currentColor;
    border-radius: 2px;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.2rem, 1.3rem + 3.6vw, 4.6rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.04em;
    text-wrap: balance;
  }

  &__text {
    max-width: 40ch;
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__address {
    @include flex(column, flex-start, flex-start, 0.2rem);
    width: 100%;
    padding-block: 1rem;
    border-block: 1px solid rgba($ink, 0.18);
    font-style: normal;
  }

  &__street {
    font-family: $font-display;
    font-size: clamp(1.3rem, 1.1rem + 0.8vw, 1.7rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  &__city {
    @include mono-label(0.66rem, 0.16em);
    color: $ink-muted;
  }

  &__coords {
    @include flex(row, center, flex-start, 0.55rem);
    @include mono-label(0.64rem, 0.16em);
    color: $ink-muted;
  }

  &__cta {
    margin-top: 0.5rem;
  }

  &__map {
    position: relative;
    padding: 1.1rem;

    @include from('lg') {
      flex: 1 1 60%;
    }
  }

  &__spec {
    @include flex(row, center, space-between, 1rem);
    margin-bottom: 0.7rem;
    @include mono-label(0.58rem, 0.16em);
    color: $ink-muted;
  }

  &__frame {
    position: relative;
    overflow: hidden;
    border-radius: 3px;
    background: $line;
    box-shadow: 0 40px 70px -40px rgba($ink, 0.5);

    iframe {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      border: 0;
      filter: grayscale(1) contrast(1.15) brightness(1.02);
      transition: filter 0.6s $ease;

      @include from('md') {
        aspect-ratio: 16 / 11;
      }
    }

    &:hover iframe {
      filter: grayscale(0.3) contrast(1.05);
    }
  }

  // Tinta naranja multiplicada sobre el mapa gris: parece impreso a una tinta.
  &__tint {
    position: absolute;
    inset: 0;
    background: $accent;
    mix-blend-mode: multiply;
    opacity: 0.16;
    pointer-events: none;
    transition: opacity 0.6s $ease;
  }

  &__frame:hover &__tint {
    opacity: 0;
  }

  &__pin {
    position: absolute;
    left: 50%;
    top: 50%;
    @include flex(column, center, flex-end, 0.3rem);
    // La punta del icono cae justo en el centro del mapa.
    transform: translate(-50%, -100%);
    pointer-events: none;

    i {
      position: relative;
      font-size: 2.6rem;
      color: $accent;
      filter: drop-shadow(0 6px 6px rgba(#000, 0.35));
    }
  }

  &__pinlabel {
    order: -1;
    padding: 0.3rem 0.55rem;
    background: $night;
    color: $surface;
    border-radius: 2px;
    @include mono-label(0.56rem, 0.14em);
    white-space: nowrap;
  }

  &__pulse {
    position: absolute;
    left: 50%;
    bottom: -0.5rem;
    width: 2.2rem;
    height: 2.2rem;
    margin-left: -1.1rem;
    border-radius: 50%;
    border: 2px solid $accent;
    animation: visit-pulse 2.2s $ease infinite;
  }

  @include reduced-motion {
    &__pulse {
      animation: none;
      opacity: 0.5;
    }
  }
}

@keyframes visit-pulse {
  from {
    transform: scale(0.3);
    opacity: 1;
  }
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}
</style>

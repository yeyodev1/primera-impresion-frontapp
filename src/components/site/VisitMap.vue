<script setup lang="ts">
import { site, copy, fx, fxPages } from '@/config/site'
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

// Mapa embebido (carga diferida) de la dirección confirmada, tratado como una
// prueba de imprenta: en escala de grises con tinta naranja multiplicada, pin
// propio con pulso y rótulo técnico. Solo se usa si site.address está lleno.
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced }) => {
  if (reduced) return
  gsap.fromTo(
    '.vmap__frame',
    { clipPath: 'inset(10% 10% 10% 10%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.3,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.vmap__frame', start: 'top 85%', once: true },
    },
  )
  gsap.from('.vmap__pin i', {
    y: -60,
    opacity: 0,
    duration: 0.9,
    delay: 0.5,
    ease: 'bounce.out',
    scrollTrigger: { trigger: '.vmap__frame', start: 'top 85%', once: true },
  })
})
</script>

<template>
  <div ref="root" class="vmap">
    <p class="vmap__spec" aria-hidden="true">
      <span>{{ fxPages.contact.mapSpec }}</span>
      <span>{{ fx.inks }}</span>
    </p>
    <div class="vmap__frame">
      <iframe
        :src="mapSrc"
        :title="copy.contact.mapTitle"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
      <span class="vmap__tint" aria-hidden="true"></span>
      <span class="vmap__pin" aria-hidden="true">
        <span class="vmap__pulse"></span>
        <i class="fa-solid fa-location-dot"></i>
        <span class="vmap__pinlabel">{{ fxPages.contact.visitPin }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Clase propia (no «visit»): la raíz hereda el scope de VisitCard, que ya usa .visit.
.vmap {
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
      aspect-ratio: 1 / 1;
      min-height: 22rem;
      border: 0;
      filter: grayscale(1) contrast(1.15) brightness(1.02);
      transition: filter 0.6s $ease;

      @include from('md') {
        aspect-ratio: 4 / 3;
        min-height: 26rem;
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

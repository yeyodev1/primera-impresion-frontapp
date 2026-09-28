<script setup lang="ts">
import { ref } from 'vue'
import { site, fxPages } from '@/config/site'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import GoogleRating from '@/components/site/GoogleRating.vue'
import CropMarks from '@/components/site/CropMarks.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import trophy from '@/assets/about/lo-mejor-del-impreso-2026.jpg'
import plaque from '@/assets/about/reconocimiento-cigg-2026.jpg'

// Reconocimientos como dos láminas de prueba: cada foto real va montada en su
// paspartú con marcas de corte y tira de color, y debajo el pie con el premio.
// Cierra la calificación de Google Maps, que da confianza al visitante.
defineProps<{ index: string }>()

const ab = site.about
const r = fxPages.about.awards
const photos: Record<string, string> = { trophy, plaque }
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  el.querySelectorAll<HTMLElement>('.frame').forEach((frame, i) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 95%', once: true } })
    tl.from(frame.querySelector('.frame__print'), {
      y: 70,
      rotation: i % 2 ? 3 : -3,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'expo.out',
      clearProps: 'transform,opacity,visibility',
    })
    tl.from(frame.querySelector('.frame__caption'), { y: 20, autoAlpha: 0, duration: 0.6, ease: 'expo.out' }, 0.15)
  })
  gsap.from(el.querySelector('.awards__rating'), {
    y: 40,
    autoAlpha: 0,
    duration: 0.8,
    ease: 'expo.out',
    scrollTrigger: { trigger: el.querySelector('.awards__rating'), start: 'top 98%', once: true },
  })
})
</script>

<template>
  <section ref="root" class="awards">
    <div class="awards__inner">
      <SectionHead :index="index" :eyebrow="ab.awardsEyebrow" :title="ab.awardsTitle" />

      <ul class="awards__frames">
        <li v-for="(award, i) in ab.awards" :key="award.title" class="frame">
          <figure class="frame__print">
            <CropMarks inset="0.3rem" />
            <p class="frame__label" aria-hidden="true">
              <span>{{ r.plate(i + 1) }}</span>
              <span>{{ r.place }}</span>
            </p>
            <div class="frame__photo">
              <img :src="photos[award.photo]" :alt="award.photoAlt" width="640" height="800" loading="lazy" />
            </div>
            <ColorBar compact class="frame__bar" />
          </figure>

          <div class="frame__caption">
            <i :class="award.icon" class="frame__icon" aria-hidden="true"></i>
            <div>
              <h3 class="frame__title">{{ award.title }}</h3>
              <p class="frame__text">{{ award.text }}</p>
              <p class="frame__meta">{{ award.meta }}</p>
            </div>
          </div>
        </li>
      </ul>

      <GoogleRating class="awards__rating" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.awards {
  padding-block: $space-section;
  background: $sand;

  &__inner {
    @include container(1120px);
  }

  &__frames {
    list-style: none;
    @include flex-cards(300px, 3rem 2.5rem);
  }

  &__rating {
    margin-top: 3.5rem;
  }
}

// Lámina: foto montada en paspartú blanco, como una prueba sobre la mesa.
.frame {
  @include flex(column, stretch, flex-start, 1.5rem);

  &__print {
    position: relative;
    margin: 0;
    padding: 0.9rem 1rem 1rem;
    border-radius: 3px;
    background: $surface;
    box-shadow:
      0 1px 2px rgba(#000, 0.06),
      0 30px 60px -30px rgba(#000, 0.4);
    transition:
      transform 0.6s $ease,
      box-shadow 0.6s $ease;
  }

  @include fine-pointer {
    &:hover &__print {
      transform: translateY(-6px) rotate(-0.8deg);
      box-shadow:
        0 1px 2px rgba(#000, 0.06),
        0 44px 70px -30px rgba(#000, 0.45);
    }

    &:nth-child(even):hover &__print {
      transform: translateY(-6px) rotate(0.8deg);
    }

    &:hover &__photo img {
      transform: scale(1.04);
    }
  }

  &__label {
    @include flex(row, center, space-between, 1rem);
    padding: 0.15rem 0.2rem 0.75rem;
    @include mono-label(0.6rem, 0.18em);
    color: $ink-muted;
  }

  &__photo {
    overflow: hidden;
    border-radius: 2px;
    background: $sand;

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      object-position: 50% 45%;
      transition: transform 0.8s $ease;
    }
  }

  &__bar {
    margin-top: 0.85rem;
  }

  &__caption {
    @include flex(row, flex-start, flex-start, 1rem);
    padding-inline: 0.25rem;
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 0.2rem;
    font-size: 1.5rem;
    color: $accent-deep;
  }

  &__title {
    font-size: clamp(1.2rem, 1rem + 0.6vw, 1.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
  }

  &__text {
    color: $ink-soft;
    line-height: 1.6;
  }

  &__meta {
    margin-top: 0.6rem;
    @include mono-label(0.62rem, 0.14em);
    color: darken($accent-deep, 4%);
  }
}
</style>

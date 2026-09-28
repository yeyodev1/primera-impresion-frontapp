<script setup lang="ts">
import { ref } from 'vue'
import { site, fxPages, contactForm } from '@/config/site'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import SmartLink from '@/components/site/SmartLink.vue'
import trophy from '@/assets/about/lo-mejor-del-impreso-2026.jpg'
import plaque from '@/assets/about/reconocimiento-cigg-2026.jpg'

// Reconocimientos: la foto real del trofeo, los premios del último congreso
// gráfico y la calificación de Google Maps, que dan confianza al visitante.
defineProps<{ index: string }>()

const ab = site.about
const r = fxPages.about.awards
const photos: Record<string, string> = { plaque }
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  gsap.from(el.querySelectorAll('.awards__photo, .award, .awards__rating'), {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 75%', once: true },
  })
})
</script>

<template>
  <section ref="root" class="awards">
    <div class="awards__inner">
      <SectionHead :index="index" :eyebrow="ab.awardsEyebrow" :title="ab.awardsTitle" />

      <div class="awards__row">
        <figure class="awards__photo">
          <img :src="trophy" :alt="ab.awardPhotoAlt" width="800" height="1422" loading="lazy" />
        </figure>

        <div class="awards__list">
          <article v-for="award in ab.awards" :key="award.title" class="award">
            <i :class="award.icon" class="award__icon" aria-hidden="true"></i>
            <div>
              <h3 class="award__title">{{ award.title }}</h3>
              <p class="award__text">{{ award.text }}</p>
              <p class="award__meta">{{ award.meta }}</p>
              <img
                v-if="'photo' in award && photos[award.photo]"
                :src="photos[award.photo]"
                :alt="award.photoAlt"
                class="award__photo"
                width="480"
                height="228"
                loading="lazy"
              />
            </div>
          </article>

          <SmartLink
            v-if="site.googleRating"
            :to="site.mapsUrl || contactForm"
            class="awards__rating"
            :aria-label="r.ratingLabel(site.googleRating)"
          >
            <span class="awards__score" aria-hidden="true">{{ r.rating(site.googleRating) }}</span>
            <span class="awards__rating-copy" aria-hidden="true">
              <span class="awards__stars"><i v-for="n in 5" :key="n" class="fa-solid fa-star"></i></span>
              <strong>{{ ab.ratingTitle }}</strong>
              <span>{{ ab.ratingText }}</span>
            </span>
            <span class="awards__cta" aria-hidden="true">
              {{ ab.ratingCta }} <i class="fa-solid fa-arrow-right"></i>
            </span>
          </SmartLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.awards {
  padding-block: $space-section;
  background: $sand;

  &__inner {
    @include container(1320px);
  }

  &__row {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: clamp(2.5rem, 5vw, 5rem);
    }
  }

  &__photo {
    margin: 0;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 40px 70px -35px rgba(#000, 0.45);
    max-width: 26rem;
    align-self: center;

    @include from('lg') {
      flex: 0 0 34%;
    }

    img {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      object-position: 50% 45%;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex: 1 1 auto;
      min-width: 0;
    }
  }

  &__rating {
    @include flex(row, center, flex-start, 1rem 1.5rem);
    flex-wrap: wrap;
    padding: 1.5rem 1.6rem;
    border-radius: 4px;
    background: $night;
    color: $surface;
    @include transition(transform, box-shadow);
    @include focus-ring;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 24px 40px -24px rgba(#000, 0.6);
    }
  }

  &__score {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.4rem, 1.8rem + 2vw, 3.4rem);
    line-height: 1;
    color: $accent;
  }

  &__rating-copy {
    @include flex(column, flex-start, flex-start, 0.2rem);
    flex: 1 1 12rem;
    font-size: $text-sm;
    color: rgba($surface, 0.75);

    strong {
      font-size: 1.05rem;
      color: $surface;
    }
  }

  &__stars {
    @include flex(row, center, flex-start, 0.15rem);
    color: $accent;
    font-size: 0.85rem;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 700;
    font-size: $text-sm;
  }
}

.award {
  @include flex(row, flex-start, flex-start, 1.1rem);
  padding: 1.5rem 1.6rem;
  border-radius: 4px;
  background: $surface;
  box-shadow: inset 0 0 0 1px $line;

  &__icon {
    flex-shrink: 0;
    font-size: 1.6rem;
    color: $accent-deep;
    margin-top: 0.15rem;
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

  &__photo {
    display: block;
    width: 100%;
    max-width: 22rem;
    height: auto;
    margin-top: 1rem;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px $line;
  }

  &__meta {
    margin-top: 0.6rem;
    @include mono-label(0.62rem, 0.14em);
    color: darken($accent-deep, 4%);
  }
}
</style>

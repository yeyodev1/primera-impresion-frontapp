<script setup lang="ts">
import { site, fxPages, contactForm } from '@/config/site'
import SmartLink from '@/components/site/SmartLink.vue'
import { ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import ColorBar from '@/components/fx/ColorBar.vue'

// Trayectoria: el "+20" gigante (más de 20 años, como dice el prototipo) en
// contorno se entinta con el scroll como si pasara el rodillo. Sin fechas: el
// prototipo no da un año de fundación.
defineProps<{ index: string }>()

const h = fxPages.about.history

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const year = el.querySelector('.ahist__fig')
  gsap.fromTo(
    '.ahist__ink',
    { clipPath: 'inset(0% 100% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: { trigger: year, start: 'top 85%', end: 'bottom 35%', scrub: 0.6 },
    },
  )
  gsap.fromTo(
    '.ahist__roller',
    { x: 0, opacity: 0.85 },
    {
      x: () => (year as HTMLElement | null)?.offsetWidth ?? 0,
      opacity: 0,
      ease: 'power1.in',
      scrollTrigger: { trigger: year, start: 'top 85%', end: 'bottom 35%', scrub: 0.6, invalidateOnRefresh: true },
    },
  )

  gsap.from('.ahist__fact', {
    y: 24,
    opacity: 0,
    stagger: 0.08,
    scrollTrigger: { trigger: '.ahist__facts', start: 'top 88%', once: true },
  })
})
</script>

<template>
  <section ref="root" class="ahist">
    <div class="ahist__inner">
      <div class="ahist__row">
        <div class="ahist__copy">
          <SectionHead :index="index" :eyebrow="site.about.historyEyebrow" :title="site.about.historyTitle" :text="site.about.historyText" />
          <dl class="ahist__facts">
            <div v-for="fact in h.facts" :key="fact.label" class="ahist__fact">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value }}</dd>
            </div>
          </dl>
        </div>

        <div class="ahist__stamp">
          <p class="ahist__year" aria-hidden="true">
            <span class="ahist__plus">{{ h.stampPrefix }}</span>
            <span class="ahist__fig">
              <span class="ahist__outline">{{ h.stamp }}</span>
              <span class="ahist__ink">{{ h.stamp }}</span>
              <span class="ahist__roller"></span>
            </span>
          </p>
          <p class="ahist__count">
            <span class="ahist__label">{{ h.stampLabel }}</span>
          </p>
          <SmartLink
            v-if="site.googleRating"
            :to="site.mapsUrl || contactForm"
            class="ahist__rating"
            :aria-label="h.ratingLabel(site.googleRating)"
          >
            <span class="ahist__stars" aria-hidden="true">
              <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
            </span>
            <span aria-hidden="true">{{ h.rating(site.googleRating) }}</span>
          </SmartLink>
        </div>
      </div>

      <ColorBar class="ahist__bar" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.ahist {
  &__rating {
    @include flex(row, center, flex-start, 0.6rem);
    margin-top: 1.25rem;
    padding: 0.55rem 1rem;
    border: 1px solid $line;
    border-radius: 999px;
    background: $surface;
    font-weight: 700;
    font-size: $text-sm;
    color: $ink;
    @include transition(border-color, transform);
    @include focus-ring;

    &:hover {
      border-color: $accent;
    }
  }

  &__stars {
    @include flex(row, center, flex-start, 0.15rem);
    color: $accent;
    font-size: 0.85rem;
  }

  padding-block: $space-section;
  background: $paper;
  overflow: hidden;

  &__inner {
    @include container(1320px);
  }

  &__row {
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 3rem;
    }
  }

  &__copy {
    @include from('lg') {
      flex: 1 1 46%;
    }
  }

  &__facts {
    border-top: 1px solid rgba($ink, 0.14);
  }

  &__fact {
    @include flex(row, baseline, space-between, 1rem);
    flex-wrap: wrap;
    padding-block: 0.95rem;
    border-bottom: 1px solid rgba($ink, 0.14);

    dt {
      @include mono-label(0.64rem, 0.18em);
      color: $ink-muted;
    }

    dd {
      font-weight: 600;
      color: $ink;
    }
  }

  &__stamp {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.5rem);

    @include from('lg') {
      flex: 1 1 54%;
      align-items: flex-end;
    }
  }

  &__year {
    position: relative;
    @include flex(row, flex-start, flex-start, 0.04em);
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(9rem, 1rem + 36vw, 22rem);
    line-height: 0.8;
    letter-spacing: -0.07em;
    margin-top: 0.08em;
  }

  // El «+» va aparte, más chico y ya entintado: la cifra es la que se imprime.
  &__plus {
    font-size: 0.45em;
    line-height: 1;
    margin-top: 0.1em;
    color: $accent-deep;
  }

  &__fig {
    position: relative;
  }

  &__outline {
    display: block;
    @include outline-text($accent-deep, 2px);
  }

  // La tinta: misma cifra rellena, recortada por el rodillo al hacer scroll.
  &__ink {
    position: absolute;
    inset: 0;
    color: $accent;
    text-shadow:
      -0.012em 0 0 rgba($cmyk-c, 0.35),
      0.012em 0.006em 0 rgba($cmyk-m, 0.3);
  }

  &__roller {
    position: absolute;
    top: -2%;
    bottom: -6%;
    left: 0;
    width: 3px;
    margin-left: -1.5px;
    background: $night;
    opacity: 0;
    pointer-events: none;
  }

  &__count {
    margin-top: 0.6rem;
  }

  &__label {
    @include mono-label(0.68rem, 0.16em);
    color: $ink-soft;
  }

  &__bar {
    margin-top: $space-xl;
  }
}
</style>

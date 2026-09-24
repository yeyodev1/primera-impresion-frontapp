<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { fxPages } from '@/config/fx.pages'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import CountUp from '@/components/fx/CountUp.vue'
import AboutRuler from './AboutRuler.vue'

// Trayectoria: el "2006" gigante en contorno se entinta con el scroll como si
// pasara el rodillo, y debajo una regla de imprenta con un tic por año desde
// 2006 hasta hoy (AboutRuler) que el marcador recorre. Solo datos verdaderos.
defineProps<{ index: string }>()

const h = fxPages.about.history
const now = new Date().getFullYear()
const years = now - site.since

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const year = el.querySelector('.ahist__year')
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
            <span class="ahist__outline">{{ site.since }}</span>
            <span class="ahist__ink">{{ site.since }}</span>
            <span class="ahist__roller"></span>
          </p>
          <p class="ahist__count">
            <CountUp :to="years" :prefix="h.yearsPrefix" class="ahist__num" />
            <span class="ahist__label">{{ h.yearsLabel }}</span>
          </p>
        </div>
      </div>

      <AboutRuler :from="site.since" :to="now" class="ahist__ruler" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.ahist {
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
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(7rem, 1rem + 27vw, 21rem);
    line-height: 0.8;
    letter-spacing: -0.07em;
    margin-top: 0.08em;
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
    @include flex(row, baseline, flex-start, 0.9rem);
    margin-top: -0.2rem;
  }

  &__num {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(3rem, 2rem + 4vw, 5.5rem);
    line-height: 0.9;
    letter-spacing: -0.05em;
    color: $ink;
  }

  &__label {
    max-width: 14ch;
    font-weight: 600;
    line-height: 1.25;
    color: $ink-soft;
  }

  &__ruler {
    margin-top: $space-xl;
  }
}
</style>

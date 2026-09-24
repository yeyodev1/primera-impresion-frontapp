<script setup lang="ts">
import { ref } from 'vue'
import { site, copy } from '@/config/site'
import { fxPages } from '@/config/fx.pages'
import { gsap, MQ, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import ImageSlot from '@/components/site/ImageSlot.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'
import TiltCard from '@/components/fx/TiltCard.vue'
import MarqueeBand from '@/components/fx/MarqueeBand.vue'

// Capacidad de producción: sala oscura con los cuatro procesos como láminas
// barnizadas (tilt + foco), cada una con su espacio de foto en semitono. En
// escritorio las láminas van desfasadas y suben a distinto ritmo.
defineProps<{ index: string }>()

const items = site.about.capacity
const names = items.map((i) => i.title)
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced }) => {
  if (reduced) return
  gsap.from('.acap__card', {
    y: 80,
    opacity: 0,
    rotation: (i: number) => (i % 2 ? 3 : -3),
    duration: 1.1,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.acap__cards', start: 'top 82%', once: true },
  })
  if (window.matchMedia(MQ.lg).matches) {
    gsap.utils.toArray<HTMLElement>('.acap__card').forEach((card, i) => {
      gsap.to(card, {
        yPercent: i % 2 ? -10 : 4,
        ease: 'none',
        scrollTrigger: { trigger: '.acap__cards', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      })
    })
  }
})
</script>

<template>
  <section ref="root" class="acap">
    <HalftoneBg fade="left" />
    <div class="acap__inner">
      <SectionHead
        :index="index"
        tone="night"
        :eyebrow="fxPages.about.capacity.eyebrow"
        :title="site.about.capacityTitle"
        :text="site.about.capacityText"
      />
      <ul class="acap__cards">
        <TiltCard v-for="(item, i) in items" :key="item.title" as="li" tone="night" class="acap__card">
          <ImageSlot :icon="item.icon" ratio="4 / 5" tone="night" :label="copy.imagePending" />
          <div class="acap__body">
            <p class="acap__spec">{{ fxPages.about.capacity.process(i + 1, items.length) }}</p>
            <h3 class="acap__title">
              <i :class="item.icon" aria-hidden="true"></i>
              {{ item.title }}
            </h3>
          </div>
        </TiltCard>
      </ul>
    </div>
    <div class="acap__band">
      <MarqueeBand :items="names" tone="night" outline size="md" :speed="40" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.acap {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-top: $space-section;
  background: $night;
  color: $surface;

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
  }

  &__cards {
    list-style: none;
    @include flex-cards(150px, 0.75rem 1rem);

    @include from('lg') {
      flex-wrap: nowrap;
      align-items: flex-start;
      padding-bottom: 3rem;

      > :nth-child(even) {
        margin-top: 4rem;
      }
    }
  }

  &__card {
    @include flex(column, stretch, flex-start, 0);
    padding: 0.6rem;
    border-radius: 4px;
    background: rgba($surface, 0.04);
    box-shadow: inset 0 0 0 1px rgba($surface, 0.1);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.45rem);
    padding: 0.9rem 0.35rem 0.5rem;

    @include from('md') {
      padding: 1.1rem 0.6rem 0.8rem;
    }
  }

  &__spec {
    @include mono-label(0.6rem, 0.18em);
    color: rgba($surface, 0.6);
  }

  &__title {
    @include flex(row, center, flex-start, 0.5rem 0.6rem);
    flex-wrap: wrap;
    font-size: clamp(1.15rem, 0.95rem + 1vw, 1.9rem);
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.025em;

    i {
      font-size: 0.8em;
      color: $accent;
    }
  }

  &__band {
    position: relative;
    z-index: 1;
    margin-top: $space-xl;
    padding-block: 1.25rem;
    border-top: 1px solid rgba($surface, 0.1);
    --marquee-stroke: #{rgba($surface, 0.35)};
  }
}
</style>

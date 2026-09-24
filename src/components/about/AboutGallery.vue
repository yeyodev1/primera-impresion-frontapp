<script setup lang="ts">
import { ref } from 'vue'
import { site, copy, fx } from '@/config/site'
import { fxPages } from '@/config/fx.pages'
import { gsap, MQ, useGsapMedia } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import ImageSlot from '@/components/site/ImageSlot.vue'
import RegMark from '@/components/fx/RegMark.vue'

// Algunos trabajos: tres pliegos que salen apilados del centro y se abren en
// abanico con el scroll (lg+), cada uno con su propio ritmo de parallax. En
// pantallas chicas es un carrusel con scroll-snap que se desliza con el dedo.
defineProps<{ index: string }>()

const sheets = [
  { icon: 'fa-solid fa-tags', label: fxPages.about.gallery.sheets[0] },
  { icon: 'fa-solid fa-box-open', label: fxPages.about.gallery.sheets[1] },
  { icon: 'fa-solid fa-sign-hanging', label: fxPages.about.gallery.sheets[2] },
]
const FAN = [-7, 0, 7]

const root = ref<HTMLElement | null>(null)

useGsapMedia(root, (mm, el) => {
  const cards = gsap.utils.toArray<HTMLElement>('.agal__sheet', el)
  const stage = el.querySelector('.agal__stage')

  mm.add(`${MQ.lg} and ${MQ.motion}`, () => {
    // Cuánto tiene que viajar cada pliego para quedar encima del central.
    const toCenter = (i: number) => {
      const mid = cards[1]
      const card = cards[i]
      if (!mid || !card) return 0
      return mid.offsetLeft - card.offsetLeft
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: stage, start: 'top 85%', end: 'center 45%', scrub: 0.8, invalidateOnRefresh: true },
    })
    cards.forEach((card, i) => {
      tl.fromTo(
        card,
        { x: () => toCenter(i), rotation: (i - 1) * 2, y: 60 },
        { x: 0, rotation: FAN[i], y: i === 1 ? -40 : 0, ease: 'power2.out' },
        0,
      )
    })
    cards.forEach((card, i) => {
      gsap.to(card.querySelector('.agal__paper'), {
        yPercent: [-6, -14, -4][i],
        ease: 'none',
        scrollTrigger: { trigger: stage, start: 'center center', end: 'bottom top', scrub: 0.6 },
      })
    })
  })

  mm.add(`(max-width: 1023px) and ${MQ.motion}`, () => {
    gsap.from(cards, {
      x: 60,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      scrollTrigger: { trigger: stage, start: 'top 85%', once: true },
    })
  })
})
</script>

<template>
  <section ref="root" class="agal">
    <div class="agal__inner">
      <SectionHead :index="index" :eyebrow="fxPages.about.gallery.eyebrow" :title="site.about.galleryTitle" :text="site.about.galleryText" />
    </div>
    <ul class="agal__stage">
      <li v-for="(sheet, i) in sheets" :key="sheet.label" class="agal__sheet" :style="{ '--fan': `${FAN[i]}deg` }">
        <div class="agal__paper">
          <ImageSlot :icon="sheet.icon" ratio="4 / 5" :label="copy.imagePending" />
          <p class="agal__caption">
            <span>{{ sheet.label }}</span>
            <RegMark size="0.9rem" tone="ink" />
          </p>
        </div>
      </li>
    </ul>
    <p class="agal__foot" aria-hidden="true">
      <span>{{ fx.inks }}</span>
      <span>{{ fx.city }}</span>
    </p>
  </section>
</template>

<style scoped lang="scss">
.agal {
  padding-block: $space-section;
  background: $paper;
  overflow: hidden;

  &__inner {
    @include container(1320px);
  }

  // Móvil: carrusel horizontal con snap; la primera hoja alineada al contenedor.
  &__stage {
    list-style: none;
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding: 1rem 1.25rem 2.5rem;

    @include from('md') {
      padding-inline: 2rem;
    }

    @include from('lg') {
      @include container(1180px);
      justify-content: center;
      gap: clamp(1.5rem, 3vw, 3rem);
      overflow: visible;
      padding-block: 5rem 3rem;
    }
  }

  &__sheet {
    flex: 0 0 min(78vw, 20rem);
    scroll-snap-align: center;

    @include from('lg') {
      flex: 0 1 30%;
      transform: rotate(var(--fan));
    }

    &:nth-child(2) {
      position: relative;
      z-index: 1;
    }
  }

  &__paper {
    @include flex(column, stretch, flex-start, 0.7rem);
    padding: 0.65rem 0.65rem 0.8rem;
    background: $surface;
    border-radius: 3px;
    box-shadow:
      0 1px 0 rgba($ink, 0.06),
      0 40px 70px -35px rgba($ink, 0.45);
  }

  &__caption {
    @include flex(row, center, space-between, 1rem);
    padding-inline: 0.3rem;
    @include mono-label(0.62rem, 0.16em);
    color: $ink-soft;
  }

  &__foot {
    @include container(1320px);
    @include flex(row, center, space-between, 1rem);
    @include mono-label(0.6rem, 0.18em);
    color: $ink-muted;
  }
}
</style>

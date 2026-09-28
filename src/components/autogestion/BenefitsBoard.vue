<script setup lang="ts">
import { site, fxCatalog } from '@/config/site'
import { computed, ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import FeaturedBenefit from './FeaturedBenefit.vue'

// Beneficios del portal sin ocho cajas iguales: el principal («Mis
// productos») es un pliego naranja grande junto al encabezado, y los otros
// siete son filas de un índice que se entintan al pasar el cursor.
defineProps<{ index: string }>()

const a = site.autogestion
const b = fxCatalog.autogestion.benefits
const featured = computed(() => a.benefits[0]!)
const rest = computed(() => a.benefits.slice(1))

const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  gsap.fromTo(
    el.querySelector('.feat'),
    { clipPath: 'inset(100% 0% 0% 0%)', y: 60 },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      duration: 0.8,
      ease: 'expo.out',
      clearProps: 'clipPath,transform',
      scrollTrigger: { trigger: el.querySelector('.feat'), start: 'top 98%', once: true },
    },
  )
  el.querySelectorAll<HTMLElement>('.perk').forEach((row) => {
    // Arranca apenas la fila asoma y el texto entra junto con el filete:
    // bajando rápido no debe quedar ninguna fila vacía esperando.
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 100%', once: true } })
    tl.fromTo(
      row.querySelector('.perk__rule'),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, ease: 'expo.inOut' },
    )
    tl.fromTo(
      row.querySelectorAll('.perk__n, .perk__icon, .perk__title, .perk__text'),
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'expo.out',
        clearProps: 'opacity,visibility,transform',
      },
      0,
    )
  })
})
</script>

<template>
  <section id="beneficios" ref="root" class="board">
    <div class="board__inner">
      <div class="board__lead">
        <SectionHead
          :index="index"
          :eyebrow="a.benefitsEyebrow"
          :title="a.benefitsTitle"
          :text="a.benefitsText"
        />
        <FeaturedBenefit :item="featured" :number="b.number(1)" :label="b.featured" class="feat" />
      </div>

      <div class="board__list">
        <p class="board__more">{{ b.more }}</p>
        <ul class="perks">
          <li v-for="(item, i) in rest" :key="item.title" class="perk">
            <span class="perk__rule" aria-hidden="true"></span>
            <span class="perk__n" aria-hidden="true">{{ b.number(i + 2) }}</span>
            <span class="perk__icon" aria-hidden="true"><i :class="item.icon"></i></span>
            <div class="perk__copy">
              <h3 class="perk__title">{{ item.title }}</h3>
              <p class="perk__text">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.board {
  padding-block: $space-section;
  background: $paper;
  scroll-margin-top: var(--header-h);

  &__inner {
    @include container(1320px);
    @include flex(column, stretch, flex-start, 3rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: clamp(3rem, 6vw, 6rem);
    }
  }

  &__lead {
    @include from('lg') {
      flex: 0 0 42%;
    }

    :deep(.head) {
      margin-bottom: 2rem;
    }
  }

  &__list {
    @include from('lg') {
      flex: 1 1 auto;
      min-width: 0;
      padding-top: 1rem;
    }
  }

  &__more {
    margin-bottom: 0.5rem;

    @include until('md') {
      text-align: center;
    }

    @include mono-label(0.66rem, 0.18em);
    color: $ink-muted;
  }
}

.perks {
  list-style: none;
}

.perk {
  position: relative;
  isolation: isolate;
  @include flex(row, flex-start, flex-start, 0.9rem 1.25rem);
  flex-wrap: wrap;
  padding: 1.5rem 0.25rem;

  // En móvil cada beneficio va centrado: número, ícono, título y texto.
  @include until('md') {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  @include from('md') {
    flex-wrap: nowrap;
    align-items: center;
    padding: 1.75rem 1rem;
  }

  // Tinta que sube al pasar el cursor.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: $night;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.55s $ease;
  }

  &__rule {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: rgba($ink, 0.2);
    transform-origin: left;
  }

  &__n {
    @include mono-label(0.66rem, 0.1em);
    color: darken($accent-deep, 4%);
    padding-top: 0.2rem;
    min-width: 1.6rem;

    @include until('md') {
      padding-top: 0;
      min-width: 0;
    }
    transition: color 0.3s ease;
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid rgba($ink, 0.2);
    color: $accent-deep;
    font-size: 1.05rem;
    transition:
      transform 0.6s $ease,
      background-color 0.3s ease,
      color 0.3s ease,
      border-color 0.3s ease;
  }

  &__copy {
    flex: 1 1 16rem;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0.3rem);

    @include until('md') {
      flex: 0 1 auto;
      align-items: center;
      max-width: 34ch;
    }

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
    }
  }

  &__title {
    font-size: clamp(1.35rem, 1.1rem + 0.9vw, 1.85rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    transition: color 0.3s ease;

    @include from('md') {
      flex: 0 0 45%;
    }
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    line-height: 1.55;
    transition: color 0.3s ease;
  }

  @include fine-pointer {
    &:hover::before {
      transform: scaleY(1);
    }

    &:hover &__title {
      color: $surface;
    }

    &:hover &__text {
      color: rgba($surface, 0.75);
    }

    &:hover &__n {
      color: $accent;
    }

    &:hover &__icon {
      transform: rotate(-12deg) scale(1.08);
      background: $accent;
      border-color: $accent;
      color: $night;
    }
  }
}
</style>

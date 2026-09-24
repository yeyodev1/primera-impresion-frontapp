<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { Solution } from '@/types'
import { copy, fx } from '@/config/site'
import { fxCatalog } from '@/config/fx.catalog'
import {
  gsap,
  prefersReducedMotion,
  refreshAfterData,
  useGsapContext,
} from '@/composables/motion/useGsap'
import SectionHead from '@/components/site/SectionHead.vue'
import SolutionSheet from './SolutionSheet.vue'

// Otras soluciones de la familia en un riel con scroll-snap sobre negro. Las
// flechas aparecen solo si el riel desborda y se apagan en los extremos.
// La última lámina lleva a la familia completa en el catálogo.
const props = defineProps<{
  items: readonly Solution[]
  icon?: string
  family?: { name: string; to: RouteLocationRaw } | null
}>()

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const canPrev = ref(false)
const canNext = ref(false)
let ro: ResizeObserver | null = null

function update() {
  const el = track.value
  if (!el) return
  canPrev.value = el.scrollLeft > 4
  canNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

function go(dir: 1 | -1) {
  const el = track.value
  const slide = el?.querySelector<HTMLElement>('.rail__slide')
  if (!el || !slide) return
  el.scrollBy({
    left: dir * (slide.offsetWidth + 16),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  gsap.fromTo(
    el.querySelectorAll('.rail__slide'),
    { autoAlpha: 0, x: 80 },
    {
      autoAlpha: 1,
      x: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1,
      clearProps: 'opacity,visibility,transform',
      scrollTrigger: { trigger: el, start: 'top 75%', once: true },
    },
  )
})

onMounted(() => {
  update()
  ro = new ResizeObserver(update)
  if (track.value) ro.observe(track.value)
  refreshAfterData()
})
watch(
  () => props.items,
  () => nextTick(update),
)
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <section ref="root" class="rail">
    <div class="rail__inner">
      <div class="rail__top">
        <SectionHead
          tone="night"
          :index="fx.section(2, 2)"
          :eyebrow="family?.name ?? fxCatalog.detail.relatedEyebrow"
          :title="copy.solutions.relatedTitle"
        />
        <div v-if="canPrev || canNext" class="rail__nav">
          <button
            type="button"
            class="rail__btn"
            :disabled="!canPrev"
            :aria-label="fxCatalog.detail.prev"
            @click="go(-1)"
          >
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            class="rail__btn"
            :disabled="!canNext"
            :aria-label="fxCatalog.detail.next"
            @click="go(1)"
          >
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <ul ref="track" class="rail__track" @scroll.passive="update">
        <li v-for="(item, i) in items" :key="item._id" class="rail__slide">
          <SolutionSheet :solution="item" :icon="icon" :number="i + 1" tone="night" />
        </li>
        <li v-if="family" class="rail__slide">
          <RouterLink :to="family.to" class="rail__all">
            <i class="rail__all-icon" :class="icon" aria-hidden="true"></i>
            <span class="rail__all-label">{{ fx.solutions.preview }}</span>
            <span class="rail__all-name">{{ family.name }}</span>
            <span class="rail__all-arrow" aria-hidden="true"
              ><i class="fa-solid fa-arrow-right"></i
            ></span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.rail {
  padding-block: $space-section;
  background: $night;
  color: $surface;

  &__inner {
    @include container(1320px);
  }

  &__top {
    @include flex(row, flex-end, space-between, 1.5rem);
  }

  // En táctil se desliza con el dedo: las flechas solo desde md.
  &__nav {
    display: none;
    gap: 0.6rem;
    flex-shrink: 0;
    margin-bottom: $space-lg;

    @include from('md') {
      display: flex;
    }
  }

  &__btn {
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid rgba($surface, 0.35);
    color: $surface;
    @include transition(background-color, color, border-color, opacity);
    @include focus-ring;

    &:hover:not(:disabled) {
      background: $accent;
      border-color: $accent;
      color: $night;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  // Sale del contenedor a sangre y engancha cada lámina al borde.
  &__track {
    list-style: none;
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding: 0.5rem 1.25rem 1rem;
    margin-inline: -1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      gap: 1.5rem;
      margin-inline: -2rem;
      padding-inline: 2rem;
      scroll-padding-inline: 2rem;
    }
  }

  &__slide {
    flex: 0 0 min(80vw, 22rem);
    scroll-snap-align: start;
    display: flex;

    > * {
      flex: 1;
    }

    @include from('lg') {
      flex-basis: calc(33.333% - 1rem);
    }
  }

  // Lámina final naranja: la familia completa en el catálogo.
  &__all {
    position: relative;
    overflow: hidden;
    @include flex(column, flex-start, flex-end, 0.5rem);
    min-height: 20rem;
    padding: 1.75rem;
    border-radius: 3px;
    background: $accent;
    color: $night;
    @include focus-ring($surface);
  }

  &__all-icon {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    font-size: 5rem;
    opacity: 0.25;
    transition: transform 0.9s $ease;
  }

  &__all:hover &__all-icon {
    transform: scale(1.15) rotate(-8deg);
  }

  &__all-label {
    @include mono-label(0.64rem, 0.18em);
  }

  &__all-name {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(1.9rem, 1.4rem + 1.6vw, 2.8rem);
    line-height: 0.95;
    letter-spacing: -0.035em;
  }

  &__all-arrow {
    @include flex(row, center, center);
    margin-top: 0.75rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: $night;
    color: $surface;
    transform: rotate(-45deg);
    transition: transform 0.5s $ease;
  }

  &__all:hover &__all-arrow {
    transform: rotate(0);
  }
}
</style>

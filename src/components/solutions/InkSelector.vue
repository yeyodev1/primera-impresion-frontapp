<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { fxCatalog } from '@/config/site'
import type { InkOption } from '@/composables/useSolutionsCatalog'
import { gsap, prefersReducedMotion } from '@/composables/motion/useGsap'

// Selector de familias como un "tintero": una tira oscura fija bajo el header
// con una pestaña por familia (cada una con su parche de tinta y su número de
// soluciones) y un bloque naranja que se desliza hasta la activa. En móvil la
// fila se desliza con el dedo y la activa se centra sola. El slot `aside`
// recibe el contador de resultados.
const props = defineProps<{ options: readonly InkOption[]; label: string }>()
const model = defineModel<string>({ default: '' })

const inks = ['c', 'm', 'y', 'k'] as const
const track = ref<HTMLElement | null>(null)
const pill = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

function place(animate: boolean) {
  const el = track.value?.querySelector<HTMLElement>('.inks__tab--active')
  if (!el || !pill.value || !track.value) return
  const vars = { x: el.offsetLeft, width: el.offsetWidth, autoAlpha: 1 }
  const instant = !animate || prefersReducedMotion()
  if (instant) gsap.set(pill.value, vars)
  else gsap.to(pill.value, { ...vars, duration: 0.6, ease: 'expo.out', overwrite: true })
  // La pestaña activa se centra en la fila deslizable.
  const left = el.offsetLeft - (track.value.clientWidth - el.offsetWidth) / 2
  track.value.scrollTo({ left, behavior: instant ? 'auto' : 'smooth' })
}

watch(model, () => nextTick(() => place(true)))
watch(
  () => props.options.length,
  () => nextTick(() => place(false)),
)

onMounted(() => {
  place(false)
  ro = new ResizeObserver(() => place(false))
  if (track.value) ro.observe(track.value)
  document.fonts?.ready.then(() => place(false))
})

onBeforeUnmount(() => {
  ro?.disconnect()
  if (pill.value) gsap.killTweensOf(pill.value)
})
</script>

<template>
  <div class="inks">
    <div class="inks__inner">
      <p class="inks__label" aria-hidden="true">
        <span class="inks__well"></span>
        {{ fxCatalog.solutions.selector }}
      </p>
      <div ref="track" class="inks__track" role="group" :aria-label="label">
        <span ref="pill" class="inks__pill" aria-hidden="true"></span>
        <button
          v-for="(option, i) in options"
          :key="option.value || 'all'"
          type="button"
          class="inks__tab"
          :class="{ 'inks__tab--active': model === option.value }"
          :aria-pressed="model === option.value"
          @click="model = option.value"
        >
          <span
            class="inks__swatch"
            :class="option.value ? `inks__swatch--${inks[(i - 1) % 4]}` : 'inks__swatch--all'"
            aria-hidden="true"
          ></span>
          {{ option.label }}
          <sup class="inks__count">{{ option.count }}</sup>
        </button>
      </div>
      <div v-if="$slots.aside" class="inks__aside">
        <slot name="aside" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inks {
  position: sticky;
  top: var(--header-h);
  z-index: 20;
  background: $night;
  color: $surface;
  box-shadow: 0 1px 0 rgba($surface, 0.08);
  transition: transform 0.45s $ease;

  &__inner {
    @include container(1320px);
    @include flex(row, center, flex-start, 1rem);
    min-height: 3.75rem;
  }

  &__label {
    display: none;
    @include mono-label(0.62rem, 0.2em);
    color: rgba($surface, 0.55);
    flex-shrink: 0;

    @include from('lg') {
      @include flex(row, center, flex-start, 0.55rem);
      padding-right: 1rem;
      border-right: 1px solid rgba($surface, 0.14);
    }
  }

  &__well {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: conic-gradient($cmyk-c 0 25%, $cmyk-m 0 50%, $cmyk-y 0 75%, $surface 0);
  }

  &__track {
    position: relative;
    flex: 1;
    min-width: 0;
    @include flex(row, center, flex-start, 0.25rem);
    overflow-x: auto;
    padding-block: 0.6rem;
    scrollbar-width: none;
    mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 2.5rem), transparent);

    &::-webkit-scrollbar {
      display: none;
    }
  }

  // El bloque de tinta que viaja: arranca invisible hasta medir la activa.
  &__pill {
    position: absolute;
    left: 0;
    top: 0.6rem;
    bottom: 0.6rem;
    width: 0;
    border-radius: 2px;
    background: $accent;
    visibility: hidden;
  }

  &__tab {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    @include flex(row, center, center, 0.55rem);
    min-height: 2.6rem;
    padding: 0.45rem 0.85rem;
    @include mono-label(0.68rem, 0.1em);
    color: rgba($surface, 0.72);
    white-space: nowrap;
    border-radius: 2px;
    @include transition(color, background-color);
    @include focus-ring($accent);

    &:hover {
      color: $surface;
      background: rgba($surface, 0.06);
    }

    &--active,
    &--active:hover {
      color: $night;
      background: transparent;
    }
  }

  &__swatch {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba($surface, 0.25);

    &--c {
      background: $cmyk-c;
    }

    &--m {
      background: $cmyk-m;
    }

    &--y {
      background: $cmyk-y;
    }

    &--k {
      background: $surface;
    }

    &--all {
      background: conic-gradient($cmyk-c 0 25%, $cmyk-m 0 50%, $cmyk-y 0 75%, $surface 0);
      border-radius: 50%;
    }
  }

  &__tab--active &__swatch {
    box-shadow: 0 0 0 1px rgba($night, 0.6);
  }

  &__count {
    font-size: 0.58rem;
    opacity: 0.7;
    top: -0.45em;
  }

  &__aside {
    display: none;
    flex-shrink: 0;

    @include from('lg') {
      display: block;
      padding-left: 1rem;
      border-left: 1px solid rgba($surface, 0.14);
    }
  }
}
</style>

<style lang="scss">
// Cuando el header se esconde al bajar, la tira sube y ocupa su lugar.
body:has(.header--hidden) .inks {
  transform: translateY(calc(-1 * var(--header-h)));
}
</style>

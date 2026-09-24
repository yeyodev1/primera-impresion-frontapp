<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap, prefersReducedMotion } from '@/composables/motion/useGsap'

// Temas del blog como rótulos mono sobre un filete. Un bloque de tinta se
// desliza hasta el tema activo (se mide el botón real, así que funciona con
// cualquier largo de texto). En móvil la fila desliza en horizontal.
defineProps<{
  options: ReadonlyArray<{ label: string; value: string }>
  label: string
}>()

const model = defineModel<string>({ default: '' })
const root = ref<HTMLElement | null>(null)
const ink = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null

function place(animate = true) {
  const el = root.value
  const bar = ink.value
  if (!el || !bar) return
  const active = el.querySelector<HTMLElement>('.topics__chip--active')
  if (!active) return
  // scaleX sobre una base de 100px: se anima transform, no el ancho.
  const vars = { x: active.offsetLeft, y: active.offsetTop, scaleX: active.offsetWidth / 100, opacity: 1 }
  gsap.set(bar, { height: active.offsetHeight })
  if (!animate || prefersReducedMotion()) gsap.set(bar, vars)
  else gsap.to(bar, { ...vars, duration: 0.55, ease: 'expo.out', overwrite: true })
  // En la fila deslizable, el tema activo siempre queda a la vista.
  if (el.scrollWidth > el.clientWidth) {
    el.scrollTo({ left: active.offsetLeft - 16, behavior: animate && !prefersReducedMotion() ? 'smooth' : 'auto' })
  }
}

watch(model, () => nextTick(() => place()))

onMounted(() => {
  place(false)
  document.fonts?.ready.then(() => place(false))
  observer = new ResizeObserver(() => place(false))
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (ink.value) gsap.killTweensOf(ink.value)
})
</script>

<template>
  <div ref="root" class="topics" role="group" :aria-label="label">
    <span ref="ink" class="topics__ink" aria-hidden="true"></span>
    <button
      v-for="option in options"
      :key="option.value || 'all'"
      type="button"
      class="topics__chip"
      :class="{ 'topics__chip--active': model === option.value }"
      :aria-pressed="model === option.value"
      @click="model = option.value"
    >
      <span class="topics__dot" aria-hidden="true"></span>
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.topics {
  position: relative;
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid rgba($ink, 0.18);
  padding-bottom: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('lg') {
    flex-wrap: wrap;
    overflow: visible;
  }

  // Bloque de tinta: ancho y posición los pone JS; sin JS no se ve y el
  // tema activo sigue marcado por su propio color y punto.
  &__ink {
    position: absolute;
    left: 0;
    top: 0;
    height: 48px;
    width: 100px;
    transform-origin: 0 50%;
    opacity: 0;
    background: $night;
    pointer-events: none;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 3px;
      background: $accent;
    }
  }

  &__chip {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    @include flex(row, center, center, 0.55rem);
    min-height: 48px;
    padding: 0.6rem 1rem;
    background: transparent;
    @include mono-label(0.7rem, 0.1em);
    color: $ink-soft;
    white-space: nowrap;
    border-radius: 3px 3px 0 0;
    transition: color 0.35s $ease;
    @include focus-ring;

    &:hover {
      color: $ink;
    }

    &--active,
    &--active:hover {
      color: $surface;
    }
  }

  &__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    border: 1px solid currentColor;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  &__chip--active &__dot {
    background: $accent;
    border-color: $accent;
  }

  // Sin JS (o antes de medir) el activo lleva su propio fondo.
  &:not(:has(.topics__ink[style])) &__chip--active {
    background: $night;
  }
}
</style>

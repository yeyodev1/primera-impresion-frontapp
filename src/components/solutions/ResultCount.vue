<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { fxCatalog } from '@/config/site'
import { gsap, prefersReducedMotion } from '@/composables/motion/useGsap'

// Contador del pliego: número gigante en tinta hueca que rueda hasta el total
// de la familia elegida, con la familia y "04 de 33" en mono. El anuncio para
// lectores de pantalla va aparte (aria-live en la vista). El número lo
// escribe el tween (v-once): Vue no vuelve a tocar ese nodo de texto.
const props = defineProps<{ value: number; total: number; family: string }>()

const num = ref<HTMLElement | null>(null)
const pad = (n: number) => String(Math.round(n)).padStart(2, '0')
const state = { v: props.value }
let tween: gsap.core.Tween | null = null

watch(
  () => props.value,
  (to) => {
    const el = num.value
    if (!el) return
    if (prefersReducedMotion()) {
      state.v = to
      el.textContent = pad(to)
      return
    }
    tween?.kill()
    tween = gsap.to(state, {
      v: to,
      duration: 0.8,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = pad(state.v)),
    })
    gsap.fromTo(
      el,
      { yPercent: 18, rotation: -3 },
      { yPercent: 0, rotation: 0, duration: 0.8, ease: 'back.out(2)' },
    )
  },
)

onBeforeUnmount(() => {
  tween?.kill()
  if (num.value) gsap.killTweensOf(num.value)
})
</script>

<template>
  <div class="count" aria-hidden="true">
    <span ref="num" v-once class="count__num">{{ pad(value) }}</span>
    <div class="count__meta">
      <span class="count__label">{{ fxCatalog.solutions.results }}</span>
      <span class="count__family">{{ family }}</span>
      <span class="count__of">{{ fxCatalog.solutions.showing(value, total) }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.count {
  @include flex(row, flex-end, flex-start, 0.9rem);

  &__num {
    display: inline-block;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(5rem, 3rem + 7vw, 10rem);
    line-height: 0.78;
    letter-spacing: -0.06em;
    font-variant-numeric: tabular-nums;
    @include outline-text(rgba($ink, 0.55), 1.5px);
  }

  &__meta {
    @include flex(column, flex-start, flex-end, 0.3rem);
    padding-bottom: 0.2rem;
  }

  &__label {
    @include mono-label(0.6rem, 0.2em);
    color: $ink-muted;
  }

  &__family {
    max-width: 14ch;
    font-family: $font-display;
    font-weight: 800;
    font-size: 1.15rem;
    line-height: 1;
    letter-spacing: -0.02em;
    color: $ink;
  }

  &__of {
    @include mono-label(0.62rem, 0.16em);
    color: darken($accent-deep, 4%);
  }
}
</style>

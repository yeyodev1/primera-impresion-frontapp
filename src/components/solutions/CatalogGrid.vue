<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Solution } from '@/types'
import { gsap, ScrollTrigger, refreshAfterData, useGsapContext } from '@/composables/motion/useGsap'
import { useFlipFilter } from '@/composables/motion/useFlipFilter'
import SolutionSheet from './SolutionSheet.vue'

// Pliego de soluciones. Se pintan todas y el filtro solo las oculta
// (`visible`), para que al cambiar de familia las hojas se reacomoden con
// FLIP. La primera vez entran por tandas al hacer scroll.
const props = defineProps<{
  solutions: readonly Solution[]
  visible: (s: Solution) => boolean
  iconFor: (s: Solution) => string | undefined
  filterKey: string
}>()

const root = ref<HTMLElement | null>(null)

// Ritmo editorial: en cada tanda de 14 láminas visibles, la 1.ª y la 10.ª
// van destacadas (dobles), así cierran filas completas a 4 columnas. Se calcula sobre las visibles para que el ritmo se
// mantenga en cualquier familia; FLIP anima también el cambio de tamaño.
const wide = computed(() => {
  const ids = new Set<string>()
  let n = 0
  for (const s of props.solutions) {
    if (!props.visible(s)) continue
    if (n % 14 === 0 || n % 14 === 9) ids.add(s._id)
    n += 1
  }
  return ids
})

const gsapCtx = useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const items = Array.from(el.querySelectorAll<HTMLElement>('.grid__item')).filter(
    (i) => i.offsetParent,
  )
  if (!items.length) return
  gsap.set(items, { autoAlpha: 0, y: 70 })
  const pending = new Set(items)
  const enter = (batch: Element[]) => {
    batch.forEach((i) => pending.delete(i as HTMLElement))
    gsap.to(batch, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.08,
      overwrite: true,
      clearProps: 'opacity,visibility,transform',
    })
  }
  ScrollTrigger.batch(items, { start: 'top 92%', once: true, onEnter: enter })

  // Chequeo: si los disparadores se calcularon con un layout viejo (datos o
  // cortina que llegaron tarde), las láminas que ya están en pantalla nunca
  // "entran" y el pliego queda vacío hasta un F5. Tras cada recálculo, al
  // parar el scroll y por tiempo, las que ya se ven y siguen ocultas entran.
  const check = () => {
    const limit = window.innerHeight * 0.92
    const late = [...pending].filter((i) => i.getBoundingClientRect().top < limit)
    if (late.length) enter(late)
  }
  ScrollTrigger.addEventListener('refresh', check)
  ScrollTrigger.addEventListener('scrollEnd', check)
  const timers = [600, 1500].map((ms) => window.setTimeout(check, ms))
  return () => {
    ScrollTrigger.removeEventListener('refresh', check)
    ScrollTrigger.removeEventListener('scrollEnd', check)
    timers.forEach((t) => window.clearTimeout(t))
  }
})

// Llegan los datos: se reconstruyen las entradas y se recalcula el scroll.
watch(
  () => props.solutions.length,
  () => {
    gsapCtx.rebuild()
    refreshAfterData()
  },
)

// Al filtrar, las láminas que aún esperaban su entrada por scroll quedarían
// invisibles: se deshace la entrada (antes de la foto de FLIP) y listo.
watch(
  () => props.filterKey,
  () => gsapCtx.context?.revert(),
  { flush: 'pre' },
)

useFlipFilter(root, () => props.filterKey, '.grid__item')
</script>

<template>
  <ul ref="root" class="grid">
    <li
      v-for="(solution, i) in solutions"
      v-show="visible(solution)"
      :key="solution._id"
      class="grid__item"
      :class="{ 'grid__item--wide': wide.has(solution._id) }"
    >
      <SolutionSheet
        :solution="solution"
        :icon="iconFor(solution)"
        :number="i + 1"
        :wide="wide.has(solution._id)"
        row-on-mobile
      />
    </li>
  </ul>
</template>

<style scoped lang="scss">
.grid {
  list-style: none;
  position: relative;
  // Durante el reacomodo FLIP las láminas se mueven y el anclaje de scroll
  // del navegador arrastraba la página con ellas (saltos al filtrar).
  overflow-anchor: none;
  @include flex(row, stretch, flex-start, 2.25rem 1rem);
  flex-wrap: wrap;

  @include from('md') {
    gap: 3.5rem 1.5rem;
  }

  // Si una fila queda corta, sus láminas crecen para cerrarla.
  &__item {
    flex: 1 1 100%;
    min-width: 0;

    @include from('sm') {
      flex-basis: calc(50% - 0.5rem);
    }

    @include from('md') {
      flex-basis: calc(50% - 0.75rem);
    }

    @include from('lg') {
      flex-basis: calc(33.333% - 1.05rem);
    }

    @include from('xl') {
      flex-basis: calc(25% - 1.2rem);
    }

    &--wide {
      @include from('md') {
        flex-basis: 100%;
      }

      @include from('lg') {
        flex-basis: calc(66.666% - 0.55rem);
      }

      @include from('xl') {
        flex-basis: calc(50% - 0.8rem);
      }
    }
  }
}
</style>

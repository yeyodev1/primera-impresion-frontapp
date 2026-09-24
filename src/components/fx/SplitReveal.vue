<script setup lang="ts">
/**
 * SplitReveal — texto que entra por palabras o por líneas desde una máscara.
 *
 * Props:
 *   text     texto a animar (obligatorio)
 *   as       etiqueta a pintar (default 'p')
 *   by       'words' | 'lines'   (default 'words'; 'lines' agrupa por línea real)
 *   trigger  'scroll' | 'load'   (default 'scroll')
 *   delay    segundos de espera
 *   stagger  segundos entre palabras/líneas (default 0.05 / 0.12)
 *   accent   fragmento que va en naranja
 *
 * Con reduced motion el texto aparece tal cual. Hereda tipografía del padre:
 * dale clase propia para el tamaño.
 *
 * Uso: <SplitReveal as="h2" class="head__title" :text="title" />
 */
import { computed, ref } from 'vue'
import { lineIndexes, splitWords } from '@/composables/motion/split'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

const props = withDefaults(
  defineProps<{
    text: string
    as?: string
    by?: 'words' | 'lines'
    trigger?: 'scroll' | 'load'
    delay?: number
    stagger?: number
    accent?: string
  }>(),
  { as: 'p', by: 'words', trigger: 'scroll', delay: 0 },
)

const words = computed(() => splitWords(props.text, props.accent))
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const masks = Array.from(el.querySelectorAll<HTMLElement>('.split__mask'))
  const inner = masks.map((m) => m.firstElementChild as HTMLElement)
  const lines = props.by === 'lines' ? lineIndexes(masks) : null
  const step = props.stagger ?? (props.by === 'lines' ? 0.12 : 0.05)

  gsap.from(inner, {
    yPercent: 110,
    opacity: props.by === 'lines' ? 0 : 1,
    duration: props.by === 'lines' ? 1.1 : 0.95,
    ease: 'expo.out',
    delay: props.delay,
    stagger: (i: number) => (lines ? lines[i]! : i) * step,
    scrollTrigger: props.trigger === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
  })
})
</script>

<template>
  <component :is="as" ref="root" class="split">
    <span class="visually-hidden">{{ text }}</span>
    <template v-for="word in words" :key="word.index">
      <span class="split__mask" aria-hidden="true"><span class="split__word" :class="{ 'split__word--accent': word.accent }">{{ word.text }}</span></span>{{ ' ' }}
    </template>
  </component>
</template>

<style scoped lang="scss">
.split {
  &__mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    padding: 0.1em 0.03em 0.08em;
    margin: -0.1em -0.03em -0.08em;
  }

  &__word {
    display: inline-block;

    &--accent {
      color: var(--split-accent, #{$accent-deep});
    }
  }
}
</style>

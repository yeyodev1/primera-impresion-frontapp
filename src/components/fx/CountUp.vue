<script setup lang="ts">
/**
 * CountUp — número que cuenta hasta su valor al entrar en pantalla.
 *
 * El valor final está en el DOM desde el principio (y para lectores de
 * pantalla en un texto oculto): la animación solo lo reescribe al contar.
 *
 * Props:
 *   to        valor final (obligatorio)
 *   from      valor inicial (default 0)
 *   prefix    texto antes ('+')
 *   suffix    texto después
 *   duration  segundos (default 1.8)
 *
 * Uso: <CountUp :to="20" prefix="+" />
 */
import { computed, ref } from 'vue'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'

const props = withDefaults(
  defineProps<{ to: number; from?: number; prefix?: string; suffix?: string; duration?: number }>(),
  { from: 0, prefix: '', suffix: '', duration: 1.8 },
)

const final = computed(() => `${props.prefix}${props.to}${props.suffix}`)
const root = ref<HTMLElement | null>(null)

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const out = el.querySelector<HTMLElement>('.count__value')
  if (!out) return
  const state = { v: props.from }
  const paint = () => (out.textContent = `${props.prefix}${Math.round(state.v)}${props.suffix}`)
  paint()
  gsap.to(state, {
    v: props.to,
    duration: props.duration,
    ease: 'power2.out',
    onUpdate: paint,
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  })
  return () => {
    out.textContent = final.value
  }
})
</script>

<template>
  <span ref="root" class="count">
    <span class="count__value" aria-hidden="true">{{ final }}</span>
    <span class="visually-hidden">{{ final }}</span>
  </span>
</template>

<style scoped lang="scss">
.count {
  font-variant-numeric: tabular-nums;
}
</style>

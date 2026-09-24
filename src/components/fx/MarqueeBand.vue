<script setup lang="ts">
/**
 * MarqueeBand — cinta infinita de textos (categorías, rótulos).
 *
 * Decorativa (aria-hidden): el mismo contenido tiene que existir accesible en
 * otra parte de la página. Con reduced motion queda quieta.
 *
 * Props:
 *   items      textos a repetir
 *   direction  'left' | 'right'       (default 'left')
 *   speed      px por segundo           (default 60)
 *   tone       'accent' | 'night' | 'paper'
 *   outline    letras huecas (color del trazo: custom property --marquee-stroke)
 *   size       'lg' | 'md'
 *   reactive   acelera y cambia de sentido con el scroll (default true)
 *   tilt       grados de inclinación (default 0); inclinada se estira 3vw por lado,
 *              así que el padre debe recortar con overflow: hidden
 *
 * Uso: <MarqueeBand :items="names" tone="accent" direction="left" :tilt="-2" />
 */
import { ref } from 'vue'
import { useMarquee } from '@/composables/motion/useMarquee'

const props = withDefaults(
  defineProps<{
    items: readonly string[]
    direction?: 'left' | 'right'
    speed?: number
    tone?: 'accent' | 'night' | 'paper'
    outline?: boolean
    size?: 'lg' | 'md'
    reactive?: boolean
    tilt?: number
  }>(),
  { direction: 'left', speed: 60, tone: 'accent', size: 'lg', reactive: true, tilt: 0 },
)

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const { copies } = useMarquee(root, track, {
  speed: props.speed,
  direction: props.direction,
  reactive: props.reactive,
})
</script>

<template>
  <div
    ref="root"
    class="marquee"
    :class="[`marquee--${tone}`, `marquee--${size}`, { 'marquee--outline': outline }]"
    :style="tilt ? { transform: `rotate(${tilt}deg)`, marginInline: '-3vw' } : undefined"
    aria-hidden="true"
  >
    <div ref="track" class="marquee__track">
      <div v-for="n in copies" :key="n" class="marquee__group">
        <span v-for="item in items" :key="item" class="marquee__item">
          {{ item }}
          <svg class="marquee__sep" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="6.5" />
            <path d="M12 1v22M1 12h22" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.marquee {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  padding-block: 0.9rem;

  &--accent {
    background: $accent;
    color: $night;
  }

  &--night {
    background: $night;
    color: $surface;
  }

  &--paper {
    background: $paper;
    color: $ink;
  }

  &__track {
    display: flex;
    width: max-content;
    will-change: transform;
  }

  &__group {
    display: flex;
    flex-shrink: 0;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 1.4rem;
    padding-right: 1.4rem;
    font-family: $font-display;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  &--lg &__item {
    font-size: clamp(1.9rem, 1.2rem + 3.2vw, 4.4rem);
  }

  &--md &__item {
    font-size: clamp(1.2rem, 0.9rem + 1.6vw, 2.2rem);
  }

  // Hueco: el trazo sale de --marquee-stroke (currentColor sería transparente).
  &--outline &__item {
    color: transparent;
    -webkit-text-stroke: 1.2px var(--marquee-stroke, #{$surface});
  }

  &__sep {
    width: 0.62em;
    height: 0.62em;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    -webkit-text-stroke: 0;
  }

  &--accent &__sep {
    stroke: $surface;
  }

  &--night &__sep {
    stroke: $accent;
  }
}
</style>

<script setup lang="ts">
/**
 * HalftoneCanvas — malla de semitono viva que reacciona al cursor.
 *
 * Se coloca absoluta llenando al padre (que necesita position: relative y
 * overflow: hidden). Decorativa: aria-hidden y sin eventos de puntero.
 *
 * Props:
 *   tone        'night' (puntos claros, default) | 'paper' (puntos de tinta)
 *   focus       dónde se carga la tinta: 'br' | 'tr' | 'bl' | 'center'
 *   spacing     separación en px (default 15)
 *   interactive responde al cursor (default true; en táctil la lupa respira sola)
 *   lens        radio de la lupa en px (default 150)
 *   intensity   cuánto crecen los puntos bajo la lupa, 0–1 (default 0.72)
 *
 * Uso: <HalftoneCanvas focus="br" />
 */
import { ref } from 'vue'
import { useHalftone } from '@/composables/motion/useHalftone'

const props = withDefaults(
  defineProps<{
    tone?: 'night' | 'paper'
    focus?: 'br' | 'tr' | 'bl' | 'center'
    spacing?: number
    interactive?: boolean
    lens?: number
    intensity?: number
  }>(),
  { tone: 'night', focus: 'br', spacing: 15, interactive: true, lens: 150, intensity: 0.72 },
)

const canvas = ref<HTMLCanvasElement | null>(null)

useHalftone(canvas, {
  spacing: props.spacing,
  focus: props.focus,
  interactive: props.interactive,
  lens: props.lens,
  intensity: props.intensity,
  ink: props.tone === 'night' ? 'rgba(250,248,245,0.16)' : 'rgba(35,35,34,0.13)',
  accent: props.tone === 'night' ? '#ec6a2b' : '#b8471a',
})
</script>

<template>
  <canvas ref="canvas" class="halftone-canvas" aria-hidden="true"></canvas>
</template>

<style scoped lang="scss">
.halftone-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>

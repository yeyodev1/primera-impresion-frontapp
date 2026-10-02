<script setup lang="ts">
import { copy, fx } from '@/config/site'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import CropMarks from './CropMarks.vue'
import CmykDots from './CmykDots.vue'
import ImageSlot from './ImageSlot.vue'

// Tarjeta del hero tratada como una prueba de color: pliego claro con marcas
// de corte y de registro por fuera del área útil, rótulo técnico, tres
// espacios para fotos y la tira de control CMYK al pie.
defineProps<{
  pill: string
  title: string
  text?: string
  items?: readonly string[]
  icons?: readonly string[]
}>()
</script>

<template>
  <aside class="proof">
    <CropMarks tone="light" inset="0" />
    <RegMark class="proof__reg proof__reg--top" size="1.1rem" tone="light" />
    <RegMark class="proof__reg proof__reg--side" size="1.1rem" tone="light" />
    <div class="proof__sheet">
      <div class="proof__top">
        <span class="proof__spec">{{ fx.hero.proofLabel }}</span>
        <CmykDots stacked />
      </div>
      <span class="proof__pill">{{ pill }}</span>
      <p class="proof__title">{{ title }}</p>
      <p v-if="text" class="proof__text">{{ text }}</p>
      <ul v-if="items?.length" class="proof__chips">
        <li v-for="item in items" :key="item" class="proof__chip">{{ item }}</li>
      </ul>
      <div class="proof__tiles">
        <ImageSlot
          v-for="(icon, index) in icons ?? ['fa-solid fa-print', 'fa-solid fa-tags', 'fa-solid fa-box-open']"
          :key="index"
          :icon="icon"
          :label="copy.imagePending"
          compact
        />
      </div>
      <ColorBar class="proof__bar" />
    </div>
  </aside>
</template>

<style scoped lang="scss">
.proof {
  position: relative;
  padding: 1.6rem;
  width: 100%;
  max-width: 30rem;

  &__reg {
    position: absolute;

    &--top {
      top: -0.1rem;
      left: 50%;
      margin-left: -0.55rem;
    }

    &--side {
      right: -0.1rem;
      top: 50%;
      margin-top: -0.55rem;
    }
  }

  &__sheet {
    position: relative;
    @include flex(column, stretch, flex-start, 0.85rem);
    background: $surface;
    color: $ink;
    border-radius: 3px;
    padding: 1.4rem 1.4rem 1.1rem;
    box-shadow:
      0 1px 0 rgba(#000, 0.1),
      0 40px 80px -20px rgba(#000, 0.55);
    transform: rotate(-2deg);
    transition: transform 0.7s $ease;

    @include reduced-motion {
      transform: none;
    }

    &:hover {
      transform: rotate(0deg);
    }
  }

  &__top {
    @include flex(row, center, space-between, 1rem);
    padding-bottom: 0.75rem;
    border-bottom: 1px dashed $line;
  }

  &__spec {
    @include mono-label(0.58rem, 0.16em);
    color: $ink-muted;
  }

  &__pill {
    align-self: flex-start;
    @include mono-label(0.62rem, 0.14em);
    padding: 0.3rem 0.6rem;
    background: $night;
    color: $surface;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__chips {
    list-style: none;
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
  }

  &__chip {
    padding: 0.22rem 0.6rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
  }

  &__tiles {
    @include flex(row, stretch, flex-start, 0.5rem);
    margin-top: 0.2rem;

    > * {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  &__bar {
    max-width: none;
    margin-top: 0.35rem;
  }
}
</style>

<script setup lang="ts">
import CropMarks from './CropMarks.vue'
import CmykDots from './CmykDots.vue'
import ImageSlot from './ImageSlot.vue'
import { copy } from './copy'

// Tarjeta del hero tratada como una prueba de impresión: pliego claro,
// marcas de corte, tira de control CMYK y tres espacios para fotos.
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
    <CropMarks tone="light" />
    <div class="proof__sheet">
      <div class="proof__top">
        <span class="proof__pill">{{ pill }}</span>
        <CmykDots />
      </div>
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
          ratio="1 / 1"
          :label="copy.imagePending"
          compact
        />
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.proof {
  position: relative;
  padding: 1.4rem;
  width: 100%;
  max-width: 30rem;

  &__sheet {
    position: relative;
    @include flex(column, stretch, flex-start, 0.9rem);
    background: $surface;
    color: $ink;
    border-radius: $radius-sm;
    padding: 1.5rem;
    box-shadow: 0 30px 60px rgba(#000, 0.35);
    transform: rotate(-1.2deg);
    @include transition(transform);

    @include reduced-motion {
      transform: none;
    }

    &:hover {
      transform: rotate(0deg);
    }
  }

  &__top {
    @include flex(row, center, space-between, 1rem);
  }

  &__pill {
    padding: 0.3rem 0.75rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: darken($accent-deep, 6%);
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__chips {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__chip {
    padding: 0.25rem 0.65rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
  }

  &__tiles {
    @include flex(row, stretch, flex-start, 0.6rem);
    margin-top: 0.25rem;

    > * {
      flex: 1 1 0;
      min-width: 0;
    }
  }
}
</style>

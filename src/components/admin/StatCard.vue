<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  label: string
  value: number | string
  icon: string
  to?: string
  hint?: string
  highlight?: boolean
}>()
</script>

<template>
  <component
    :is="to ? RouterLink : 'div'"
    :to="to"
    class="stat"
    :class="{ 'stat--highlight': highlight, 'stat--link': to }"
  >
    <span class="stat__icon" aria-hidden="true"><i :class="icon"></i></span>
    <span class="stat__body">
      <span class="stat__value">{{ value }}</span>
      <span class="stat__label">{{ label }}</span>
      <span v-if="hint" class="stat__hint">{{ hint }}</span>
    </span>
  </component>
</template>

<style scoped lang="scss">
.stat {
  @include card;
  @include flex(column, flex-start, flex-start, 0.7rem);
  padding: 1rem;

  @include from('md') {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 1.1rem 1.2rem;
  }
  transition:
    border-color 0.25s $ease,
    box-shadow 0.25s $ease;

  &--link:hover {
    border-color: $ink-muted;
    box-shadow: $shadow-sm;
  }

  &__icon {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    background: $sand;
    color: $ink-soft;
  }

  &--highlight &__icon {
    background: $accent-soft;
    color: $accent-deep;
  }

  &__body {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
  }

  &__value {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 700;
    line-height: 1.1;
  }

  &__label {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CropMarks from './CropMarks.vue'

// Tarjeta de icono + título + texto, con enlace opcional (interno o externo).
// `featured` le pone marcas de corte para destacarla.
defineProps<{
  icon: string
  title: string
  text?: string
  link?: { label: string; to?: RouteLocationRaw; href?: string; external?: boolean }
  featured?: boolean
  as?: 'h2' | 'h3'
}>()
</script>

<template>
  <article class="icard" :class="{ 'icard--featured': featured }">
    <CropMarks v-if="featured" tone="accent" />
    <span class="icard__icon"><i :class="icon" aria-hidden="true"></i></span>
    <component :is="as ?? 'h3'" class="icard__title">{{ title }}</component>
    <p v-if="text" class="icard__text">{{ text }}</p>
    <template v-if="link">
      <RouterLink v-if="link.to" :to="link.to" class="icard__link">
        {{ link.label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
      <a
        v-else
        :href="link.href"
        class="icard__link"
        v-bind="link.external ? { target: '_blank', rel: 'noopener' } : {}"
      >
        {{ link.label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </a>
    </template>
  </article>
</template>

<style scoped lang="scss">
.icard {
  @include card;
  position: relative;
  @include flex(column, flex-start, flex-start, 0.65rem);
  padding: 1.75rem 1.5rem;
  border-radius: $radius-sm;
  @include transition;

  &:hover {
    border-color: rgba($accent, 0.45);
    box-shadow: $shadow-md;
  }

  &--featured {
    padding: 2.25rem 2rem;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: $radius-sm;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 1.1rem;
    margin-bottom: 0.35rem;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $ink;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-base;
    line-height: 1.6;
  }

  &__link {
    margin-top: auto;
    padding-top: 0.5rem;
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    color: darken($accent-deep, 4%);
    @include focus-ring;

    i {
      @include transition(transform);
    }

    &:hover i {
      transform: translateX(3px);
    }

    // Toda la tarjeta es clicable sin anidar enlaces.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
  }
}
</style>

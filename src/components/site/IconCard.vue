<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import CropMarks from './CropMarks.vue'

// Tarjeta de icono + título + texto, con enlace opcional (interno o externo).
// Un filete naranja se imprime de izquierda a derecha en hover; `featured`
// le suma marcas de corte y más aire.
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
  <article class="icard" :class="{ 'icard--featured': featured, 'icard--link': link }">
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
  position: relative;
  @include flex(column, flex-start, flex-start, 0.7rem);
  padding: 1.75rem 1.5rem 1.6rem;
  background: $surface;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba($ink, 0.07);
  transition:
    box-shadow 0.4s ease,
    transform 0.6s $ease;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 3px;
    background: $accent;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s $ease;
  }

  &:hover {
    box-shadow: 0 24px 50px -28px rgba($ink, 0.35);

    &::before {
      transform: scaleX(1);
    }
  }

  &--link:hover {
    transform: translateY(-3px);
  }

  &--featured {
    padding: 2.4rem 2rem 2.1rem;
  }

  &__icon {
    @include flex(row, center, center);
    width: 3.1rem;
    height: 3.1rem;
    border-radius: 3px;
    background: $night;
    color: $accent;
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
    transition:
      background-color 0.4s ease,
      color 0.4s ease,
      transform 0.6s $ease;
  }

  &:hover &__icon {
    background: $accent;
    color: $night;
    transform: rotate(-6deg);
  }

  &__title {
    font-size: clamp(1.25rem, 1.05rem + 0.7vw, 1.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $ink;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-base;
    line-height: 1.6;
  }

  &__link {
    margin-top: auto;
    padding-top: 0.6rem;
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 600;
    font-size: $text-sm;
    color: darken($accent-deep, 4%);
    @include focus-ring;

    i {
      transition: transform 0.4s $ease;
    }

    &:hover i {
      transform: translateX(4px);
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

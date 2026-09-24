<script setup lang="ts">
import { site, fxCatalog } from '@/config/site'
import CropMarks from '@/components/site/CropMarks.vue'
import HalftoneBg from '@/components/site/HalftoneBg.vue'
import RegMark from '@/components/fx/RegMark.vue'

// Aviso para empresas que compran seguido, dentro de la ficha: una tarjeta
// negra con trama, marcas de corte y un enlace completo a Autogestión.
</script>

<template>
  <aside class="notice">
    <HalftoneBg fade="right" />
    <CropMarks tone="light" inset="0.55rem" />
    <RegMark class="notice__reg" size="3.5rem" tone="accent" spin />
    <p class="notice__eyebrow">{{ fxCatalog.detail.recurrent }}</p>
    <p class="notice__title">{{ site.recurrentBanner.title }}</p>
    <p class="notice__text">{{ site.recurrentBanner.text }}</p>
    <RouterLink to="/autogestion" class="notice__link">
      {{ site.recurrentBanner.cta }}
      <span class="notice__arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
    </RouterLink>
  </aside>
</template>

<style scoped lang="scss">
.notice {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  @include flex(column, flex-start, flex-start, 0.55rem);
  padding: 1.75rem 1.5rem;
  border-radius: 3px;
  background: $night;
  color: $surface;

  @include from('md') {
    padding: 2rem 2rem 1.75rem;
  }

  &__reg {
    position: absolute;
    right: 1.25rem;
    top: 1.25rem;
    opacity: 0.8;
  }

  &__eyebrow {
    @include mono-label(0.62rem, 0.18em);
    color: $accent;
  }

  &__title {
    max-width: 20ch;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(1.4rem, 1.1rem + 1vw, 1.9rem);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  &__text {
    max-width: 40ch;
    font-size: $text-sm;
    color: rgba($surface, 0.72);
  }

  &__link {
    margin-top: 0.5rem;
    @include flex(row, center, flex-start, 0.75rem);
    font-weight: 700;
    border-radius: 2px;
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
    }
  }

  &__arrow {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: $accent;
    color: $night;
    transform: rotate(-45deg);
    transition: transform 0.5s $ease;
  }

  &:hover &__arrow {
    transform: rotate(0);
  }
}
</style>

<script setup lang="ts">
import { site, fxPages, contactForm } from '@/config/site'
import SmartLink from '@/components/site/SmartLink.vue'
import GoogleG from '@/components/brand/GoogleG.vue'

// Sello vertical de Google Reviews para el pie: la «G» en su burbuja, la nota
// y cinco estrellas doradas. Lleva a las reseñas de Google.
const r = fxPages.about.awards
</script>

<template>
  <SmartLink
    v-if="site.googleRating"
    :to="site.reviewsUrl || site.mapsUrl || contactForm"
    class="greview"
    :aria-label="r.ratingLabel(site.googleRating)"
  >
    <span class="greview__bubble" aria-hidden="true"><GoogleG /></span>
    <span class="greview__label" aria-hidden="true">{{ site.about.ratingTitle }}</span>
    <strong class="greview__value" aria-hidden="true">{{ site.googleRating.toFixed(1) }}</strong>
    <span class="greview__stars" aria-hidden="true">
      <i v-for="n in 5" :key="n" class="fa-solid fa-star"></i>
    </span>
  </SmartLink>
</template>

<style scoped lang="scss">
.greview {
  @include flex(column, center, flex-start, 0.35rem);
  width: 9.5rem;
  padding: 1.1rem 1rem 1rem;
  border-radius: 14px;
  background: $surface;
  color: #4a4a4a;
  text-align: center;
  box-shadow: 0 0 0 3px rgba($accent, 0.55);
  @include transition(transform, box-shadow);
  @include focus-ring;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 0 0 3px $accent,
      0 20px 34px -18px rgba(#000, 0.7);
  }

  // Burbuja de diálogo con la «G», como el sello de reseñas de Google.
  &__bubble {
    position: relative;
    @include flex(row, center, center);
    width: 3.1rem;
    height: 3.1rem;
    margin-bottom: 0.45rem;
    border: 1.5px solid #9a9a9a;
    border-radius: 8px;
    background: $surface;
    font-size: 1.9rem;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -0.36rem;
      width: 0.6rem;
      height: 0.6rem;
      background: $surface;
      border-right: 1.5px solid #9a9a9a;
      border-bottom: 1.5px solid #9a9a9a;
      transform: translateX(-50%) rotate(45deg);
    }
  }

  &__label {
    font-size: 0.82rem;
    font-weight: 600;
    white-space: nowrap;
  }

  &__value {
    font-family: $font-display;
    font-weight: 800;
    font-size: 2.2rem;
    line-height: 1;
    color: #4a4a4a;
  }

  &__stars {
    @include flex(row, center, center, 0.1rem);
    color: #fbbc05;
    font-size: 0.9rem;
  }
}
</style>

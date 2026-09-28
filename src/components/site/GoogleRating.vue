<script setup lang="ts">
import { site, fxPages, contactForm } from '@/config/site'
import SmartLink from '@/components/site/SmartLink.vue'
import GoogleG from '@/components/brand/GoogleG.vue'

// Calificación de Google Reviews con su isotipo: la «G» de Google en su
// burbuja, la nota grande y las estrellas doradas. Toda la tira lleva al
// perfil de Google Maps.
const ab = site.about
const r = fxPages.about.awards
</script>

<template>
  <SmartLink
    v-if="site.googleRating"
    :to="site.mapsUrl || contactForm"
    class="grating"
    :aria-label="r.ratingLabel(site.googleRating)"
  >
    <span class="grating__badge" aria-hidden="true"><GoogleG /></span>

    <span class="grating__score" aria-hidden="true">
      <span class="grating__label">{{ ab.ratingTitle }}</span>
      <span class="grating__row">
        <strong class="grating__value">{{ site.googleRating.toFixed(1) }}</strong>
        <span class="grating__stars"><i v-for="n in 5" :key="n" class="fa-solid fa-star"></i></span>
      </span>
    </span>

    <span class="grating__text" aria-hidden="true">{{ ab.ratingText }}</span>

    <span class="grating__cta" aria-hidden="true">
      {{ ab.ratingCta }} <i class="fa-solid fa-arrow-right"></i>
    </span>
  </SmartLink>
</template>

<style scoped lang="scss">
$google-gold: #fbbc05;

.grating {
  @include flex(row, center, flex-start, 1.25rem 2rem);
  flex-wrap: wrap;
  padding: 1.5rem 1.75rem;
  border-radius: 6px;
  background: $night;
  color: $surface;
  @include transition(transform, box-shadow);
  @include focus-ring;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 24px 40px -24px rgba(#000, 0.6);
  }

  // La «G» en una burbuja blanca, como el sello de reseñas de Google.
  &__badge {
    position: relative;
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 4.25rem;
    height: 4.25rem;
    border-radius: 14px;
    background: $surface;
    font-size: 2.4rem;

    &::after {
      content: '';
      position: absolute;
      left: 1.1rem;
      bottom: -0.45rem;
      width: 0.9rem;
      height: 0.9rem;
      background: $surface;
      transform: rotate(45deg);
      border-radius: 0 0 3px 0;
    }
  }

  &__score {
    @include flex(column, flex-start, flex-start, 0.3rem);
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: rgba($surface, 0.8);
  }

  &__row {
    @include flex(row, center, flex-start, 0.75rem);
  }

  &__value {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(2.4rem, 1.8rem + 2vw, 3.2rem);
    line-height: 0.9;
  }

  &__stars {
    @include flex(row, center, flex-start, 0.15rem);
    color: $google-gold;
    font-size: 1.1rem;
  }

  &__text {
    flex: 1 1 14rem;
    font-size: $text-sm;
    line-height: 1.55;
    color: rgba($surface, 0.72);
  }

  &__cta {
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.7rem 1.2rem;
    border: 1px solid rgba($surface, 0.35);
    border-radius: 999px;
    font-weight: 700;
    font-size: $text-sm;
    @include transition(background, color, border-color);
  }

  &:hover &__cta {
    background: $surface;
    border-color: $surface;
    color: $night;
  }
}
</style>

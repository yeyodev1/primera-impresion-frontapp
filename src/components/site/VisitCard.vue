<script setup lang="ts">
import { site, copy, fx, fxPages } from '@/config/site'
import CropMarks from './CropMarks.vue'
import ImageSlot from './ImageSlot.vue'
import SmartLink from './SmartLink.vue'
import VisitMap from './VisitMap.vue'
import RegMark from '@/components/fx/RegMark.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'

// "Visítanos en Guayaquil": texto del prototipo y, cuando Primera Impresión
// confirme la dirección en site.ts, la dirección y el mapa (VisitMap). Hasta
// entonces, en lugar del mapa, un espacio de imagen intencional en semitono
// con marcas de corte. `index` (opcional) numera la sección.
defineProps<{ index?: string }>()
</script>

<template>
  <aside class="visit">
    <div class="visit__copy">
      <p class="visit__eyebrow">
        <span v-if="index" class="visit__index">{{ index }}</span>
        {{ fxPages.contact.visitEyebrow }}
      </p>
      <SplitReveal as="h2" :text="site.contact.visitTitle" class="visit__title" />
      <p class="visit__text">{{ site.contact.visitText }}</p>
      <address v-if="site.address" class="visit__address">
        <span class="visit__street">{{ site.address }}</span>
        <span class="visit__city">{{ site.city }}</span>
      </address>
      <p class="visit__coords" aria-hidden="true">
        <RegMark size="0.9rem" tone="accent" />
        {{ fx.coords }}
      </p>
      <SmartLink v-if="site.mapsUrl" :to="site.mapsUrl" class="btn btn--ink btn--press visit__cta">
        {{ copy.contact.mapCta }}
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
      </SmartLink>
    </div>

    <div class="visit__map">
      <CropMarks inset="0" />
      <VisitMap v-if="site.address" />
      <ImageSlot v-else icon="fa-solid fa-location-dot" ratio="16 / 11" :label="copy.contact.mapPending" />
    </div>
  </aside>
</template>

<style scoped lang="scss">
.visit {
  @include flex(column, stretch, flex-start, 3rem);

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.1rem);

    @include from('lg') {
      flex: 1 1 40%;
    }
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.85rem);
    @include mono-label(0.7rem, 0.18em);
    color: darken($accent-deep, 4%);
  }

  &__index {
    padding: 0.2rem 0.45rem;
    border: 1px solid currentColor;
    border-radius: 2px;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.2rem, 1.3rem + 3.6vw, 4.6rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.04em;
    text-wrap: balance;
  }

  &__text {
    max-width: 40ch;
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__address {
    @include flex(column, flex-start, flex-start, 0.2rem);
    width: 100%;
    padding-block: 1rem;
    border-block: 1px solid rgba($ink, 0.18);
    font-style: normal;
  }

  &__street {
    font-family: $font-display;
    font-size: clamp(1.3rem, 1.1rem + 0.8vw, 1.7rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  &__city {
    @include mono-label(0.66rem, 0.16em);
    color: $ink-muted;
  }

  &__coords {
    @include flex(row, center, flex-start, 0.55rem);
    @include mono-label(0.64rem, 0.16em);
    color: $ink-muted;
  }

  &__cta {
    margin-top: 0.5rem;
  }

  &__map {
    position: relative;
    padding: 1.1rem;

    @include from('lg') {
      flex: 1 1 60%;
    }
  }
}
</style>

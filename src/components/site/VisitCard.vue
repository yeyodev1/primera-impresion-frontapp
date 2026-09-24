<script setup lang="ts">
import { site } from '@/config/site'
import { copy } from './copy'
import CropMarks from './CropMarks.vue'

// "Visítanos en Guayaquil": dirección real, enlace a Google Maps y mapa
// embebido (carga diferida para no frenar la página).
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`
</script>

<template>
  <aside class="visit">
    <h2 class="visit__title">{{ site.contact.visitTitle }}</h2>
    <p class="visit__text">{{ site.contact.visitText }}</p>
    <address class="visit__address">
      <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
      <span>{{ site.address }}<br />{{ site.city }}</span>
    </address>
    <a :href="site.mapsUrl" target="_blank" rel="noopener" class="btn btn--dark btn--sm visit__cta">
      {{ copy.contact.mapCta }}
      <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
      <span class="visually-hidden">{{ copy.header.newTab }}</span>
    </a>
    <div class="visit__map">
      <CropMarks />
      <iframe
        :src="mapSrc"
        :title="copy.contact.mapTitle"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.visit {
  @include flex(column, flex-start, flex-start, 0.9rem);

  &__title {
    @include display($display-sm, 800);
  }

  &__text {
    color: $ink-soft;
  }

  &__address {
    @include flex(row, flex-start, flex-start, 0.7rem);
    font-style: normal;
    font-weight: 600;
    line-height: 1.5;

    i {
      margin-top: 0.25rem;
      color: $accent;
    }
  }

  &__map {
    position: relative;
    width: 100%;
    margin-top: 0.5rem;
    padding: 1.25rem;
    background: $sand;
    border-radius: $radius-sm;

    iframe {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      border: 0;
      border-radius: 6px;
      background: $line;
    }
  }
}
</style>

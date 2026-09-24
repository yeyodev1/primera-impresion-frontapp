<script setup lang="ts">
import { fxCatalog } from '@/config/fx.catalog'
import CropMarks from '@/components/site/CropMarks.vue'
import CmykDots from '@/components/site/CmykDots.vue'

// La ficha que no existe, como un pliego mal registrado: el "404" gigante
// con sus tintas C, M y Y corridas, que se alinean al pasar el cursor.
// Decorativo: el mensaje real va en el PageIntro de la vista.
</script>

<template>
  <div class="misprint" aria-hidden="true">
    <CropMarks inset="1rem" />
    <p class="misprint__spec"><CmykDots /> {{ fxCatalog.detail.notFound.spec }}</p>
    <div class="misprint__code">
      <span class="misprint__ink misprint__ink--c">{{ fxCatalog.detail.notFound.code }}</span>
      <span class="misprint__ink misprint__ink--m">{{ fxCatalog.detail.notFound.code }}</span>
      <span class="misprint__ink misprint__ink--y">{{ fxCatalog.detail.notFound.code }}</span>
      <span class="misprint__ink misprint__ink--k">{{ fxCatalog.detail.notFound.code }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.misprint {
  position: relative;
  @include container(1320px);
  @include flex(column, flex-start, center, 1rem);
  padding-block: clamp(3rem, 8vw, 6rem);

  &__spec {
    @include flex(row, center, flex-start, 0.75rem);
    @include mono-label(0.64rem, 0.18em);
    color: $ink-muted;
  }

  &__code {
    position: relative;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(8rem, 4rem + 22vw, 22rem);
    line-height: 0.85;
    letter-spacing: -0.06em;

    &:hover .misprint__ink {
      transform: none;
    }
  }

  // Tres tintas corridas por debajo y la negra encima: los bordes de color
  // asoman como en un pliego mal registrado.
  &__ink {
    display: block;
    mix-blend-mode: multiply;
    opacity: 0.9;
    transition: transform 0.9s $ease;

    &:not(:first-child) {
      position: absolute;
      inset: 0;
    }

    &--c {
      color: $cmyk-c;
      transform: translate(-0.04em, -0.02em);
    }

    &--m {
      color: $cmyk-m;
      transform: translate(0.035em, 0.015em);
    }

    &--y {
      color: $cmyk-y;
      transform: translate(0.01em, 0.04em);
    }

    &--k {
      color: $night;
      mix-blend-mode: normal;
      opacity: 1;
    }
  }

  @include reduced-motion {
    &__ink {
      transition: none;
    }
  }
}
</style>

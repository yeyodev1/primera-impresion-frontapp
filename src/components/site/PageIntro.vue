<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { site, fx } from '@/config/site'
import HalftoneCanvas from '@/components/fx/HalftoneCanvas.vue'
import RegisterTitle from '@/components/fx/RegisterTitle.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'
import RegMark from '@/components/fx/RegMark.vue'
import ColorBar from '@/components/fx/ColorBar.vue'
import CmykDots from './CmykDots.vue'
import CropMarks from './CropMarks.vue'

// Cabecera oscura de las páginas internas: rótulos mono como el pie de un
// pliego (número de página y coordenadas), migas, titular gigante con
// registro CMYK y trama viva. El slot por defecto recibe metadatos o
// acciones debajo del lead.
defineProps<{
  eyebrow?: string
  title: string
  lead?: string
  back?: { label: string; to: RouteLocationRaw }
}>()

const route = useRoute()
// Número de página según el orden del menú (las fichas heredan el de su sección).
const pageIndex = computed(() => {
  const i = site.nav.findIndex((l) => l.to !== '/' && route.path.startsWith(l.to))
  return i >= 0 ? i + 1 : 0
})
const crumb = computed(() => (pageIndex.value ? site.nav[pageIndex.value - 1] : null))
</script>

<template>
  <header class="intro">
    <HalftoneCanvas focus="tr" :spacing="17" :lens="115" :intensity="0.5" />
    <CropMarks tone="light" inset="calc(var(--header-h) + 0.75rem) 0.9rem 0.9rem" />
    <div class="intro__inner">
      <div class="intro__meta">
        <nav class="intro__crumbs" :aria-label="fx.intro.breadcrumb">
          <RouterLink to="/" class="intro__crumb">{{ fx.intro.home }}</RouterLink>
          <template v-if="crumb">
            <span aria-hidden="true">/</span>
            <RouterLink :to="crumb.to" class="intro__crumb" :aria-current="route.path === crumb.to ? 'page' : undefined">
              {{ crumb.label }}
            </RouterLink>
          </template>
        </nav>
        <span v-if="pageIndex" class="intro__page" aria-hidden="true">{{ fx.intro.page(pageIndex, site.nav.length) }}</span>
      </div>

      <RouterLink v-if="back" :to="back.to" class="intro__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        {{ back.label }}
      </RouterLink>
      <p v-else-if="eyebrow" class="intro__eyebrow">
        <CmykDots />
        {{ eyebrow }}
      </p>

      <RegisterTitle as="h1" size="xl" tone="night" :text="title" trigger="load" :delay="0.15" class="intro__title" />
      <SplitReveal v-if="lead" :text="lead" by="lines" trigger="load" :delay="0.5" class="intro__lead" />
      <div v-if="$slots.default" class="intro__extra">
        <slot />
      </div>

      <div class="intro__foot" aria-hidden="true">
        <RegMark size="1.25rem" tone="light" />
        <span>{{ fx.coords }}</span>
        <ColorBar tone="night" compact class="intro__bar" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.intro {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: $night;
  color: $surface;

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, flex-start, 1.25rem);
    padding-top: calc(var(--header-h) + 2.5rem);
    padding-bottom: 2.25rem;

    @include from('md') {
      padding-top: calc(var(--header-h) + 3.5rem);
      min-height: min(78vh, 46rem);
    }
  }

  &__meta {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    margin-bottom: 1rem;
    @include mono-label(0.66rem, 0.16em);
    color: rgba($surface, 0.6);
  }

  &__crumbs {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__crumb {
    border-radius: 2px;
    @include transition(color);
    @include focus-ring;

    &:hover,
    &[aria-current='page'] {
      color: $accent;
    }
  }

  &__eyebrow {
    @include mono-label(0.72rem, 0.2em);
    @include flex(row, center, flex-start, 0.75rem);
    color: $accent;
  }

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    @include mono-label(0.72rem, 0.14em);
    color: rgba($surface, 0.8);
    padding-block: 0.35rem;
    @include transition(color);
    @include focus-ring($accent);

    &:hover {
      color: $accent;
    }
  }

  &__title {
    max-width: 16ch;
  }

  &__lead {
    max-width: 56ch;
    font-size: $text-lg;
    line-height: 1.55;
    color: rgba($surface, 0.78);
  }

  &__extra {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__foot {
    @include flex(row, center, flex-start, 0.85rem);
    width: 100%;
    margin-top: auto;
    padding-top: 2.5rem;
    @include mono-label(0.62rem, 0.18em);
    color: rgba($surface, 0.5);
  }

  &__bar {
    margin-left: auto;
  }
}
</style>

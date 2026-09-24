<script setup lang="ts">
import { ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { site } from '@/config/site'
import { fxCatalog } from '@/config/fx.catalog'
import { gsap, useGsapContext } from '@/composables/motion/useGsap'
import ColorBar from '@/components/fx/ColorBar.vue'
import CropMarks from '@/components/site/CropMarks.vue'

// "Opciones disponibles" como la hoja de producción que acompaña un trabajo
// en el taller: cabecera con referencia, familia, cada opción numerada con
// filete punteado hasta su marca, la nota de disponibilidad y la tira de
// control al pie. Las filas se imprimen una a una al entrar en pantalla.
defineProps<{
  slug: string
  options: readonly string[]
  family?: { name: string; to: RouteLocationRaw } | null
}>()

const root = ref<HTMLElement | null>(null)
const pad = (n: number) => String(n).padStart(2, '0')

useGsapContext(root, ({ reduced, el }) => {
  if (reduced) return
  const rows = el.querySelectorAll('.prod__row')
  gsap.fromTo(
    rows,
    { autoAlpha: 0, x: -24 },
    {
      autoAlpha: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: 'expo.out',
      clearProps: 'opacity,visibility,transform',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    },
  )
})
</script>

<template>
  <section ref="root" class="prod" :aria-label="site.solutions.detail.optionsTitle">
    <CropMarks inset="0.5rem" />
    <header class="prod__head">
      <span>{{ fxCatalog.detail.sheet }}</span>
      <span class="prod__ref">{{ fxCatalog.detail.ref(slug) }}</span>
    </header>

    <h2 class="prod__title">{{ site.solutions.detail.optionsTitle }}</h2>

    <dl class="prod__meta">
      <div v-if="family" class="prod__row prod__row--meta">
        <dt>{{ fxCatalog.detail.family }}</dt>
        <dd>
          <RouterLink :to="family.to" class="prod__family">{{ family.name }}</RouterLink>
        </dd>
      </div>
      <div class="prod__row prod__row--meta">
        <dt>{{ fxCatalog.detail.options }}</dt>
        <dd>{{ fxCatalog.detail.optionsCount(options.length) }}</dd>
      </div>
    </dl>

    <ol v-if="options.length" class="prod__list">
      <li v-for="(option, i) in options" :key="option" class="prod__row prod__row--option">
        <span class="prod__n" aria-hidden="true">{{ pad(i + 1) }}</span>
        <span class="prod__name">{{ option }}</span>
        <span class="prod__lead" aria-hidden="true"></span>
        <span class="prod__tick" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
      </li>
    </ol>

    <p class="prod__note">
      <span class="prod__note-label">{{ fxCatalog.detail.note }}</span>
      {{ site.solutions.detail.optionsText }}
    </p>
    <ColorBar compact class="prod__bar" />
  </section>
</template>

<style scoped lang="scss">
.prod {
  position: relative;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.6rem 1.35rem 1.35rem;
  background: $surface;
  border-radius: 3px;
  box-shadow:
    0 0 0 1px rgba($ink, 0.07),
    0 30px 60px -40px rgba($ink, 0.4);

  @include from('md') {
    padding: 2.1rem 2rem 1.6rem;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid $ink;
    @include mono-label(0.6rem, 0.18em);
    color: $ink-muted;
  }

  &__ref {
    color: $ink;
  }

  &__title {
    font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  &__meta {
    @include flex(column, stretch, flex-start);
    border-top: 1px solid $line;
  }

  &__row--meta {
    @include flex(row, baseline, space-between, 0.25rem 1rem);
    flex-wrap: wrap;
    padding-block: 0.6rem;
    border-bottom: 1px solid $line;

    dt {
      @include mono-label(0.62rem, 0.16em);
      color: $ink-muted;
    }

    dd {
      margin-left: auto;
      font-weight: 600;
      text-align: right;
    }
  }

  &__family {
    color: darken($accent-deep, 4%);
    border-radius: 2px;
    @include focus-ring;

    &:hover {
      text-decoration: underline;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start);
  }

  &__row--option {
    @include flex(row, center, flex-start, 0.75rem);
    padding-block: 0.7rem;
    border-bottom: 1px dashed rgba($ink, 0.14);
  }

  &__n {
    @include mono-label(0.64rem, 0.08em);
    color: darken($accent-deep, 4%);
    min-width: 1.4rem;
  }

  &__name {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.08rem;
    letter-spacing: -0.01em;
  }

  // Filete punteado hasta la marca, como en un índice impreso.
  &__lead {
    flex: 1;
    min-width: 1rem;
    height: 1px;
    background-image: radial-gradient(rgba($ink, 0.35) 0.8px, transparent 1px);
    background-size: 6px 2px;
    align-self: center;
    margin-top: 0.3rem;
  }

  &__tick {
    @include flex(row, center, center);
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 1px solid rgba($ink, 0.25);
    font-size: 0.62rem;
    color: $ink;
    transition:
      background-color 0.3s ease,
      color 0.3s ease,
      border-color 0.3s ease;
  }

  &__row--option:hover &__tick {
    background: $accent;
    border-color: $accent;
    color: $night;
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.55;
  }

  &__note-label {
    margin-right: 0.4rem;
    @include mono-label(0.6rem, 0.16em);
    color: $ink;
  }

  &__bar {
    align-self: flex-end;
    max-width: 8rem;
  }
}
</style>

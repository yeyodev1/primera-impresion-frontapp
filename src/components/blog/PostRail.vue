<script setup lang="ts">
import { computed } from 'vue'
import { fxPages } from '@/config/site'
import RegMark from '@/components/fx/RegMark.vue'

// Riel de lectura. En escritorio: columna fija con el avance en mono, una
// regla vertical que se llena de tinta y el índice de secciones (la activa
// marcada). En móvil: tira pegada arriba con la sección actual y el avance.
const props = defineProps<{
  headings: ReadonlyArray<{ id: string; text: string }>
  progress: number
  active: number
}>()

const percent = computed(() => Math.round(props.progress * 100))
const current = computed(() => props.headings[props.active] ?? null)
</script>

<template>
  <aside class="rail">
    <div class="rail__strip" aria-hidden="true">
      <p class="rail__now">
        <span v-if="current" class="rail__sec">{{ fxPages.post.section(active + 1) }}</span>
        <span class="rail__title">{{ current?.text ?? fxPages.post.progress }}</span>
        <span class="rail__pct">{{ percent }}%</span>
      </p>
      <span class="rail__bar"><span class="rail__fill" :style="{ transform: `scaleX(${progress})` }"></span></span>
    </div>

    <div class="rail__side">
      <p class="rail__meter" aria-hidden="true">
        <RegMark size="0.9rem" tone="accent" />
        <span>{{ fxPages.post.progress }}</span>
        <strong>{{ percent }}%</strong>
      </p>
      <nav v-if="headings.length" class="rail__toc" :aria-label="fxPages.post.toc">
        <p class="rail__label">{{ fxPages.post.toc }}</p>
        <span class="rail__track" aria-hidden="true"><span class="rail__ink" :style="{ transform: `scaleY(${progress})` }"></span></span>
        <ol>
          <li v-for="(h, i) in headings" :key="h.id">
            <a :href="`#${h.id}`" class="rail__link" :class="{ 'rail__link--on': i === active }" :aria-current="i === active ? 'location' : undefined">
              <span class="rail__num">{{ fxPages.post.section(i + 1) }}</span>
              {{ h.text }}
            </a>
          </li>
        </ol>
      </nav>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.rail {
  position: relative;

  // Móvil: el riel entero (solo la tira) queda pegado arriba mientras se lee.
  @include until('lg') {
    position: sticky;
    top: 0;
    z-index: 5;
  }

  &__strip {
    margin-inline: -1.25rem;
    padding: 0.7rem 1.25rem 0;
    background: rgba($paper, 0.94);
    backdrop-filter: blur(8px);

    @include from('md') {
      margin-inline: -2rem;
      padding-inline: 2rem;
    }

    @include from('lg') {
      display: none;
    }
  }

  &__now {
    @include flex(row, center, flex-start, 0.6rem);
    padding-bottom: 0.6rem;
    @include mono-label(0.62rem, 0.12em);
    color: $ink-soft;
  }

  &__sec {
    color: darken($accent-deep, 4%);
    flex-shrink: 0;
  }

  &__title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__pct {
    margin-left: auto;
    color: $ink;
  }

  &__bar {
    display: block;
    height: 2px;
    background: rgba($ink, 0.12);
  }

  &__fill {
    display: block;
    height: 100%;
    background: $accent;
    transform-origin: left;
  }

  &__side {
    display: none;

    @include from('lg') {
      position: sticky;
      top: 7rem;
      @include flex(column, stretch, flex-start, 2rem);
    }
  }

  &__meter {
    @include flex(row, center, flex-start, 0.6rem);
    padding-bottom: 1rem;
    border-bottom: 1px solid $ink;
    @include mono-label(0.64rem, 0.16em);
    color: $ink-muted;

    strong {
      margin-left: auto;
      font-family: $font-display;
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: $ink;
    }
  }

  &__toc {
    position: relative;
    padding-left: 1.1rem;

    ol {
      list-style: none;
      @include flex(column, stretch, flex-start, 0.2rem);
    }
  }

  &__label {
    margin-bottom: 0.9rem;
    @include mono-label(0.62rem, 0.18em);
    color: $ink-muted;
  }

  &__track {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba($ink, 0.15);
  }

  &__ink {
    position: absolute;
    inset: 0;
    background: $accent;
    transform-origin: top;
  }

  &__link {
    @include flex(column, flex-start, flex-start, 0.2rem);
    padding: 0.5rem 0;
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.35;
    color: $ink-muted;
    @include transition(color, transform);
    @include focus-ring;

    &:hover {
      color: $ink;
    }

    &--on {
      color: $ink;
      transform: translateX(0.35rem);
    }
  }

  &__num {
    @include mono-label(0.58rem, 0.14em);
    color: darken($accent-deep, 4%);
  }
}
</style>

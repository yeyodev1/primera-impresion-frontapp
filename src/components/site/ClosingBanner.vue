<script setup lang="ts">
import { fx } from '@/config/site'
import RegisterTitle from '@/components/fx/RegisterTitle.vue'
import SplitReveal from '@/components/fx/SplitReveal.vue'
import MagneticButton from '@/components/fx/MagneticButton.vue'
import RegMark from '@/components/fx/RegMark.vue'
import HalftoneBg from './HalftoneBg.vue'
import CropMarks from './CropMarks.vue'
import SmartLink from './SmartLink.vue'

// Bloque de cierre a sangre completa: naranja de marca (default) o negro, con
// titular enorme en registro y CTA magnético. Si se pasa `cta` pinta un
// botón (interno o externo, p. ej. WhatsApp); el slot `actions` permite poner varios.
withDefaults(
  defineProps<{
    title: string
    text?: string
    cta?: { label: string; to: string }
    tone?: 'accent' | 'night'
  }>(),
  { tone: 'accent' },
)
</script>

<template>
  <section class="closing" :class="`closing--${tone}`">
    <HalftoneBg fade="left" :tone="tone === 'accent' ? 'paper' : 'night'" />
    <RegMark class="closing__giant" size="min(62vw, 34rem)" spin />
    <CropMarks :tone="tone === 'accent' ? 'dark' : 'light'" inset="1rem" />
    <div class="closing__inner">
      <p class="closing__meta">
        <span v-for="item in fx.closingLine" :key="item">{{ item }}</span>
      </p>
      <RegisterTitle :text="title" size="xl" :tone="tone === 'accent' ? 'accent' : 'night'" class="closing__title" />
      <div class="closing__row">
        <SplitReveal v-if="text" :text="text" by="lines" class="closing__text" />
        <div class="closing__actions">
          <slot name="actions">
            <MagneticButton v-if="cta">
              <SmartLink :to="cta.to" class="btn btn--press" :class="tone === 'accent' ? 'btn--ink' : 'btn--primary'">
                {{ cta.label }}
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </SmartLink>
            </MagneticButton>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.closing {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: clamp(4.5rem, 10vw, 9rem);

  &--accent {
    background: $accent;
    color: $night;
  }

  &--night {
    background: $night;
    color: $surface;
  }

  &__giant {
    position: absolute;
    right: -12%;
    top: 50%;
    margin-top: calc(min(62vw, 34rem) / -2);
    opacity: 0.16;
    z-index: 0;
  }

  &--night &__giant {
    color: $accent;
    opacity: 0.2;
  }

  &__inner {
    @include container(1320px);
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, flex-start, 1.75rem);
  }

  &__meta {
    @include flex(row, center, flex-start, 1.5rem);
    flex-wrap: wrap;
    @include mono-label(0.66rem, 0.2em);
    opacity: 0.75;
  }

  &__title {
    max-width: 15ch;
  }

  &__row {
    @include flex(column, flex-start, space-between, 1.75rem);
    width: 100%;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__text {
    max-width: 44ch;
    font-size: $text-lg;
    line-height: 1.5;
    font-weight: 500;
  }

  &--night &__text {
    color: rgba($surface, 0.75);
  }

  &__actions {
    @include flex(row, center, flex-start, 0.9rem);
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  // Botones que llegan por slot desde vistas sin rediseñar: sobre el naranja
  // el primario pasa a tinta negra para no perderse.
  &--accent &__actions :deep(.btn--primary) {
    background: $night;
    color: $surface;
  }

  &--accent &__actions :deep(.btn--ghost),
  &--accent &__actions :deep(.btn--outline-light) {
    border-color: $night;
    color: $night;
  }
}
</style>

<script setup lang="ts">
import CountUp from '@/components/fx/CountUp.vue'

// Tira de cifras grandes: cada una con su número (que cuenta al entrar) o un
// texto, una etiqueta y una nota mono. Solo datos del prototipo o del API.
// Uso: <StatStrip tone="night" :stats="[{ value: 20, prefix: '+', label: 'años', note: 'Guayaquil' }]" />
interface Stat {
  value?: number
  prefix?: string
  suffix?: string
  text?: string
  label: string
  note?: string
}

withDefaults(defineProps<{ stats: readonly Stat[]; tone?: 'paper' | 'night' }>(), { tone: 'paper' })
</script>

<template>
  <dl class="stats" :class="`stats--${tone}`">
    <div v-for="stat in stats" :key="stat.label" class="stats__item">
      <dt class="stats__label">{{ stat.label }}</dt>
      <dd class="stats__value" :class="{ 'stats__value--text': !stat.value }">
        <CountUp v-if="stat.value" :to="stat.value" :prefix="stat.prefix" :suffix="stat.suffix" />
        <template v-else>{{ stat.text }}</template>
      </dd>
      <dd v-if="stat.note" class="stats__note">{{ stat.note }}</dd>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.stats {
  @include flex-cards(240px, 0);

  &__item {
    position: relative;
    @include flex(column, flex-start, flex-end, 0.35rem);
    padding: 1.75rem 1.5rem 1.5rem 0;
    border-top: 1px solid rgba($ink, 0.14);

    @include from('md') {
      padding-left: 1.5rem;
      border-top: none;
      border-left: 1px solid rgba($ink, 0.14);

      &:first-child {
        padding-left: 0;
        border-left: none;
      }
    }
  }

  // El valor va primero en pantalla aunque la etiqueta vaya primero en el DOM.
  &__value {
    order: -1;
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(4rem, 2.6rem + 6vw, 8.5rem);
    line-height: 0.85;
    letter-spacing: -0.06em;
    color: $ink;

    &--text {
      font-size: clamp(2.8rem, 1.8rem + 4vw, 5.6rem);
      line-height: 0.9;
      letter-spacing: -0.045em;
      max-width: 7ch;
    }
  }

  &__label {
    margin-top: 0.6rem;
    font-size: $text-lg;
    font-weight: 600;
    color: $ink;
  }

  &__note {
    @include mono-label(0.64rem, 0.16em);
    color: $ink-muted;
  }

  &--night &__item {
    border-color: rgba($surface, 0.14);
  }

  &--night &__value {
    color: $accent;
  }

  &--night &__value--text {
    color: $surface;
  }

  &--night &__label {
    color: $surface;
  }

  &--night &__note {
    color: rgba($surface, 0.55);
  }
}
</style>

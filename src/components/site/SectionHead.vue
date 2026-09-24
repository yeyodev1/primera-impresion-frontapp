<script setup lang="ts">
// Encabezado de sección: eyebrow + título + texto. Con `tone="night"` se
// usa sobre fondos oscuros.
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    text?: string
    tone?: 'paper' | 'night'
    align?: 'start' | 'center'
    as?: 'h2' | 'h3'
  }>(),
  { tone: 'paper', align: 'start', as: 'h2' },
)
</script>

<template>
  <div class="head" :class="[`head--${tone}`, `head--${align}`]">
    <p v-if="eyebrow" class="head__eyebrow">{{ eyebrow }}</p>
    <component :is="as" class="head__title">{{ title }}</component>
    <p v-if="text" class="head__text">{{ text }}</p>
  </div>
</template>

<style scoped lang="scss">
.head {
  @include flex(column, flex-start, flex-start, 0.75rem);
  max-width: 44rem;
  margin-bottom: $space-lg;

  &--center {
    align-items: center;
    text-align: center;
    margin-inline: auto;
  }

  &__eyebrow {
    @include eyebrow;
    // Un punto más oscuro que $accent-deep: AA sobre papel en texto pequeño.
    color: darken($accent-deep, 4%);
    @include flex(row, center, flex-start, 0.6rem);

    &::before {
      content: '';
      width: 1.5rem;
      height: 2px;
      background: currentColor;
    }
  }

  &__title {
    @include display($display-sm, 800);
    color: $ink;
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.55;
    color: $ink-soft;
    max-width: 58ch;
  }

  &--night &__eyebrow {
    color: $accent;
  }

  &--night &__title {
    color: $surface;
  }

  &--night &__text {
    color: rgba($surface, 0.75);
  }
}
</style>

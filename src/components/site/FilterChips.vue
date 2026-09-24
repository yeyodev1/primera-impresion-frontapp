<script setup lang="ts">
// Chips de filtro de selección única. `value: ''` representa "Todas".
// Aspecto de etiqueta técnica: mono, esquinas rectas y la activa entintada
// con su punto de registro.
defineProps<{
  options: ReadonlyArray<{ label: string; value: string }>
  label: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="chips" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value || 'all'"
      type="button"
      class="chips__chip"
      :class="{ 'chips__chip--active': model === option.value }"
      :aria-pressed="model === option.value"
      @click="model = option.value"
    >
      <span class="chips__dot" aria-hidden="true"></span>
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  display: flex;
  gap: 0.4rem;
  margin-bottom: $space-lg;
  // En móvil desliza en una fila en vez de ocupar media pantalla.
  overflow-x: auto;
  padding-bottom: 0.35rem;
  scrollbar-width: none;
  scroll-snap-type: x proximity;

  @include from('md') {
    flex-wrap: wrap;
    overflow: visible;
  }

  &__chip {
    flex-shrink: 0;
    scroll-snap-align: start;
    @include flex(row, center, center, 0.5rem);
    min-height: 42px;
    padding: 0.5rem 0.95rem;
    border: 1px solid rgba($ink, 0.18);
    border-radius: 3px;
    background: transparent;
    @include mono-label(0.7rem, 0.08em);
    color: $ink-soft;
    white-space: nowrap;
    @include transition(background, color, border-color);
    @include focus-ring;

    &:hover {
      border-color: $ink;
      color: $ink;
    }

    &--active,
    &--active:hover {
      background: $night;
      border-color: $night;
      color: $surface;
    }
  }

  &__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    border: 1px solid currentColor;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  &__chip--active &__dot {
    background: $accent;
    border-color: $accent;
  }
}
</style>

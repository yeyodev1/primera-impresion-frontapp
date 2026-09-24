<script setup lang="ts">
// Chips de filtro de selección única. `value: ''` representa "Todas".
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
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  display: flex;
  gap: 0.5rem;
  margin-bottom: $space-lg;
  // En móvil desliza en una fila en vez de ocupar media pantalla.
  overflow-x: auto;
  padding-bottom: 0.35rem;
  scrollbar-width: thin;

  @include from('md') {
    flex-wrap: wrap;
    overflow: visible;
  }

  &__chip {
    flex-shrink: 0;
    min-height: 40px;
    padding: 0.5rem 1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    @include transition;
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
}
</style>

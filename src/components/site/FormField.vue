<script setup lang="ts">
import { copy } from '@/config/site'

// Etiqueta + control + error, con los ids enlazados para lectores de pantalla.
defineProps<{ id: string; label: string; required?: boolean; error?: string }>()
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label :for="id" class="field__label">
      {{ label }}
      <span v-if="required" class="field__req" :title="copy.forms.requiredHint">*</span>
    </label>
    <slot :describedby="error ? `${id}-error` : undefined" :invalid="Boolean(error)" />
    <p v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start);

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  &__req {
    color: darken($accent-deep, 4%);
  }

  &__error {
    margin-top: 0.35rem;
    font-size: $text-xs;
    font-weight: 600;
    color: darken($danger, 8%);
  }

  &--error :slotted(input),
  &--error :slotted(select),
  &--error :slotted(textarea) {
    border-color: $danger;
  }
}
</style>

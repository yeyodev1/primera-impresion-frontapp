<script setup lang="ts">
import { copy } from '@/config/site'

// Estados de carga, error y vacío con la misma altura y tono, para que la
// página no salte ni quede un hueco mudo.
defineProps<{ loading?: boolean; error?: string; empty?: string; icon?: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="state" role="status" aria-live="polite">
    <span class="state__spinner" aria-hidden="true"></span>
    <p class="state__text">{{ copy.states.loading }}</p>
  </div>
  <div v-else-if="error" class="state state--error" role="alert">
    <i class="fa-solid fa-triangle-exclamation state__icon" aria-hidden="true"></i>
    <p class="state__text">{{ copy.states.error }} {{ error }}</p>
    <button type="button" class="btn btn--ghost btn--sm" @click="$emit('retry')">
      <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
      {{ copy.states.retry }}
    </button>
  </div>
  <div v-else-if="empty" class="state">
    <i :class="icon ?? 'fa-solid fa-layer-group'" class="state__icon" aria-hidden="true"></i>
    <p class="state__text">{{ empty }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.9rem);
  min-height: 14rem;
  padding: 2.5rem 1.5rem;
  border: 1.5px dashed $line;
  border-radius: $radius-sm;
  text-align: center;

  &__icon {
    font-size: 1.75rem;
    color: $ink-muted;
  }

  &--error &__icon {
    color: $danger;
  }

  &__text {
    max-width: 46ch;
    color: $ink-soft;
  }

  &__spinner {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    border: 2.5px solid $line;
    border-top-color: $accent;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

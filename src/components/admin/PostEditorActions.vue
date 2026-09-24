<script setup lang="ts">
// Barra fija con las acciones del artículo: siempre a mano aunque el texto sea largo.
defineProps<{ isPublished: boolean; isDirty: boolean; saving: boolean }>()
const emit = defineEmits<{ save: [publish: boolean] }>()
</script>

<template>
  <footer class="actions">
    <span v-if="isDirty" class="actions__dirty">
      <i class="fa-solid fa-circle"></i> Cambios sin guardar
    </span>
    <template v-if="isPublished">
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="saving"
        @click="emit('save', false)"
      >
        <i class="fa-solid fa-eye-slash"></i> Despublicar
      </button>
      <button
        class="btn btn--primary btn--sm"
        type="button"
        :disabled="saving || !isDirty"
        @click="emit('save', true)"
      >
        <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'"></i>
        Guardar cambios
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="saving"
        @click="emit('save', false)"
      >
        <i class="fa-regular fa-floppy-disk"></i> Guardar borrador
      </button>
      <button
        class="btn btn--primary btn--sm"
        type="button"
        :disabled="saving"
        @click="emit('save', true)"
      >
        <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'"></i>
        Publicar
      </button>
    </template>
  </footer>
</template>

<style scoped lang="scss">
.actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  // Botones a la izquierda: los toasts aparecen abajo a la derecha y los taparían.
  @include flex(row, center, flex-start, 0.6rem);
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: rgba($surface, 0.96);
  border-top: 1px solid $line;
  box-shadow: 0 -8px 24px rgba($ink, 0.06);

  @include from('lg') {
    left: 248px;
    padding-inline: 2rem;
  }

  &__dirty {
    order: 1;
    margin-left: auto;
    font-size: $text-xs;
    color: $accent-deep;

    i {
      font-size: 0.45rem;
      vertical-align: middle;
      margin-right: 0.3rem;
    }
  }
}
</style>

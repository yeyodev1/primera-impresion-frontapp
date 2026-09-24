<script setup lang="ts">
defineProps<{ page: number; pages: number; total?: number }>()
const emit = defineEmits<{ 'update:page': [value: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button
      class="btn btn--ghost btn--sm"
      type="button"
      :disabled="page <= 1"
      @click="emit('update:page', page - 1)"
    >
      <i class="fa-solid fa-chevron-left"></i> Anterior
    </button>
    <span class="pager__info">
      Página {{ page }} de {{ pages
      }}<template v-if="total !== undefined"> · {{ total }} en total</template>
    </span>
    <button
      class="btn btn--ghost btn--sm"
      type="button"
      :disabled="page >= pages"
      @click="emit('update:page', page + 1)"
    >
      Siguiente <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, space-between, 0.75rem);
  flex-wrap: wrap;
  margin-top: $space-md;

  &__info {
    order: -1;
    width: 100%;
    text-align: center;
    font-size: $text-sm;
    color: $ink-muted;

    @include from('md') {
      order: 0;
      width: auto;
    }
  }
}
</style>

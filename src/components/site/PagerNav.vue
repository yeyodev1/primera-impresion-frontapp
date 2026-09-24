<script setup lang="ts">
import { copy } from '@/config/site'

// Paginación simple: anterior / página actual / siguiente.
defineProps<{ page: number; pages: number }>()
defineEmits<{ go: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pager" :aria-label="copy.blog.page(page, pages)">
    <button type="button" class="btn btn--ghost btn--sm" :disabled="page <= 1" @click="$emit('go', page - 1)">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      {{ copy.blog.prev }}
    </button>
    <span class="pager__status" aria-current="page">{{ copy.blog.page(page, pages) }}</span>
    <button type="button" class="btn btn--ghost btn--sm" :disabled="page >= pages" @click="$emit('go', page + 1)">
      {{ copy.blog.next }}
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, center, 1rem);
  flex-wrap: wrap;
  margin-top: $space-lg;

  &__status {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
  }
}
</style>

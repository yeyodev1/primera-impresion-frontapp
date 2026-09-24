<script setup lang="ts">
defineProps<{ title: string; description?: string; eyebrow?: string }>()
</script>

<template>
  <header class="page-head">
    <div class="page-head__text">
      <p v-if="eyebrow" class="page-head__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-head__title">{{ title }}</h1>
      <p v-if="description" class="page-head__description">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="page-head__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(column, stretch, flex-start, 1rem);
  margin-bottom: $space-md;

  @include from('md') {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.35rem;
  }

  &__title {
    @include display($text-xl, 700);
  }

  &__description {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 60ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    flex-shrink: 0;
  }
}
</style>

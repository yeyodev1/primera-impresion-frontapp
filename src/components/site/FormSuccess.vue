<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CropMarks from './CropMarks.vue'
import { copy } from './copy'

// Reemplaza al formulario tras un envío correcto. Toma el foco para que el
// lector de pantalla anuncie el mensaje.
defineProps<{ message: string }>()
defineEmits<{ again: [] }>()

const box = ref<HTMLElement | null>(null)
onMounted(() => box.value?.focus())
</script>

<template>
  <div ref="box" class="success" role="status" tabindex="-1">
    <CropMarks tone="accent" />
    <span class="success__icon"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
    <p class="success__text">{{ message }}</p>
    <button type="button" class="btn btn--ghost btn--sm" @click="$emit('again')">{{ copy.forms.again }}</button>
  </div>
</template>

<style scoped lang="scss">
.success {
  position: relative;
  @include flex(column, center, center, 1rem);
  min-height: 20rem;
  padding: 2.5rem 1.5rem;
  text-align: center;
  outline: none;

  &__icon {
    @include flex(row, center, center);
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: $success-bg;
    color: $success;
    font-size: 1.4rem;
  }

  &__text {
    max-width: 38ch;
    font-size: $text-lg;
    font-weight: 600;
    color: $ink;
  }
}
</style>

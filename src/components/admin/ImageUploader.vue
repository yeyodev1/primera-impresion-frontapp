<script setup lang="ts">
import { ref } from 'vue'
import { useImageUpload } from '@/composables/admin/useImageUpload'
import type { MediaImage } from '@/types'

// La imagen es opcional: hoy el cliente está diseñando sus fotos y el sitio
// muestra un espacio en blanco digno mientras tanto. Todas son cuadradas: el
// marco ya muestra el recorte que se va a subir.
withDefaults(defineProps<{ modelValue: MediaImage | null; label?: string; hint?: string }>(), {
  label: 'Imagen',
  hint: 'Opcional. Cuadrada (1:1); si no lo es, se recorta al centro. JPG, PNG o WebP.',
})
const emit = defineEmits<{ 'update:modelValue': [value: MediaImage | null] }>()

const input = ref<HTMLInputElement | null>(null)
const { uploading, upload } = useImageUpload()

async function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (!file) return
  const image = await upload(file)
  if (image) emit('update:modelValue', image)
}
</script>

<template>
  <div class="uploader">
    <span class="uploader__label">{{ label }}</span>
    <div class="uploader__frame">
      <img v-if="modelValue?.url" :src="modelValue.url" alt="" class="uploader__img" />
      <button
        v-else
        type="button"
        class="uploader__empty"
        :disabled="uploading"
        @click="input?.click()"
      >
        <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-regular fa-image'"></i>
        <span>{{ uploading ? 'Subiendo…' : 'Sin imagen' }}</span>
      </button>
    </div>
    <div class="uploader__actions">
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="uploading"
        @click="input?.click()"
      >
        <i
          :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-arrow-up-from-bracket'"
        ></i>
        {{ modelValue ? 'Cambiar' : 'Subir imagen' }}
      </button>
      <button
        v-if="modelValue"
        class="uploader__remove"
        type="button"
        :disabled="uploading"
        @click="emit('update:modelValue', null)"
      >
        <i class="fa-solid fa-trash-can"></i> Quitar
      </button>
    </div>
    <p class="uploader__hint">{{ hint }}</p>
    <input
      ref="input"
      class="visually-hidden"
      type="file"
      accept="image/*"
      tabindex="-1"
      @change="onPick"
    />
  </div>
</template>

<style scoped lang="scss">
.uploader {
  @include flex(column, stretch, flex-start, 0.55rem);

  &__label {
    font-size: 0.82rem;
    font-weight: 500;
    color: $ink-soft;
  }

  &__frame {
    position: relative;
    aspect-ratio: 1 / 1;
    max-width: 240px;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__empty {
    @include flex(column, center, center, 0.4rem);
    width: 100%;
    height: 100%;
    border: 1.5px dashed $line;
    border-radius: $radius-sm;
    color: $ink-muted;
    font-size: $text-sm;

    i {
      font-size: 1.5rem;
    }

    &:hover {
      border-color: $ink-muted;
      color: $ink-soft;
    }
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__remove {
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
    padding: 0.5rem 0.75rem;
    min-height: 40px;
    border-radius: $radius-sm;

    &:hover {
      background: $danger-bg;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>

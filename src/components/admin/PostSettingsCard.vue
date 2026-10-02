<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import { POST_CATEGORIES, type Category, type MediaImage, type PostCategory } from '@/types'

// Datos de clasificación del artículo: tema del blog, categoría del
// escaparate a la que invita, autor y portada.
defineProps<{ categories: Category[] }>()
const category = defineModel<PostCategory>('category', { required: true })
const relatedCategory = defineModel<string>('relatedCategory', { required: true })
const author = defineModel<string>('author', { required: true })
const coverImage = defineModel<MediaImage | null>('coverImage', { required: true })
</script>

<template>
  <section class="settings">
    <h2 class="settings__title">Clasificación</h2>

    <div>
      <label for="post-category">Tema del blog</label>
      <select id="post-category" v-model="category">
        <option v-for="option in POST_CATEGORIES" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <div>
      <label for="post-related">Soluciones relacionadas</label>
      <select id="post-related" v-model="relatedCategory">
        <option value="">Ninguna</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
      </select>
      <p class="settings__hint">
        Al final del artículo se invita a ver esta categoría del escaparate.
      </p>
    </div>

    <div>
      <label for="post-author">Autor</label>
      <input id="post-author" v-model="author" type="text" maxlength="120" />
    </div>

    <ImageUploader v-model="coverImage" label="Portada" />
  </section>
</template>

<style scoped lang="scss">
.settings {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.2rem;

  &__title {
    font-size: $text-base;
    font-weight: 600;
  }

  &__hint {
    margin-top: 0.35rem;
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>

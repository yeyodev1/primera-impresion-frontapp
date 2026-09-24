<script setup lang="ts">
import { toRef } from 'vue'
import AdminModal from './AdminModal.vue'
import ImageUploader from './ImageUploader.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import { ICON_SUGGESTIONS, useEntityForm } from '@/composables/admin/useEntityForm'
import type { CategoryInput } from '@/services/admin.service'
import type { Category, MediaImage } from '@/types'

const props = defineProps<{
  open: boolean
  category: Category | null
  nextOrder: number
  save: (body: CategoryInput) => Promise<boolean>
}>()
const emit = defineEmits<{ close: [] }>()

const { form, saving, error } = useEntityForm(
  toRef(props, 'open'),
  toRef(props, 'category'),
  () => ({
    name: '',
    description: '',
    icon: 'fa-solid fa-tag',
    image: null as MediaImage | null,
    order: props.nextOrder,
    isPublished: true,
  }),
  (c) => ({
    name: c.name,
    description: c.description ?? '',
    icon: c.icon || '',
    image: c.image ?? null,
    order: c.order ?? 0,
    isPublished: c.isPublished,
  }),
)

async function submit() {
  if (!form.name.trim()) {
    error.value = 'La categoría necesita un nombre'
    return
  }
  saving.value = true
  const ok = await props.save({ ...form, name: form.name.trim(), order: Number(form.order) || 0 })
  saving.value = false
  if (ok) emit('close')
}
</script>

<template>
  <AdminModal
    :open="open"
    :title="category ? 'Editar categoría' : 'Nueva categoría'"
    @close="emit('close')"
  >
    <form id="category-form" class="form" @submit.prevent="submit">
      <div>
        <label for="cat-name">Nombre</label>
        <input
          id="cat-name"
          v-model="form.name"
          type="text"
          maxlength="120"
          placeholder="Ej: Etiquetas"
        />
      </div>

      <div>
        <label for="cat-description">Descripción</label>
        <textarea
          id="cat-description"
          v-model="form.description"
          rows="3"
          placeholder="Una o dos frases que expliquen qué incluye esta familia"
        ></textarea>
      </div>

      <div>
        <label for="cat-icon">Icono</label>
        <div class="form__icon">
          <span class="form__icon-preview" aria-hidden="true"><i :class="form.icon"></i></span>
          <input id="cat-icon" v-model="form.icon" type="text" placeholder="fa-solid fa-tag" />
        </div>
        <div class="form__icons" role="group" aria-label="Iconos sugeridos">
          <button
            v-for="icon in ICON_SUGGESTIONS"
            :key="icon"
            type="button"
            class="form__icon-option"
            :class="{ 'form__icon-option--active': form.icon === icon }"
            :aria-label="icon"
            @click="form.icon = icon"
          >
            <i :class="icon"></i>
          </button>
        </div>
      </div>

      <div class="form__row">
        <div>
          <label for="cat-order">Orden en el sitio</label>
          <input id="cat-order" v-model.number="form.order" type="number" min="0" />
        </div>
        <div class="form__switch">
          <ToggleSwitch v-model="form.isPublished" label="Visible en el sitio" show-label />
        </div>
      </div>

      <ImageUploader v-model="form.image" label="Imagen de la categoría" />

      <p v-if="error" class="form__error">
        <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
      </p>
    </form>

    <template #footer>
      <button class="btn btn--ghost btn--sm" type="button" @click="emit('close')">Cancelar</button>
      <button
        class="btn btn--primary btn--sm"
        type="submit"
        form="category-form"
        :disabled="saving"
      >
        <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
        {{ category ? 'Guardar cambios' : 'Crear categoría' }}
      </button>
    </template>
  </AdminModal>
</template>

<style scoped lang="scss">
.form {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__row {
    @include flex-cards(180px, 1rem);
    align-items: flex-end;
  }

  &__switch {
    min-height: 48px;
    @include flex(row, center, flex-start);
  }

  &__icon {
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__icon-preview {
    @include flex(row, center, center);
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 1.15rem;
  }

  &__icons {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  &__icon-option {
    @include flex(row, center, center);
    width: 38px;
    height: 38px;
    border-radius: $radius-sm;
    border: 1px solid $line;
    color: $ink-soft;

    &:hover {
      border-color: $ink-muted;
    }

    &--active {
      border-color: $accent;
      background: $accent-soft;
      color: $accent-deep;
    }
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.65rem 0.85rem;
    border-radius: $radius-sm;
  }
}
</style>

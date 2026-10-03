<script setup lang="ts">
import { toRef } from 'vue'
import AdminModal from './AdminModal.vue'
import ImageUploader from './ImageUploader.vue'
import OptionChips from './OptionChips.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import { useEntityForm } from '@/composables/admin/useEntityForm'
import { refId } from '@/composables/admin/adminCopy'
import type { SolutionInput } from '@/services/admin.service'
import type { Category, MediaImage, Solution } from '@/types'

const props = defineProps<{
  open: boolean
  solution: Solution | null
  categories: Category[]
  defaultCategory: string
  save: (body: SolutionInput) => Promise<boolean>
}>()
const emit = defineEmits<{ close: [] }>()

const { form, saving, error } = useEntityForm(
  toRef(props, 'open'),
  toRef(props, 'solution'),
  () => ({
    name: '',
    categories: props.defaultCategory ? [props.defaultCategory] : ([] as string[]),
    summary: '',
    description: '',
    options: [] as string[],
    image: null as MediaImage | null,
    isFeatured: false,
    isPublished: true,
  }),
  (s) => ({
    name: s.name,
    categories: (s.categories ?? []).map(refId).filter(Boolean),
    summary: s.summary ?? '',
    description: s.description ?? '',
    options: [...(s.options ?? [])],
    image: s.image ?? null,
    isFeatured: s.isFeatured,
    isPublished: s.isPublished,
  }),
)

async function submit() {
  if (!form.name.trim()) return (error.value = 'La solución necesita un nombre')
  if (!form.categories.length) return (error.value = 'Elige al menos una categoría')
  error.value = ''
  saving.value = true
  const ok = await props.save({ ...form, name: form.name.trim() })
  saving.value = false
  if (ok) emit('close')
}
</script>

<template>
  <AdminModal
    :open="open"
    :title="solution ? 'Editar solución' : 'Nueva solución'"
    wide
    @close="emit('close')"
  >
    <form id="solution-form" class="form" @submit.prevent="submit">
      <div>
        <label for="sol-name">Nombre</label>
        <input
          id="sol-name"
          v-model="form.name"
          type="text"
          maxlength="120"
          placeholder="Ej: Etiquetas de papel"
        />
      </div>

      <fieldset class="form__cats">
        <legend>Categorías <small>(puede estar en varias; la primera marcada es la principal)</small></legend>
        <div class="form__cats-list">
          <label
            v-for="cat in categories"
            :key="cat._id"
            class="form__cat"
            :class="{ 'form__cat--on': form.categories.includes(cat._id) }"
          >
            <input v-model="form.categories" type="checkbox" :value="cat._id" />
            {{ cat.name }}
          </label>
        </div>
      </fieldset>

      <div>
        <label for="sol-summary">Resumen</label>
        <input
          id="sol-summary"
          v-model="form.summary"
          type="text"
          maxlength="200"
          placeholder="Una línea que se ve en la tarjeta del escaparate"
        />
      </div>

      <div>
        <label for="sol-description">Descripción</label>
        <textarea
          id="sol-description"
          v-model="form.description"
          rows="4"
          placeholder="Para qué sirve, materiales, acabados, usos típicos…"
        ></textarea>
      </div>

      <OptionChips
        id="sol-options"
        v-model="form.options"
        label="Opciones y acabados"
        placeholder="Ej: Papel couché, Troquelado…"
      />

      <div class="form__switches">
        <ToggleSwitch v-model="form.isPublished" label="Visible en el sitio" show-label />
        <ToggleSwitch v-model="form.isFeatured" label="Destacada en el inicio" show-label />
      </div>

      <ImageUploader v-model="form.image" label="Imagen de la solución" />

      <p v-if="error" class="form__error">
        <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
      </p>
    </form>

    <template #footer>
      <button class="btn btn--ghost btn--sm" type="button" @click="emit('close')">Cancelar</button>
      <button
        class="btn btn--primary btn--sm"
        type="submit"
        form="solution-form"
        :disabled="saving"
      >
        <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
        {{ solution ? 'Guardar cambios' : 'Crear solución' }}
      </button>
    </template>
  </AdminModal>
</template>

<style scoped lang="scss">
.form {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__row {
    @include flex-cards(220px, 1rem);
  }

  &__cats {
    border: none;
    padding: 0;
    margin: 0;

    legend {
      padding: 0;
      margin-bottom: 0.45rem;
      font-size: 0.82rem;
      font-weight: 500;
      color: $ink-soft;

      small {
        font-weight: 400;
        color: $ink-muted;
      }
    }
  }

  &__cats-list {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
  }

  &__cat {
    @include flex(row, center, flex-start, 0.4rem);
    margin: 0;
    padding: 0.4rem 0.75rem;
    white-space: nowrap;
    color: $ink;
    border: 1px solid $line;
    border-radius: 999px;
    font-size: $text-sm;
    cursor: pointer;
    @include transition(border-color, background);

    // Anula el estilo global de los inputs de texto (ancho completo, padding).
    input {
      width: auto;
      padding: 0;
      margin: 0;
      border: none;
      box-shadow: none;
      accent-color: $accent;
    }

    &--on {
      border-color: $accent;
      background: rgba($accent, 0.08);
    }
  }

  &__switches {
    @include flex(column, flex-start, center, 0.6rem);
    padding-top: 0.4rem;
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

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
    category: props.defaultCategory || props.categories[0]?._id || '',
    summary: '',
    description: '',
    options: [] as string[],
    image: null as MediaImage | null,
    isFeatured: false,
    isPublished: true,
    order: 0,
  }),
  (s) => ({
    name: s.name,
    category: refId(s.category),
    summary: s.summary ?? '',
    description: s.description ?? '',
    options: [...(s.options ?? [])],
    image: s.image ?? null,
    isFeatured: s.isFeatured,
    isPublished: s.isPublished,
    order: s.order ?? 0,
  }),
)

async function submit() {
  if (!form.name.trim()) return (error.value = 'La solución necesita un nombre')
  if (!form.category) return (error.value = 'Elige a qué categoría pertenece')
  error.value = ''
  saving.value = true
  const ok = await props.save({ ...form, name: form.name.trim(), order: Number(form.order) || 0 })
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
      <div class="form__row">
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
        <div>
          <label for="sol-category">Categoría</label>
          <select id="sol-category" v-model="form.category">
            <option value="" disabled>Elige una categoría</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

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

      <div class="form__row">
        <div>
          <label for="sol-order">Orden</label>
          <input id="sol-order" v-model.number="form.order" type="number" min="0" />
        </div>
        <div class="form__switches">
          <ToggleSwitch v-model="form.isPublished" label="Visible en el sitio" show-label />
          <ToggleSwitch v-model="form.isFeatured" label="Destacada en el inicio" show-label />
        </div>
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

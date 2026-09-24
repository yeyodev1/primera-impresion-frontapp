import { reactive, ref, watch, type Ref } from 'vue'

/**
 * Estado de un formulario de modal: se reinicia cada vez que se abre, a partir
 * del registro que se edita o de valores vacíos si es uno nuevo.
 */
export function useEntityForm<TForm extends object, TEntity>(
  open: Ref<boolean>,
  entity: Ref<TEntity | null | undefined>,
  empty: () => TForm,
  fromEntity: (entity: TEntity) => TForm,
) {
  const form = reactive(empty()) as TForm
  const saving = ref(false)
  const error = ref('')

  watch(
    open,
    (isOpen) => {
      if (!isOpen) return
      error.value = ''
      saving.value = false
      Object.assign(form, entity.value ? fromEntity(entity.value) : empty())
    },
    { immediate: true },
  )

  return { form, saving, error }
}

// Iconos sugeridos para categorías de imprenta: el equipo elige con un clic
// sin tener que buscar nombres de clases.
export const ICON_SUGGESTIONS = [
  'fa-solid fa-tag',
  'fa-solid fa-tags',
  'fa-solid fa-print',
  'fa-solid fa-box',
  'fa-solid fa-box-open',
  'fa-solid fa-scroll',
  'fa-solid fa-flag',
  'fa-solid fa-sign-hanging',
  'fa-solid fa-file-lines',
  'fa-solid fa-book-open',
  'fa-solid fa-id-card',
  'fa-solid fa-shirt',
  'fa-solid fa-mug-hot',
  'fa-solid fa-palette',
  'fa-solid fa-stamp',
  'fa-solid fa-envelope-open-text',
]

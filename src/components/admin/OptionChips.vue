<script setup lang="ts">
import { ref } from 'vue'

// Lista editable de chips: se escribe y Enter (o coma) agrega; la x quita.
const props = defineProps<{
  modelValue: string[]
  label: string
  placeholder?: string
  id: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

const draft = ref('')

function add() {
  const values = draft.value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v && !props.modelValue.some((o) => o.toLowerCase() === v.toLowerCase()))
  if (values.length) emit('update:modelValue', [...props.modelValue, ...values])
  draft.value = ''
}

function removeAt(index: number) {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, i) => i !== index),
  )
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    add()
  } else if (event.key === 'Backspace' && !draft.value && props.modelValue.length) {
    removeAt(props.modelValue.length - 1)
  }
}
</script>

<template>
  <div class="chips">
    <label :for="id">{{ label }}</label>
    <div class="chips__box">
      <span v-for="(option, index) in modelValue" :key="option" class="chips__chip">
        {{ option }}
        <button type="button" :aria-label="`Quitar ${option}`" @click="removeAt(index)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </span>
      <input
        :id="id"
        v-model="draft"
        class="chips__input"
        type="text"
        :placeholder="placeholder"
        @keydown="onKey"
        @blur="add"
      />
    </div>
    <p class="chips__hint">Escribe una opción y presiona Enter para agregarla.</p>
  </div>
</template>

<style scoped lang="scss">
.chips {
  &__box {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    padding: 0.45rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;

    &:focus-within {
      border-color: $accent;
      box-shadow: 0 0 0 3px rgba($accent, 0.15);
    }
  }

  &__chip {
    @include flex(row, center, flex-start, 0.2rem);
    font-size: $text-sm;
    background: $sand;
    border-radius: $radius-pill;
    padding: 0.2rem 0.3rem 0.2rem 0.75rem;

    button {
      @include flex(row, center, center);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 0.75rem;
      color: $ink-muted;

      &:hover {
        background: $line;
        color: $ink;
      }
    }
  }

  &__input {
    flex: 1 1 140px;
    width: auto;
    border: none;
    padding: 0.35rem 0.4rem;

    &:focus {
      box-shadow: none;
    }
  }

  &__hint {
    margin-top: 0.35rem;
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>

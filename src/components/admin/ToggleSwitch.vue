<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; showLabel?: boolean; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <label class="toggle" :class="{ 'toggle--on': modelValue, 'toggle--disabled': disabled }">
    <input
      class="visually-hidden"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="disabled"
      :aria-label="label"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="toggle__track" aria-hidden="true"><span class="toggle__thumb"></span></span>
    <span v-if="showLabel" class="toggle__label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0;
  cursor: pointer;
  font-size: $text-sm;
  color: $ink;

  &__track {
    position: relative;
    width: 40px;
    height: 24px;
    flex-shrink: 0;
    border-radius: $radius-pill;
    background: $line;
    @include transition(background);
  }

  &__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    @include transition(transform);
  }

  &--on &__track {
    background: $success;
  }

  &--on &__thumb {
    transform: translateX(16px);
  }

  input:focus-visible + &__track {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

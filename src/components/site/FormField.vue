<script setup lang="ts">
import { copy } from '@/config/site'

// Campo como renglón de una ficha técnica: número mono (contador CSS que
// reinicia LeadFormShell), etiqueta, control a línea con un filete naranja
// que se imprime de izquierda a derecha al enfocar y error con icono. Los ids
// quedan enlazados para lectores de pantalla (slot con describedby/invalid).
//
// Tono: sobre fondos oscuros, el padre puede redefinir --field-ink,
// --field-line, --field-label y --field-muted.
defineProps<{ id: string; label: string; required?: boolean; error?: string }>()
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label :for="id" class="field__label">
      <span class="field__n" aria-hidden="true"></span>
      {{ label }}
      <span v-if="required" class="field__req" :title="copy.forms.requiredHint">*</span>
    </label>
    <div class="field__control">
      <slot :describedby="error ? `${id}-error` : undefined" :invalid="Boolean(error)" />
      <span class="field__ink" aria-hidden="true"></span>
    </div>
    <Transition name="field-err">
      <p v-if="error" :id="`${id}-error`" class="field__error">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
        {{ error }}
      </p>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.field {
  counter-increment: lfield;
  @include flex(column, stretch, flex-start);

  &__label {
    @include flex(row, center, flex-start, 0.55rem);
    margin: 0 0 0.15rem;
    @include mono-label(0.64rem, 0.14em);
    color: var(--field-label, #{$ink-soft});
    transition: color 0.3s ease;
  }

  // Número del renglón; se entinta cuando el campo ya tiene contenido.
  &__n::before {
    content: counter(lfield, decimal-leading-zero);
    display: inline-block;
    padding: 0.12rem 0.3rem;
    border: 1px solid currentColor;
    border-radius: 2px;
    font-size: 0.56rem;
    line-height: 1.2;
    transition:
      background-color 0.3s ease,
      color 0.3s ease,
      border-color 0.3s ease;
  }

  &:has(input:not(:placeholder-shown)) &__n::before,
  &:has(textarea:not(:placeholder-shown)) &__n::before,
  &:has(select:valid) &__n::before {
    background: $accent;
    border-color: $accent;
    color: $night;
  }

  &__req {
    color: darken($accent-deep, 4%);
  }

  &__control {
    position: relative;
  }

  :slotted(input),
  :slotted(select),
  :slotted(textarea) {
    width: 100%;
    padding: 0.7rem 0 0.65rem;
    border: 0;
    border-bottom: 1px solid var(--field-line, #{rgba($ink, 0.24)});
    border-radius: 0;
    background-color: transparent;
    box-shadow: none;
    color: var(--field-ink, #{$ink});
    font-family: $font-principal;
    font-size: clamp(1.05rem, 1rem + 0.3vw, 1.2rem);
    font-weight: 500;
  }

  :slotted(input)::placeholder,
  :slotted(textarea)::placeholder {
    color: var(--field-muted, #{$ink-muted});
    opacity: 0.75;
    font-weight: 400;
  }

  // El foco lo marca el filete naranja de 2 px (y la etiqueta en naranja).
  :slotted(input:focus),
  :slotted(select:focus),
  :slotted(textarea:focus) {
    outline: none;
    box-shadow: none;
    border-color: var(--field-line, #{rgba($ink, 0.24)});
  }

  :slotted(select) {
    appearance: none;
    cursor: pointer;
    padding-right: 2rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%23b8471a' stroke-width='1.6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.25rem center;
    background-size: 0.8rem;
  }

  // Área de texto como hoja rayada.
  :slotted(textarea) {
    line-height: 2rem;
    padding-top: 0.2rem;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent calc(2rem - 1px),
      rgba($ink, 0.08) calc(2rem - 1px),
      rgba($ink, 0.08) 2rem
    );
    background-attachment: local;
  }

  // Filete de tinta: se imprime al enfocar, se queda rojo si hay error.
  &__ink {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: $accent;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.55s $ease;
    pointer-events: none;
  }

  &:focus-within &__ink {
    transform: scaleX(1);
  }

  &:focus-within &__label {
    color: darken($accent-deep, 4%);
  }

  &--error &__ink {
    background: $danger;
    transform: scaleX(1);
  }

  &--error &__label {
    color: darken($danger, 10%);
  }

  &__error {
    @include flex(row, center, flex-start, 0.4rem);
    margin-top: 0.45rem;
    font-size: $text-xs;
    font-weight: 600;
    color: darken($danger, 10%);
  }
}

.field-err-enter-active {
  animation: field-shake 0.4s $ease;
}

.field-err-leave-active {
  transition: opacity 0.2s ease;
}

.field-err-leave-to {
  opacity: 0;
}

@keyframes field-shake {
  0% {
    opacity: 0;
    transform: translateX(-6px);
  }
  40% {
    opacity: 1;
    transform: translateX(4px);
  }
  70% {
    transform: translateX(-2px);
  }
  100% {
    transform: none;
  }
}
</style>

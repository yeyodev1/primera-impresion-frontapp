<script setup lang="ts">
import { site, copy, fxCatalog } from '@/config/site'
import MagneticButton from '@/components/fx/MagneticButton.vue'

// Marco común de los formularios: campos numerados como una ficha técnica
// (slot), consentimiento con casilla propia, campo trampa invisible y botón
// de envío magnético. El estado vive en useLeadForm.
const props = defineProps<{
  idPrefix: string
  submitLabel: string
  loading: boolean
  consentError?: string
}>()
defineEmits<{ submit: [] }>()

const consent = defineModel<boolean>('consent', { required: true })
const website = defineModel<string>('website', { required: true })
const consentId = `${props.idPrefix}-consent`
</script>

<template>
  <form class="lform" novalidate :aria-busy="loading" @submit.prevent="$emit('submit')">
    <div class="lform__fields">
      <slot />
    </div>

    <!-- Trampa para bots: fuera de pantalla y fuera del orden de tabulación. -->
    <div class="lform__trap" aria-hidden="true">
      <label :for="`${idPrefix}-website`">{{ copy.forms.honeypot }}</label>
      <input
        :id="`${idPrefix}-website`"
        v-model="website"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div class="lform__consent" :class="{ 'lform__consent--error': consentError }">
      <input
        :id="consentId"
        v-model="consent"
        type="checkbox"
        class="lform__check"
        :aria-invalid="Boolean(consentError)"
        :aria-describedby="consentError ? `${consentId}-error` : undefined"
      />
      <label :for="consentId">{{ site.forms.consentContact }}</label>
    </div>
    <p v-if="consentError" :id="`${consentId}-error`" class="lform__error">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      {{ consentError }}
    </p>

    <div class="lform__foot">
      <p class="lform__hint" aria-hidden="true"><span>*</span> {{ fxCatalog.forms.required }}</p>
      <MagneticButton class="lform__submit" :strength="0.25">
        <button type="submit" class="btn btn--primary btn--press" :disabled="loading">
          <template v-if="loading">
            <i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
            {{ site.forms.sending }}
          </template>
          <template v-else>
            {{ submitLabel }}
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </template>
        </button>
      </MagneticButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.lform {
  @include flex(column, stretch, flex-start, 1.5rem);

  // Los campos se numeran solos (contador que usa FormField).
  &__fields {
    counter-reset: lfield;
    @include flex-cards(240px, 1.9rem 1.75rem);
  }

  &__trap {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  &__consent {
    @include flex(row, flex-start, flex-start, 0.8rem);
    margin-top: 0.5rem;

    label {
      margin: 0;
      font-size: $text-sm;
      font-weight: 400;
      line-height: 1.5;
      color: var(--field-label, #{$ink-soft});
      cursor: pointer;
    }
  }

  // Casilla como marca de registro: cuadro de tinta que se llena con un visto.
  &__check {
    appearance: none;
    position: relative;
    flex-shrink: 0;
    width: 1.35rem;
    height: 1.35rem;
    margin-top: 0.05rem;
    padding: 0;
    border: 1.5px solid var(--field-ink, #{$ink});
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    transition:
      background-color 0.25s ease,
      border-color 0.25s ease;

    &::after {
      content: '';
      position: absolute;
      left: 0.38rem;
      top: 0.12rem;
      width: 0.36rem;
      height: 0.7rem;
      border: solid $surface;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg) scale(0);
      transition: transform 0.3s $ease;
    }

    &:checked {
      background: $accent-deep;
      border-color: $accent-deep;

      &::after {
        transform: rotate(45deg) scale(1);
      }
    }

    &:focus {
      box-shadow: none;
    }

    &:focus-visible {
      outline: 2px solid $accent;
      outline-offset: 3px;
    }
  }

  &__consent--error &__check {
    border-color: $danger;
  }

  &__error {
    @include flex(row, center, flex-start, 0.4rem);
    margin-top: -0.9rem;
    font-size: $text-xs;
    font-weight: 600;
    color: darken($danger, 10%);
  }

  &__foot {
    @include flex(column-reverse, stretch, flex-start, 1rem);
    padding-top: 0.5rem;

    @include from('sm') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__hint {
    @include mono-label(0.6rem, 0.16em);
    color: var(--field-muted, #{$ink-muted});

    span {
      color: darken($accent-deep, 4%);
    }
  }

  &__submit {
    :deep(.btn) {
      width: 100%;
    }

    @include until('sm') {
      display: flex;

      > :deep(*) {
        flex: 1;
      }
    }
  }
}
</style>

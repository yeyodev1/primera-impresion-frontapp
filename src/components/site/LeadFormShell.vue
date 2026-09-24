<script setup lang="ts">
import { site, copy } from '@/config/site'

// Marco común de los formularios: campos (slot), consentimiento, campo
// trampa invisible y botón de envío. El estado vive en useLeadForm.
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
      <input :id="`${idPrefix}-website`" v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" />
    </div>

    <div class="lform__consent" :class="{ 'lform__consent--error': consentError }">
      <input
        :id="consentId"
        v-model="consent"
        type="checkbox"
        :aria-invalid="Boolean(consentError)"
        :aria-describedby="consentError ? `${consentId}-error` : undefined"
      />
      <label :for="consentId">{{ site.forms.consentContact }}</label>
    </div>
    <p v-if="consentError" :id="`${consentId}-error`" class="lform__error">{{ consentError }}</p>

    <button type="submit" class="btn btn--primary lform__submit" :disabled="loading">
      <template v-if="loading">
        <i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
        {{ site.forms.sending }}
      </template>
      <template v-else>
        {{ submitLabel }}
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </template>
    </button>
  </form>
</template>

<style scoped lang="scss">
.lform {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__fields {
    @include flex-cards(240px, 1rem 1.1rem);
  }

  &__trap {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  &__consent {
    @include flex(row, flex-start, flex-start, 0.65rem);

    input {
      width: 1.15rem;
      height: 1.15rem;
      flex-shrink: 0;
      margin-top: 0.2rem;
      padding: 0;
      accent-color: $accent-deep;
    }

    label {
      margin: 0;
      font-size: $text-sm;
      font-weight: 400;
      color: $ink-soft;
    }

    &--error label {
      color: $ink;
    }
  }

  &__error {
    margin-top: -0.6rem;
    font-size: $text-xs;
    font-weight: 600;
    color: darken($danger, 8%);
  }

  &__submit {
    align-self: flex-start;
    width: 100%;

    @include from('sm') {
      width: auto;
    }
  }
}
</style>

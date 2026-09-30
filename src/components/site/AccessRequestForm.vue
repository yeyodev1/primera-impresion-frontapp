<script setup lang="ts">
import { site, copy } from '@/config/site'
import { useLeadForm } from '@/composables/useLeadForm'
import LeadFormShell from './LeadFormShell.vue'
import FormField from './FormField.vue'
import FormSuccess from './FormSuccess.vue'
import { COUNTRIES, sanitizePhoneInput } from '@/utils/phone'

const { form, errors, loading, sent, submit, reset } = useLeadForm('access', site.autogestion.success)
const f = copy.forms

// Solo caracteres de teléfono; se corrige también el campo si se colaron otros.
function onPhone(event: Event) {
  const input = event.target as HTMLInputElement
  form.phone = sanitizePhoneInput(input.value)
  if (input.value !== form.phone) input.value = form.phone
}
</script>

<template>
  <FormSuccess v-if="sent" :message="site.autogestion.success" @again="reset" />
  <LeadFormShell
    v-else
    v-model:consent="form.consent"
    v-model:website="form.website"
    id-prefix="access"
    :submit-label="site.autogestion.submit"
    :loading="loading"
    :consent-error="errors.consent"
    @submit="submit"
  >
    <FormField id="access-name" :label="f.name" required :error="errors.name" v-slot="{ describedby, invalid }">
      <input id="access-name" v-model="form.name" autocomplete="name" :placeholder="f.placeholders.name" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="access-company" :label="f.company" required :error="errors.company" v-slot="{ describedby, invalid }">
      <input id="access-company" v-model="form.company" autocomplete="organization" :placeholder="f.placeholders.company" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="access-role" :label="f.role" required :error="errors.role" v-slot="{ describedby, invalid }">
      <input id="access-role" v-model="form.role" autocomplete="organization-title" :placeholder="f.placeholders.role" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="access-email" :label="f.email" required :error="errors.email" v-slot="{ describedby, invalid }">
      <input id="access-email" v-model="form.email" type="email" autocomplete="email" inputmode="email" :placeholder="f.placeholders.email" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="access-phone" :label="f.whatsapp" required :error="errors.phone" v-slot="{ describedby, invalid }">
      <div class="phone">
        <select v-model="form.phoneCountry" class="phone__country" :aria-label="f.phoneCountry">
          <option v-for="c in COUNTRIES" :key="c.code" :value="c.code" :title="c.name">{{ c.code }} +{{ c.dial }}</option>
        </select>
        <input id="access-phone" :value="form.phone" type="tel" autocomplete="tel-national" inputmode="tel" :placeholder="f.placeholders.phone" :aria-describedby="describedby" :aria-invalid="invalid" required @input="onPhone" />
      </div>
    </FormField>
    <FormField id="access-frequency" :label="f.frequency" required :error="errors.frequency" v-slot="{ describedby, invalid }">
      <select id="access-frequency" v-model="form.frequency" :aria-describedby="describedby" :aria-invalid="invalid" required>
        <option value="" disabled>{{ f.select }}</option>
        <option v-for="option in site.autogestion.frequencies" :key="option" :value="option">{{ option }}</option>
      </select>
    </FormField>
    <FormField id="access-products" class="field--wide" :label="f.products" required :error="errors.products" v-slot="{ describedby, invalid }">
      <textarea id="access-products" v-model="form.products" rows="4" :placeholder="f.placeholders.products" :aria-describedby="describedby" :aria-invalid="invalid" required></textarea>
    </FormField>
  </LeadFormShell>
</template>

<style scoped lang="scss">
// Prefijo del país pegado al número, sobre el mismo renglón del campo.
.phone {
  display: flex;
  align-items: stretch;
  gap: 0.75rem;

  &__country {
    flex: 0 0 auto;
    width: auto !important;
  }

  input {
    flex: 1;
    min-width: 0;
  }
}

:deep(.field--wide) {
  flex-basis: 100% !important;
}

textarea {
  resize: vertical;
  min-height: 7rem;
}
</style>

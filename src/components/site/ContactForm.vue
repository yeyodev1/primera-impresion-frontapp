<script setup lang="ts">
import { site, copy } from '@/config/site'
import { useLeadForm } from '@/composables/useLeadForm'
import LeadFormShell from './LeadFormShell.vue'
import FormField from './FormField.vue'
import FormSuccess from './FormSuccess.vue'

const { form, errors, loading, sent, submit, reset } = useLeadForm('contact', site.contact.success)
const f = copy.forms
</script>

<template>
  <FormSuccess v-if="sent" :message="site.contact.success" @again="reset" />
  <LeadFormShell
    v-else
    v-model:consent="form.consent"
    v-model:website="form.website"
    id-prefix="contact"
    :submit-label="site.contact.submit"
    :loading="loading"
    :consent-error="errors.consent"
    @submit="submit"
  >
    <FormField id="contact-name" :label="f.name" required :error="errors.name" v-slot="{ describedby, invalid }">
      <input id="contact-name" v-model="form.name" autocomplete="name" :placeholder="f.placeholders.name" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="contact-company" :label="f.company" required :error="errors.company" v-slot="{ describedby, invalid }">
      <input id="contact-company" v-model="form.company" autocomplete="organization" :placeholder="f.placeholders.company" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="contact-email" :label="f.email" required :error="errors.email" v-slot="{ describedby, invalid }">
      <input id="contact-email" v-model="form.email" type="email" autocomplete="email" inputmode="email" :placeholder="f.placeholders.email" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="contact-phone" :label="f.phone" required :error="errors.phone" v-slot="{ describedby, invalid }">
      <input id="contact-phone" v-model="form.phone" type="tel" autocomplete="tel" inputmode="tel" :placeholder="f.placeholders.phone" :aria-describedby="describedby" :aria-invalid="invalid" required />
    </FormField>
    <FormField id="contact-message" class="field--wide" :label="f.message" required :error="errors.message" v-slot="{ describedby, invalid }">
      <textarea id="contact-message" v-model="form.message" rows="5" :placeholder="f.placeholders.message" :aria-describedby="describedby" :aria-invalid="invalid" required></textarea>
    </FormField>
  </LeadFormShell>
</template>

<style scoped lang="scss">
// Los campos largos ocupan la fila entera en la "grilla" flex.
:deep(.field--wide) {
  flex-basis: 100% !important;
}

textarea {
  resize: vertical;
  min-height: 8rem;
}
</style>

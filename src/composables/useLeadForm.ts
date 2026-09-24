import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { leadService } from '@/services/lead.service'
import { useToastStore } from '@/stores/toast'
import { site, copy } from '@/config/site'
import type { ApiError, LeadType } from '@/types'

type Field = 'name' | 'company' | 'email' | 'phone' | 'role' | 'products' | 'frequency' | 'message' | 'consent'

const REQUIRED: Record<LeadType, Field[]> = {
  contact: ['name', 'company', 'email', 'phone', 'message', 'consent'],
  access: ['name', 'company', 'role', 'email', 'phone', 'products', 'frequency', 'consent'],
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Estado y envío de los formularios de contacto y de solicitud de acceso.
 *
 * El antispam no molesta a la persona: un campo trampa (`website`) que solo
 * un bot llena y el tiempo desde que se montó el formulario.
 */
export function useLeadForm(type: LeadType, successMessage: string) {
  const route = useRoute()
  const toast = useToastStore()

  const form = reactive({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: '',
    products: '',
    frequency: '',
    message: '',
    consent: false,
    website: '',
  })
  const errors = reactive<Partial<Record<Field, string>>>({})
  const loading = ref(false)
  const sent = ref(false)
  let mountedAt = Date.now()

  onMounted(() => {
    mountedAt = Date.now()
  })

  const required = computed(() => REQUIRED[type])

  function validate(): boolean {
    for (const key of Object.keys(errors) as Field[]) delete errors[key]

    for (const field of required.value) {
      const value = form[field]
      if (field === 'consent') {
        if (!value) errors.consent = copy.forms.consentRequired
      } else if (!String(value).trim()) {
        errors[field] = site.forms.required
      }
    }
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) errors.email = copy.forms.invalidEmail

    return Object.keys(errors).length === 0
  }

  async function submit() {
    if (loading.value) return
    if (!validate()) {
      toast.error(site.forms.required)
      return
    }

    loading.value = true
    try {
      await leadService.create({
        type,
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        ...(type === 'access'
          ? { role: form.role.trim(), products: form.products.trim(), frequency: form.frequency }
          : { message: form.message.trim() }),
        source: route.fullPath,
        consent: form.consent,
        website: form.website,
        elapsedMs: Date.now() - mountedAt,
      })
      sent.value = true
      toast.success(successMessage)
    } catch (error) {
      toast.error((error as ApiError).message || copy.forms.error)
    } finally {
      loading.value = false
    }
  }

  function reset() {
    Object.assign(form, { name: '', company: '', email: '', phone: '', role: '', products: '', frequency: '', message: '', consent: false, website: '' })
    mountedAt = Date.now()
    sent.value = false
  }

  function isRequired(field: Field) {
    return required.value.includes(field)
  }

  return { form, errors, loading, sent, submit, reset, isRequired }
}

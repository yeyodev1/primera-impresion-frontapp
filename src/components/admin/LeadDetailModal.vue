<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AdminModal from './AdminModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { useConfirm } from '@/composables/admin/useConfirm'
import { LEAD_STATUS, LEAD_TYPE, formatDateTime, whatsappLink } from '@/composables/admin/adminCopy'
import type { Lead, LeadStatus } from '@/types'

const props = defineProps<{
  lead: Lead | null
  update: (lead: Lead, body: { status?: LeadStatus; notes?: string }) => Promise<Lead | null>
  remove: (lead: Lead) => Promise<boolean>
}>()
const emit = defineEmits<{ close: [] }>()

const current = ref<Lead | null>(null)
const notes = ref('')
const busy = ref(false)
const confirm = useConfirm()

watch(
  () => props.lead,
  (lead) => {
    current.value = lead
    notes.value = lead?.notes ?? ''
  },
  { immediate: true },
)

const statuses = Object.entries(LEAD_STATUS) as Array<[LeadStatus, string]>

const details = computed(() => {
  const l = current.value
  if (!l) return []
  return [
    { label: 'Correo', value: l.email },
    { label: 'Teléfono', value: l.phone },
    { label: 'Cargo', value: l.role },
    { label: 'Productos que necesita', value: l.products },
    { label: 'Frecuencia de compra', value: l.frequency },
    { label: 'Mensaje', value: l.message },
    { label: 'Enviado desde', value: l.source },
  ].filter((d) => d.value)
})

const mailto = computed(() => {
  const l = current.value
  if (!l) return ''
  const subject = encodeURIComponent('Tu solicitud a Primera Impresión')
  const body = encodeURIComponent(`Hola ${l.name.split(' ')[0]},\n\n`)
  return `mailto:${l.email}?subject=${subject}&body=${body}`
})

async function setStatus(status: LeadStatus) {
  if (!current.value || current.value.status === status) return
  busy.value = true
  const updated = await props.update(current.value, { status })
  if (updated) current.value = updated
  busy.value = false
}

async function saveNotes() {
  if (!current.value) return
  busy.value = true
  const updated = await props.update(current.value, { notes: notes.value })
  if (updated) current.value = updated
  busy.value = false
}

async function askRemove() {
  if (!current.value) return
  const ok = await confirm.ask({
    title: '¿Eliminar esta solicitud?',
    message: 'Se borra para siempre del panel. Esta acción no se puede deshacer.',
    danger: true,
  })
  if (ok && (await props.remove(current.value))) emit('close')
}
</script>

<template>
  <AdminModal
    :open="Boolean(lead)"
    :title="current?.name ?? 'Solicitud'"
    wide
    @close="emit('close')"
  >
    <div v-if="current" class="detail">
      <p class="detail__sub">
        {{ current.company }} · {{ LEAD_TYPE[current.type] }} ·
        {{ formatDateTime(current.createdAt) }}
      </p>

      <div class="detail__contact">
        <a
          class="btn btn--primary btn--sm"
          :href="whatsappLink(current.phone)"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
        <a class="btn btn--ghost btn--sm" :href="mailto">
          <i class="fa-regular fa-envelope"></i> Responder por correo
        </a>
      </div>

      <dl class="detail__list">
        <div v-for="item in details" :key="item.label" class="detail__item">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>

      <fieldset class="detail__status" :disabled="busy">
        <legend>Estado</legend>
        <div class="detail__segments">
          <button
            v-for="[value, label] in statuses"
            :key="value"
            type="button"
            class="detail__segment"
            :class="{ 'detail__segment--active': current.status === value }"
            :aria-pressed="current.status === value"
            @click="setStatus(value)"
          >
            {{ label }}
          </button>
        </div>
      </fieldset>

      <div>
        <label for="lead-notes">Notas internas</label>
        <textarea
          id="lead-notes"
          v-model="notes"
          rows="3"
          placeholder="Solo las ve el equipo: a quién se asignó, qué se cotizó…"
        ></textarea>
        <button
          class="btn btn--dark btn--sm detail__save"
          type="button"
          :disabled="busy || notes === (current.notes ?? '')"
          @click="saveNotes"
        >
          Guardar notas
        </button>
      </div>
    </div>

    <template #footer>
      <button class="detail__delete" type="button" @click="askRemove">
        <i class="fa-solid fa-trash-can"></i> Eliminar solicitud
      </button>
    </template>
  </AdminModal>

  <ConfirmDialog v-bind="confirm.state" @confirm="confirm.confirm" @cancel="confirm.cancel" />
</template>

<style scoped lang="scss">
.detail {
  @include flex(column, stretch, flex-start, 1.2rem);

  &__sub {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: -0.4rem;
  }

  &__contact {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__list {
    @include flex-cards(220px, 0.9rem 1.2rem);
  }

  &__item {
    dt {
      font-size: $text-xs;
      color: $ink-muted;
    }

    dd {
      font-size: $text-sm;
      white-space: pre-line;
      overflow-wrap: anywhere;
    }
  }

  &__status {
    border: none;

    legend {
      font-size: 0.82rem;
      font-weight: 500;
      color: $ink-soft;
      margin-bottom: 0.35rem;
    }
  }

  &__segments {
    @include flex(row, stretch, flex-start);
    border: 1px solid $line;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  &__segment {
    flex: 1;
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;

    & + & {
      border-left: 1px solid $line;
    }

    &--active {
      background: $night;
      color: $surface;
    }
  }

  &__save {
    margin-top: 0.5rem;
  }

  &__delete {
    margin-right: auto;
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
    min-height: 40px;
    padding: 0.5rem 0.75rem;
    border-radius: $radius-sm;

    &:hover {
      background: $danger-bg;
    }
  }
}
</style>

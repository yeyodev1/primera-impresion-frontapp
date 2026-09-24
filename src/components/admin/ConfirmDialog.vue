<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'

// Confirmación del panel sobre BaseModal; se alimenta con useConfirm().
defineProps<{
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  danger?: boolean
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <BaseModal
    :open="open"
    :title="title"
    :message="message"
    :confirm-label="confirmLabel || (danger ? 'Eliminar' : 'Confirmar')"
    cancel-label="Cancelar"
    :danger="danger"
    @confirm="emit('confirm')"
    @cancel="emit('cancel')"
  />
</template>

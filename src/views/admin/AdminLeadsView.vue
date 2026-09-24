<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import LeadCard from '@/components/admin/LeadCard.vue'
import LeadDetailModal from '@/components/admin/LeadDetailModal.vue'
import { useAdminLeads } from '@/composables/admin/useAdminLeads'
import { LEAD_STATUS, LEAD_TYPE } from '@/composables/admin/adminCopy'
import type { Lead } from '@/types'

const { leads, total, pages, loading, filters, load, update, remove } = useAdminLeads(20)
const selected = ref<Lead | null>(null)

const typeOptions = [
  { value: '', label: 'Todos los tipos' },
  ...Object.entries(LEAD_TYPE).map(([value, label]) => ({ value, label })),
]
const statusOptions = [
  { value: '', label: 'Todos' },
  ...Object.entries(LEAD_STATUS).map(([value, label]) => ({ value, label })),
]

onMounted(load)
</script>

<template>
  <div class="leads">
    <AdminPageHead
      title="Solicitudes"
      description="Lo que llega desde los formularios de contacto y de solicitud de acceso al Portal."
    />

    <div class="leads__filters">
      <div class="leads__type">
        <label for="lead-type">Tipo</label>
        <select id="lead-type" v-model="filters.type">
          <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
      <div class="leads__status" role="group" aria-label="Filtrar por estado">
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          type="button"
          class="leads__chip"
          :class="{ 'leads__chip--active': filters.status === opt.value }"
          :aria-pressed="filters.status === opt.value"
          @click="filters.status = opt.value as typeof filters.status"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <p class="leads__count">
      <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
      {{ total }} {{ total === 1 ? 'solicitud' : 'solicitudes' }}
    </p>

    <div v-if="leads.length" class="leads__list" :class="{ 'leads__list--loading': loading }">
      <LeadCard v-for="lead in leads" :key="lead._id" :lead="lead" @open="selected = $event" />
    </div>
    <p v-else-if="!loading" class="leads__empty">
      <i class="fa-regular fa-folder-open"></i>
      No hay solicitudes con estos filtros.
    </p>

    <AdminPagination v-model:page="filters.page" :pages="pages" :total="total" />

    <LeadDetailModal :lead="selected" :update="update" :remove="remove" @close="selected = null" />
  </div>
</template>

<style scoped lang="scss">
.leads {
  &__filters {
    @include flex(column, stretch, flex-start, 1rem);
    margin-bottom: 1rem;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__type {
    @include from('md') {
      width: 240px;
    }
  }

  &__status {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__chip {
    min-height: 40px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;

    &:hover {
      border-color: $ink-muted;
    }

    &--active {
      background: $night;
      border-color: $night;
      color: $surface;
    }
  }

  &__count {
    font-size: $text-sm;
    color: $ink-muted;
    margin-bottom: 0.75rem;
  }

  &__list {
    @include flex-cards(320px, 0.75rem);
    @include transition(opacity);

    &--loading {
      opacity: 0.6;
    }
  }

  &__empty {
    @include card;
    @include flex(column, center, center, 0.5rem);
    padding: 3rem 1rem;
    color: $ink-muted;
    font-size: $text-sm;
    text-align: center;

    i {
      font-size: 1.5rem;
    }
  }
}
</style>

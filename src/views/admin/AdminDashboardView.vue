<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import StatCard from '@/components/admin/StatCard.vue'
import LeadCard from '@/components/admin/LeadCard.vue'
import LeadDetailModal from '@/components/admin/LeadDetailModal.vue'
import { useAdminStats } from '@/composables/admin/useAdminStats'
import { useAdminLeads } from '@/composables/admin/useAdminLeads'
import { useUserStore } from '@/stores/user'
import type { Lead } from '@/types'

const userStore = useUserStore()
// Las cifras las refresca AdminLayout en cada cambio de sección.
const { stats } = useAdminStats()
const { leads, loading, load, update, remove } = useAdminLeads(5)
const selected = ref<Lead | null>(null)

const firstName = computed(() => userStore.user?.name || '')

const cards = computed(() => {
  const s = stats.value
  return [
    {
      label: 'Solicitudes nuevas',
      value: s?.leads.new ?? '–',
      hint: s ? `${s.leads.total} en total` : '',
      icon: 'fa-solid fa-inbox',
      to: '/admin/solicitudes',
      highlight: Boolean(s?.leads.new),
    },
    {
      label: 'Solicitudes de acceso',
      value: s?.leads.access ?? '–',
      hint: s ? `${s.leads.contact} de contacto` : '',
      icon: 'fa-solid fa-key',
      to: '/admin/solicitudes',
    },
    {
      label: 'Soluciones',
      value: s?.solutions ?? '–',
      hint: s ? `en ${s.categories} categorías` : '',
      icon: 'fa-solid fa-boxes-stacked',
      to: '/admin/soluciones',
    },
    {
      label: 'Artículos publicados',
      value: s?.posts.published ?? '–',
      hint: s ? `${s.posts.total - s.posts.published} en borrador` : '',
      icon: 'fa-solid fa-newspaper',
      to: '/admin/blog',
    },
  ]
})

const shortcuts = [
  {
    label: 'Escribir un artículo',
    text: 'Publica en el blog con su vista previa en Google.',
    icon: 'fa-solid fa-pen-nib',
    to: '/admin/blog/nuevo',
  },
  {
    label: 'Revisar solicitudes',
    text: 'Responde por WhatsApp o correo y marca el avance.',
    icon: 'fa-solid fa-inbox',
    to: '/admin/solicitudes',
  },
  {
    label: 'Editar el escaparate',
    text: 'Categorías y soluciones que se ven en el sitio.',
    icon: 'fa-solid fa-store',
    to: '/admin/soluciones',
  },
]

onMounted(load)
</script>

<template>
  <div class="dash">
    <AdminPageHead
      :eyebrow="firstName ? `Hola, ${firstName}` : 'Panel'"
      title="Resumen"
      description="Lo que llegó desde el sitio y el estado del contenido publicado."
    />

    <section class="dash__stats">
      <StatCard v-for="card in cards" :key="card.label" v-bind="card" />
    </section>

    <div class="dash__columns">
      <section class="dash__block dash__block--leads">
        <header class="dash__block-head">
          <h2>Últimas solicitudes</h2>
          <RouterLink to="/admin/solicitudes" class="dash__more">
            Ver todas <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </header>
        <p v-if="loading && !leads.length" class="dash__empty">
          <i class="fa-solid fa-spinner fa-spin"></i> Cargando…
        </p>
        <p v-else-if="!leads.length" class="dash__empty">
          Todavía no llegan solicitudes desde los formularios del sitio.
        </p>
        <div v-else class="dash__leads">
          <LeadCard
            v-for="lead in leads"
            :key="lead._id"
            :lead="lead"
            compact
            @open="selected = $event"
          />
        </div>
      </section>

      <section class="dash__block">
        <header class="dash__block-head">
          <h2>Accesos rápidos</h2>
        </header>
        <div class="dash__shortcuts">
          <RouterLink v-for="item in shortcuts" :key="item.to" :to="item.to" class="dash__shortcut">
            <span class="dash__shortcut-icon"><i :class="item.icon"></i></span>
            <span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.text }}</small>
            </span>
          </RouterLink>
        </div>
      </section>
    </div>

    <LeadDetailModal :lead="selected" :update="update" :remove="remove" @close="selected = null" />
  </div>
</template>

<style scoped lang="scss">
.dash {
  &__stats {
    @include flex-cards(140px, 0.75rem);
    margin-bottom: $space-lg;

    @include from('md') {
      @include flex-cards(220px, 0.9rem);
    }
  }

  &__columns {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__block {
    flex: 1 1 0;
    min-width: 0;

    &--leads {
      @include from('lg') {
        flex: 1.6 1 0;
      }
    }
  }

  &__block-head {
    @include flex(row, center, space-between, 1rem);
    margin-bottom: 0.9rem;

    h2 {
      font-size: $text-lg;
    }
  }

  &__more {
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;

    &:hover {
      text-decoration: underline;
    }
  }

  &__leads,
  &__shortcuts {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__empty {
    @include card;
    padding: 2rem 1rem;
    text-align: center;
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__shortcut {
    @include card;
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding: 1rem 1.1rem;
    transition:
      border-color 0.25s $ease,
      box-shadow 0.25s $ease;

    &:hover {
      border-color: $ink-muted;
      box-shadow: $shadow-sm;
    }

    strong {
      display: block;
      font-weight: 600;
    }

    small {
      display: block;
      font-size: $text-sm;
      color: $ink-soft;
      line-height: 1.45;
    }
  }

  &__shortcut-icon {
    @include flex(row, center, center);
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    background: $sand;
    color: $accent-deep;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import StatCard from '@/components/admin/StatCard.vue'
import MetricsChart from '@/components/admin/MetricsChart.vue'
import MetricsBreakdown from '@/components/admin/MetricsBreakdown.vue'
import { useAdminMetrics, ecuadorDay } from '@/composables/admin/useAdminMetrics'
import { METRICS_DEVICE, METRICS_FILTER_LABEL, METRICS_PRESETS } from '@/composables/admin/adminCopy'

const { preset, filters, data, series, active, loading, error, notConnected, setPreset, setFilter } =
  useAdminMetrics()

const today = ecuadorDay(0)
const device = (value: string) => METRICS_DEVICE[value] ?? value
const referer = (value: string) => value || 'Directo o sin origen'
// Vercel manda el país como código ISO (EC, US…).
const countryNames = new Intl.DisplayNames(['es'], { type: 'region' })
const country = (code: string) => (code ? (countryNames.of(code) ?? code) : '')

const cards = computed(() => {
  const t = data.value?.totals
  const n = (v?: number) => (v === undefined ? '–' : v.toLocaleString('es-EC'))
  return [
    { label: 'Páginas vistas', value: n(t?.pageviews), icon: 'fa-solid fa-eye' },
    { label: 'Visitantes', value: n(t?.visitors), icon: 'fa-solid fa-user-group' },
    {
      label: 'Páginas por visitante',
      value: t?.visitors ? (t.pageviews / t.visitors).toFixed(1) : '–',
      icon: 'fa-solid fa-layer-group',
    },
  ]
})
</script>

<template>
  <div class="metrics">
    <AdminPageHead
      title="Métricas"
      description="Visitas al sitio público según Vercel Web Analytics, sin cookies. Fechas en hora de Ecuador."
    />

    <div class="metrics__filters">
      <div class="metrics__presets" role="group" aria-label="Rango de fechas">
        <button
          v-for="p in METRICS_PRESETS"
          :key="p.days"
          type="button"
          class="metrics__chip"
          :class="{ 'metrics__chip--active': preset === p.days }"
          :aria-pressed="preset === p.days"
          @click="setPreset(p.days)"
        >
          {{ p.label }}
        </button>
      </div>
      <div class="metrics__dates">
        <div>
          <label for="m-from">Desde</label>
          <input id="m-from" v-model="filters.from" type="date" :max="filters.to" @input="preset = null" />
        </div>
        <div>
          <label for="m-to">Hasta</label>
          <input id="m-to" v-model="filters.to" type="date" :min="filters.from" :max="today" @input="preset = null" />
        </div>
      </div>
    </div>

    <div v-if="active.length" class="metrics__active">
      <span>Filtrando por</span>
      <button
        v-for="f in active"
        :key="f.key"
        type="button"
        class="metrics__tag"
        :aria-label="`Quitar filtro ${METRICS_FILTER_LABEL[f.key]}`"
        @click="setFilter(f.key, f.value)"
      >
        {{ METRICS_FILTER_LABEL[f.key] }}:
        {{ f.key === 'device' ? device(f.value) : f.key === 'country' ? country(f.value) : f.value }}
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>

    <p v-if="notConnected" class="metrics__notice">
      <i class="fa-solid fa-plug-circle-xmark" aria-hidden="true"></i>
      Las métricas todavía no están conectadas a Vercel. Apenas se conecten, aquí verás las visitas del sitio.
    </p>
    <p v-else-if="error" class="metrics__notice metrics__notice--error">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>

    <div v-else-if="data" class="metrics__body" :class="{ 'metrics__body--loading': loading }">
      <section class="metrics__stats">
        <StatCard v-for="card in cards" :key="card.label" v-bind="card" />
      </section>

      <MetricsChart :series="series" :hourly="data.hourly" />

      <p class="metrics__hint">Toca una página, un país o un dispositivo para filtrar todo el panel.</p>
      <div class="metrics__grid">
        <MetricsBreakdown
          title="Páginas más vistas"
          :rows="data.paths"
          :active="filters.path"
          pickable
          @pick="setFilter('path', $event)"
        />
        <MetricsBreakdown title="De dónde llegan" :rows="data.referers" :format="referer" />
        <MetricsBreakdown
          title="Países"
          :rows="data.countries"
          :active="filters.country"
          :format="country"
          pickable
          @pick="setFilter('country', $event)"
        />
        <MetricsBreakdown
          title="Dispositivos"
          :rows="data.devices"
          :active="filters.device"
          :format="device"
          pickable
          @pick="setFilter('device', $event)"
        />
        <MetricsBreakdown title="Navegadores" :rows="data.browsers" />
      </div>
    </div>

    <p v-else-if="loading" class="metrics__notice">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Cargando métricas…
    </p>
  </div>
</template>

<style scoped lang="scss">
.metrics {
  &__filters {
    @include flex(column, stretch, flex-start, 1rem);
    margin-bottom: 1rem;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__presets,
  &__active {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__dates {
    @include flex(row, flex-end, flex-start, 0.6rem);

    > div {
      flex: 1 1 0;
      min-width: 0;
    }
  }

  &__chip,
  &__tag {
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
  }

  &__chip--active,
  &__tag {
    background: $night;
    border-color: $night;
    color: $surface;
  }

  &__tag {
    @include flex(row, center, center, 0.5rem);
  }

  &__active {
    margin-bottom: 1rem;
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__notice {
    @include card;
    @include flex(row, center, center, 0.6rem);
    padding: 2.5rem 1rem;
    text-align: center;
    font-size: $text-sm;
    color: $ink-muted;

    &--error {
      color: $accent-deep;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 1rem);
    @include transition(opacity);

    &--loading {
      opacity: 0.6;
    }
  }

  &__stats {
    @include flex-cards(180px, 0.75rem);
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__grid {
    @include flex-cards(300px, 1rem);
    align-items: flex-start;
  }
}
</style>

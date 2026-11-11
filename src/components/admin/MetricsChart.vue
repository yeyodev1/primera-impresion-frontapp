<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MetricsRow } from '@/types'

// Páginas vistas en el tiempo: una sola serie, barras finas con tooltip al
// pasar el cursor o al enfocar con teclado.
const props = defineProps<{ series: MetricsRow[]; hourly: boolean }>()

const hover = ref<number | null>(null)
const hourFormat = new Intl.DateTimeFormat('es-EC', { timeZone: 'America/Guayaquil', hour: '2-digit', minute: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('es-EC', { timeZone: 'UTC', day: 'numeric', month: 'short' })

function label(row: MetricsRow) {
  return props.hourly
    ? hourFormat.format(new Date(row.value))
    : dayFormat.format(new Date(`${row.value}T12:00:00Z`))
}

const max = computed(() => Math.max(1, ...props.series.map((r) => r.pageviews)))
const ticks = computed(() => {
  const n = props.series.length
  if (!n) return []
  return [...new Set([0, Math.floor((n - 1) / 2), n - 1])].map((i) => ({
    i,
    text: label(props.series[i]!),
  }))
})
const tip = computed(() => (hover.value === null ? null : props.series[hover.value] ?? null))
</script>

<template>
  <figure class="chart">
    <figcaption class="chart__head">
      <h2>Páginas vistas</h2>
      <span class="chart__max">Máx. {{ max.toLocaleString('es-EC') }}</span>
    </figcaption>
    <div class="chart__plot" @mouseleave="hover = null">
      <div
        v-for="(row, i) in series"
        :key="row.value"
        class="chart__slot"
        tabindex="0"
        :aria-label="`${label(row)}: ${row.pageviews} páginas vistas, ${row.visitors} visitantes`"
        @mouseenter="hover = i"
        @focus="hover = i"
        @blur="hover = null"
      >
        <span
          class="chart__bar"
          :class="{ 'chart__bar--on': hover === i }"
          :style="{ height: `${(row.pageviews / max) * 100}%` }"
        ></span>
      </div>
      <div
        v-if="tip && hover !== null"
        class="chart__tip"
        :style="{ left: `${((hover + 0.5) / series.length) * 100}%` }"
        role="status"
      >
        <strong>{{ label(tip) }}</strong>
        <span>{{ tip.pageviews.toLocaleString('es-EC') }} páginas vistas</span>
        <span>{{ tip.visitors.toLocaleString('es-EC') }} visitantes</span>
      </div>
    </div>
    <div class="chart__axis" aria-hidden="true">
      <span
        v-for="t in ticks"
        :key="t.i"
        :style="{ left: `${((t.i + 0.5) / series.length) * 100}%` }"
      >
        {{ t.text }}
      </span>
    </div>
  </figure>
</template>

<style scoped lang="scss">
.chart {
  @include card;
  padding: 1rem 1.1rem 0.6rem;
  margin: 0;

  &__head {
    @include flex(row, baseline, space-between, 1rem);
    margin-bottom: 1rem;

    h2 {
      font-size: $text-lg;
    }
  }

  &__max {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__plot {
    @include flex(row, flex-end, flex-start, 2px);
    position: relative;
    height: 200px;
    border-bottom: 1px solid $line;
  }

  // El área sensible es toda la columna, no solo la barra.
  &__slot {
    @include flex(column, stretch, flex-end);
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
    cursor: default;

    &:focus-visible {
      outline-offset: 0;
    }
  }

  &__bar {
    display: block;
    max-width: 28px;
    width: 100%;
    margin: 0 auto;
    min-height: 1px;
    border-radius: 4px 4px 0 0;
    background: $accent-deep;
    opacity: 0.85;

    &--on {
      opacity: 1;
    }
  }

  &__tip {
    @include flex(column, flex-start, flex-start, 0.1rem);
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    padding: 0.5rem 0.7rem;
    border-radius: $radius-sm;
    background: $night;
    color: $surface;
    font-size: $text-sm;
    white-space: nowrap;
    pointer-events: none;
    z-index: 1;
  }

  &__axis {
    position: relative;
    height: 1.6rem;
    font-size: $text-sm;
    color: $ink-muted;

    span {
      position: absolute;
      top: 0.35rem;
      transform: translateX(-50%);
      white-space: nowrap;

      &:first-child {
        transform: none;
        left: 0 !important;
      }

      &:last-child:not(:first-child) {
        transform: none;
        left: auto !important;
        right: 0;
      }
    }
  }
}
</style>

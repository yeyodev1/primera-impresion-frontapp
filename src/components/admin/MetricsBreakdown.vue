<script setup lang="ts">
import { computed } from 'vue'
import type { MetricsRow } from '@/types'

// Top de una dimensión (páginas, países…) como lista con barra proporcional.
// Con `pickable`, cada fila filtra todo el panel por ese valor.
const props = defineProps<{
  title: string
  rows: MetricsRow[]
  active?: string
  pickable?: boolean
  format?: (value: string) => string
}>()
const emit = defineEmits<{ pick: [value: string] }>()

const max = computed(() => Math.max(1, ...props.rows.map((r) => r.pageviews)))
const text = (value: string) => (props.format ? props.format(value) : value) || 'Sin dato'
</script>

<template>
  <section class="bd">
    <header class="bd__head">
      <h2>{{ title }}</h2>
      <span>Vistas</span>
    </header>
    <p v-if="!rows.length" class="bd__empty">Sin datos en este rango.</p>
    <ul v-else class="bd__list">
      <li v-for="row in rows" :key="row.value">
        <component
          :is="pickable ? 'button' : 'div'"
          :type="pickable ? 'button' : undefined"
          class="bd__row"
          :class="{ 'bd__row--pick': pickable, 'bd__row--active': active === row.value }"
          :aria-pressed="pickable ? active === row.value : undefined"
          :title="pickable ? 'Filtrar por este valor' : undefined"
          @click="pickable && emit('pick', row.value)"
        >
          <span class="bd__fill" :style="{ width: `${(row.pageviews / max) * 100}%` }"></span>
          <span class="bd__label">{{ text(row.value) }}</span>
          <span class="bd__value">{{ row.pageviews.toLocaleString('es-EC') }}</span>
        </component>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.bd {
  @include card;
  padding: 1rem 1.1rem;

  &__head {
    @include flex(row, baseline, space-between, 1rem);
    margin-bottom: 0.7rem;

    h2 {
      font-size: $text-base;
    }

    span {
      font-size: $text-sm;
      color: $ink-muted;
    }
  }

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 2px);
  }

  &__row {
    @include flex(row, center, space-between, 0.75rem);
    position: relative;
    width: 100%;
    min-height: 34px;
    padding: 0 0.6rem;
    border-radius: 4px;
    background: none;
    font-size: $text-sm;
    text-align: left;
    color: $ink;

    &--pick {
      cursor: pointer;

      &:hover .bd__fill {
        background: rgba($accent, 0.28);
      }
    }

    &--active {
      box-shadow: inset 0 0 0 1px $accent-deep;
    }
  }

  &__fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 4px;
    background: rgba($accent, 0.16);
  }

  &__label,
  &__value {
    position: relative;
  }

  &__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value {
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    color: $ink-soft;
  }
}
</style>
